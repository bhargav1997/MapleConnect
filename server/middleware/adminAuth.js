const jwt = require("jsonwebtoken");
const User = require("../models/User");

const adminAuth = async (req, res, next) => {
   try {
      let token;

      // Check if token exists in headers
      if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
         token = req.headers.authorization.split(" ")[1];
      }

      // Check if token exists
      if (!token) {
         return res.status(401).json({
            success: false,
            error: "Not authorized to access this route",
         });
      }

      try {
         // Verify token
         const decoded = jwt.verify(token, process.env.JWT_SECRET);

         // Get user from token
         const user = await User.findById(decoded.id);

         if (!user) {
            return res.status(401).json({
               success: false,
               error: "User not found",
            });
         }

         // Check if user is admin
         if (!user.isAdmin) {
            return res.status(403).json({
               success: false,
               error: "Not authorized to access admin routes",
            });
         }

         // Add user to request object
         req.user = user;
         next();
      } catch (err) {
         return res.status(401).json({
            success: false,
            error: "Not authorized to access this route",
         });
      }
   } catch (err) {
      return res.status(500).json({
         success: false,
         error: "Server Error",
      });
   }
};

module.exports = adminAuth;
