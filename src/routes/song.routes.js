const router = require('express').Router();
const songController = require('../controllers/song.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { audioUpload } = require('../middleware/upload.middleware');

// Public
router.get('/', songController.getAllSongs);
router.get('/:id', songController.getSongById);

// Protected
router.post('/', authenticate, songController.createSong);
router.put('/:id', authenticate, songController.updateSong);
router.delete('/:id', authenticate, songController.deleteSong);
router.post('/:id/upload', authenticate, audioUpload('file'), songController.uploadAudio);

module.exports = router;
