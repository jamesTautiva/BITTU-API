const router = require('express').Router();
const albumController = require('../controllers/album.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validateIdParam, validateCreateAlbum, validateUpdateAlbum } = require('../middleware/validators/album.validator');
const { imageUpload } = require('../middleware/upload.middleware');
const { ensureContractAccepted } = require('../middleware/legalCheck');

// Public read routes
router.get('/', albumController.getAllAlbums);
router.get('/:id', validateIdParam, albumController.getAlbumById);
router.get('/artist/:artistId', albumController.getAlbumsByArtistId);

// Protected write routes
router.post('/', authenticate, ensureContractAccepted, validateCreateAlbum, albumController.createAlbum);
router.put('/:id', authenticate, ensureContractAccepted, validateIdParam, validateUpdateAlbum, albumController.updateAlbum);
router.delete('/:id', authenticate, validateIdParam, albumController.deleteAlbum);
router.post('/:id/cover', authenticate, ensureContractAccepted, validateIdParam, imageUpload('file'), albumController.uploadCover);

module.exports = router;
