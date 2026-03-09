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

// Middleware for FormData with optional file upload (for albums)
const formDataUpload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    console.log('=== UPLOAD MIDDLEWARE DEBUG ===');
    console.log('File received:', !!file);
    if (file) {
      console.log('File details:', {
        fieldname: file.fieldname,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size
      });
      
      // If file exists, validate it
      if (!imageMimes.includes(file.mimetype)) {
        console.log('Invalid file type:', file.mimetype);
        return cb(new Error('Invalid file type'), false);
      }
    } else {
      console.log('No file in this request');
    }
    cb(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB by default
  }
}).single('cover_image'); // Make file optional

// Middleware for FormData with optional audio file upload (for songs)
const audioFormDataUpload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file) {
      // If file exists, validate it
      if (!audioMimes.includes(file.mimetype)) {
        return cb(new Error('Invalid audio file type'), false);
      }
    }
    cb(null, true);
  },
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB for audio files
  }
}).fields([
  { name: 'audio_file', maxCount: 1 },
  { name: 'title', maxCount: 1 },
  { name: 'album_id', maxCount: 1 }
]); // Process multiple fields

exports.imageUpload = (fieldName) => makeUpload(imageMimes).single(fieldName);
exports.audioUpload = (fieldName) => makeUpload(audioMimes).single(fieldName);
exports.formDataUpload = formDataUpload;
exports.audioFormDataUpload = audioFormDataUpload;
