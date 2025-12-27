const router = require('express').Router();
const albumController = require('../controllers/album.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validateIdParam, validateCreateAlbum, validateUpdateAlbum } = require('../middleware/validators/album.validator');
const { imageUpload } = require('../middleware/upload.middleware');

// Public read routes
router.get('/', albumController.getAllAlbums);
router.get('/:id', validateIdParam, albumController.getAlbumById);

// Protected write routes
router.post('/', authenticate, validateCreateAlbum, albumController.createAlbum);
router.put('/:id', authenticate, validateIdParam, validateUpdateAlbum, albumController.updateAlbum);
router.delete('/:id', authenticate, validateIdParam, albumController.deleteAlbum);
router.post('/:id/cover', authenticate, validateIdParam, imageUpload('file'), albumController.uploadCover);

module.exports = router;
