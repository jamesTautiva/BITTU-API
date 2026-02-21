const multer = require('multer');

const storage = multer.memoryStorage();

const imageMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const audioMimes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/x-flac', 'audio/flac'];

const makeUpload = (allowedMimes) => multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!allowedMimes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB by default
  }
});

// Middleware for FormData with optional file upload
const formDataUpload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file) {
      // If file exists, validate it
      if (!imageMimes.includes(file.mimetype)) {
        return cb(new Error('Invalid file type'), false);
      }
    }
    cb(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB by default
  }
}).single('cover_image'); // Make file optional

exports.imageUpload = (fieldName) => makeUpload(imageMimes).single(fieldName);
exports.audioUpload = (fieldName) => makeUpload(audioMimes).single(fieldName);
exports.formDataUpload = formDataUpload;
