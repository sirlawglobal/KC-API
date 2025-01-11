// uploadMiddleware.js
const multer = require('multer');
const path = require('path');

// Set Multer storage options for temporarily storing files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Temporarily store files in 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Generate a unique file name
  },
});

// Filter to only allow certain file types for each attachment type
const fileFilter = (req, file, cb) => {
  const fileTypes = {
    resume: /pdf|docx|doc/,  // Allow PDF and Word documents for resume
    id_proof: /jpeg|jpg|png|gif/,  // Allow image files for ID proof
    certification: /pdf|docx|doc/,  // Allow PDF and Word documents for certification
  };

  // Get the type of attachment from the request body
  const attachmentType = req.body.attachmentType;

  // Validate the file type based on the provided attachment type
  if (fileTypes[attachmentType]) {
    const mimeType = fileTypes[attachmentType].test(file.mimetype);

    if (mimeType) {
      return cb(null, true);
    } else {
      return cb(new Error(`Invalid file type for ${attachmentType}. Allowed types are: ${fileTypes[attachmentType].toString()}`));
    }
  } else {
    return cb(new Error('Invalid attachment type.'));
  }
};

// Initialize multer upload for multiple files
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },  // Limit file size to 5MB per file
});

// Export upload middleware for multiple file uploads
module.exports = upload.array('attachments', 5);  // Allow up to 5 files to be uploaded
