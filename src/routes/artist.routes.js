const router = require('express').Router();
const artistController = require('../controllers/artist.controller');
const { imageUpload } = require('../middleware/upload.middleware');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/create', artistController.createArtist);
router.get('/get-all', artistController.getAllArtists);
router.get('/get-artist-by-id/:id', artistController.getArtistById);
router.put('/update/:id', artistController.updateArtist);
router.delete('/delete/:id', artistController.deleteArtist);
router.post('/:id/image', authenticate, imageUpload('file'), artistController.uploadImage);
router.get('/user/:userId', artistController.getArtistByUserId);
router.get('/approved', artistController.getApprovedArtists);
router.get('/pending', artistController.getPendingArtists);
router.get('/rejected', artistController.getRejectedArtists);

module.exports = router;