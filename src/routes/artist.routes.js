const router = require('express').Router();
const artistController = require('../controllers/artist.controller');
const { imageUpload } = require('../middleware/upload.middleware');
const { authenticate } = require('../middleware/auth.middleware');

const { ensureContractAccepted } = require('../middleware/legalCheck');

// Special route for artist creation during registration (no legal check required)
router.post('/create-during-registration', authenticate, artistController.createArtist);

router.post('/create', authenticate, ensureContractAccepted, artistController.createArtist);
router.get('/get-all', artistController.getAllArtists);
router.get('/get-artist-by-id/:id', artistController.getArtistById);
router.put('/update/:id', authenticate, ensureContractAccepted, artistController.updateArtist);
router.delete('/delete/:id', authenticate, ensureContractAccepted, artistController.deleteArtist);
router.post('/:id/image', authenticate, imageUpload('file'), artistController.uploadImage);
router.get('/user/:userId', artistController.getArtistByUserId);
router.get('/approved', artistController.getApprovedArtists);
router.get('/pending', artistController.getPendingArtists);
router.get('/rejected', artistController.getRejectedArtists);
router.put('/:id/status', authenticate, artistController.updateArtistStatus);

module.exports = router;