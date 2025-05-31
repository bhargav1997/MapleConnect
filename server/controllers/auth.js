const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const { checkEmailConfig } = require("../utils/checkConfig");

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
   try {
      console.log("Register request received:", req.body);
      const { name, username, email, password } = req.body;

      // Validate input
      if (!name || !username || !email || !password) {
         console.log("Missing required fields");
         return res.status(400).json({
            success: false,
            error: "Please provide name, username, email and password",
         });
      }

      // Check if email already exists
      const emailExists = await User.findOne({ email });
      if (emailExists) {
         console.log("Email already exists:", email);
         return res.status(400).json({
            success: false,
            error: "Email already in use",
         });
      }

      // Check if username already exists
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
         console.log("Username already exists:", username);
         return res.status(400).json({
            success: false,
            error: "Username already taken",
         });
      }

      // Create user
      console.log("Creating new user:", email);
      const user = await User.create({
         name,
         username,
         email,
         password,
      });

      console.log("User created successfully:", user._id);
      sendTokenResponse(user, 201, res);
   } catch (err) {
      console.error("Registration error:", err);
      if (err.name === "ValidationError") {
         const messages = Object.values(err.errors).map((val) => val.message);
         return res.status(400).json({
            success: false,
            error: messages.join(", "),
         });
      }
      next(err);
   }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
   try {
      const { email, password } = req.body;

      // Validate email & password
      if (!email || !password) {
         return res.status(400).json({
            success: false,
            error: "Please provide an email and password",
         });
      }

      // Check for user and include isAdmin field
      const user = await User.findOne({ email }).select("+password");

      if (!user) {
         return res.status(401).json({
            success: false,
            error: "Invalid credentials",
         });
      }

      // Check if password matches
      const isMatch = await user.matchPassword(password);

      if (!isMatch) {
         return res.status(401).json({
            success: false,
            error: "Invalid credentials",
         });
      }

      // Include isAdmin in the response
      const userResponse = user.toObject();
      delete userResponse.password;

      res.status(200).json({
         success: true,
         user: userResponse,
         token: user.getSignedJwtToken(),
      });
   } catch (err) {
      next(err);
   }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
   try {
      const user = await User.findById(req.user.id);

      res.status(200).json({
         success: true,
         data: user,
      });
   } catch (err) {
      next(err);
   }
};

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
   res.status(200).json({
      success: true,
      data: {},
   });
};

// @desc    Generate and send OTP for login
// @route   POST /api/auth/generate-login-otp
// @access  Public
exports.generateLoginOTP = async (req, res, next) => {
   try {
      // Check email configuration first
      if (!checkEmailConfig()) {
         return res.status(500).json({
            success: false,
            error: "Email service is not properly configured",
         });
      }

      const { email } = req.body;

      if (!email) {
         return res.status(400).json({
            success: false,
            error: "Please provide an email",
         });
      }

      // Check if user exists
      const user = await User.findOne({ email }).select("+otp +otpExpiry");
      if (!user) {
         return res.status(404).json({
            success: false,
            error: "User not found",
         });
      }

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Set OTP using the new method
      await user.setOTP(otp);

      // Send OTP via email
      const message = `
         <h1>Your Login OTP</h1>
         <p>Your OTP for logging into MapleConnect is: <strong>${otp}</strong></p>
         <p>This OTP will expire in 15 minutes.</p>
         <p>If you didn't request this OTP, please ignore this email.</p>
      `;

      try {
         await sendEmail({
            email: user.email,
            subject: "Your Login OTP - MapleConnect",
            html: message,
         });

         // Generate temporary token for OTP verification
         const tempToken = jwt.sign({ id: user._id, purpose: "otp_verification" }, process.env.JWT_SECRET, { expiresIn: "15m" });

         res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            tempToken,
         });
      } catch (err) {
         console.error("OTP email sending failed:", err);
         // If email fails, clear OTP
         user.otp = undefined;
         user.otpExpiry = undefined;
         await user.save();

         return res.status(500).json({
            success: false,
            error: `Email could not be sent: ${err.message}`,
         });
      }
   } catch (err) {
      next(err);
   }
};

// @desc    Verify OTP and complete login
// @route   POST /api/auth/verify-login-otp
// @access  Public
exports.verifyLoginOTP = async (req, res, next) => {
   try {
      const { email, otp, tempToken } = req.body;

      if (!email || !otp || !tempToken) {
         return res.status(400).json({
            success: false,
            error: "Please provide email, OTP and temporary token",
         });
      }

      // Verify temp token
      const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
      if (decoded.purpose !== "otp_verification") {
         return res.status(400).json({
            success: false,
            error: "Invalid token",
         });
      }

      // Find user and select OTP fields
      const user = await User.findOne({ email }).select("+otp +otpExpiry");
      if (!user) {
         return res.status(404).json({
            success: false,
            error: "User not found",
         });
      }

      // Verify OTP using the new method
      const isValid = await user.verifyOTP(otp);
      if (!isValid) {
         return res.status(400).json({
            success: false,
            error: "Invalid or expired OTP",
         });
      }

      // Send final authentication token
      sendTokenResponse(user, 200, res);
   } catch (err) {
      if (err.name === "JsonWebTokenError") {
         return res.status(400).json({
            success: false,
            error: "Invalid token",
         });
      }
      next(err);
   }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-login-otp
// @access  Public
exports.resendLoginOTP = async (req, res, next) => {
   try {
      const { email, tempToken } = req.body;

      if (!email || !tempToken) {
         return res.status(400).json({
            success: false,
            error: "Please provide email and temporary token",
         });
      }

      // Verify temp token
      const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
      if (decoded.purpose !== "otp_verification") {
         return res.status(400).json({
            success: false,
            error: "Invalid token",
         });
      }

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
         return res.status(404).json({
            success: false,
            error: "User not found",
         });
      }

      // Generate new OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Store new OTP
      user.otp = otp;
      user.otpExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
      await user.save();

      // Send new OTP via email
      const message = `
         <h1>Your New Login OTP</h1>
         <p>Your new OTP for logging into MapleConnect is: <strong>${otp}</strong></p>
         <p>This OTP will expire in 15 minutes.</p>
         <p>If you didn't request this OTP, please ignore this email.</p>
      `;

      try {
         await sendEmail({
            email: user.email,
            subject: "Your New Login OTP - MapleConnect",
            html: message,
         });

         res.status(200).json({
            success: true,
            message: "OTP resent successfully",
         });
      } catch (err) {
         // If email fails, clear OTP and return error
         user.otp = undefined;
         user.otpExpiry = undefined;
         await user.save();

         return res.status(500).json({
            success: false,
            error: "Email could not be sent",
         });
      }
   } catch (err) {
      if (err.name === "JsonWebTokenError") {
         return res.status(400).json({
            success: false,
            error: "Invalid token",
         });
      }
      next(err);
   }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
   // Create token
   const token = user.getSignedJwtToken();

   res.status(statusCode).json({
      success: true,
      token,
      user: {
         id: user._id,
         name: user.name,
         username: user.username,
         email: user.email,
         profileImage: user.profileImage,
         isAdmin: user.isAdmin || false,
      },
   });
};
