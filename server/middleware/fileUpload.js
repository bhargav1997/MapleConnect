const multer = require("multer");
const ErrorResponse = require("../utils/errorResponse");

// File filter
const fileFilter = (req, file, cb) => {
   // Allowed file types
   const filetypes = /jpeg|jpg|png|gif/;
   // Check extension
   const extname = filetypes.test(file.originalname.toLowerCase());
   // Check mime type
   const mimetype = filetypes.test(file.mimetype);

   if (extname && mimetype) {
      return cb(null, true);
   } else {
      cb(new ErrorResponse("Only image files are allowed!", 400), false);
   }
};

// Initialize upload with memory storage
const upload = multer({
   storage: multer.memoryStorage(),
   limits: { fileSize: 5000000 }, // 5MB max file size
   fileFilter: fileFilter,
});

module.exports = upload;
