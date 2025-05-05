const User = require("../models/User");

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

      // Check for user
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

      sendTokenResponse(user, 200, res);
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
      },
   });
};
