const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes
exports.protect = async (req, res, next) => {
   try {
      let token;

      // Get token from Authorization header
      if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
         token = req.headers.authorization.split(" ")[1];
      }

      // Debug token
      console.log("Auth middleware - Token:", token);
      console.log("Auth middleware - Headers:", req.headers);

      if (!token) {
         return res.status(401).json({
            success: false,
            error: "Not authorized to access this route",
         });
      }

      try {
         // Verify token
         const decoded = jwt.verify(token, process.env.JWT_SECRET);
         console.log("Auth middleware - Decoded token:", decoded);

         // Get user from token
         const user = await User.findById(decoded.id);
         console.log("Auth middleware - Found user:", {
            id: user._id || user.id,
            name: user.name,
            email: user.email,
         });

         if (!user) {
            return res.status(401).json({
               success: false,
               error: "User not found",
            });
         }

         req.user = user;
         next();
      } catch (err) {
         console.error("Token verification error:", err);
         return res.status(401).json({
            success: false,
            error: "Not authorized to access this route",
         });
      }
   } catch (error) {
      console.error("Auth middleware error:", error);
      return res.status(500).json({
         success: false,
         error: "Server error in auth middleware",
      });
   }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
   return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
         return res.status(403).json({
            success: false,
            error: `User role ${req.user.role} is not authorized to access this route`,
         });
      }
      next();
   };
};
