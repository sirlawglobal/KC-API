// cloudinaryConfig.js
require('dotenv').config();
const cloudinary = require('cloudinary').v2;

// const {CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET} = process.env

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});

// cloudinary.config({
//   cloud_name: 'dzoewlcdy',
//   api_key: '782489314224354',
//   api_secret: 'wQCD4cFEfysZERrfUPgHkKebkG4'
// });

module.exports = cloudinary;
