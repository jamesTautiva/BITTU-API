const router = require('express').Router();
const songController = require('../controllers/song.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { audioUpload } = require('../middleware/upload.middleware');
const { ensureContractAccepted } = require('../middleware/legalCheck');

// Public
router.get('/', songController.getAllSongs);
router.get('/:id', songController.getSongById);

// Protected
router.post('/', authenticate, ensureContractAccepted, songController.createSong);
router.put('/:id', authenticate, ensureContractAccepted, songController.updateSong);
router.delete('/:id', authenticate, songController.deleteSong);
router.post('/:id/upload', authenticate, ensureContractAccepted, audioUpload('file'), songController.uploadAudio);

module.exports = router;
