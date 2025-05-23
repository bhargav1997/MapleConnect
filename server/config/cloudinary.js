const cloudinary = require("cloudinary").v2;
const ErrorResponse = require("../utils/errorResponse");

// Check for required environment variables
const requiredEnvVars = ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"];
const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingEnvVars.length > 0) {
   console.error("Missing required Cloudinary environment variables:", missingEnvVars);
   console.error("Please add these variables to your .env file");
   process.exit(1);
}

// Configure Cloudinary
cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
