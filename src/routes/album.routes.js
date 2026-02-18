const router = require('express').Router();
const albumController = require('../controllers/album.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validateIdParam, validateCreateAlbum, validateUpdateAlbum } = require('../middleware/validators/album.validator');
const { imageUpload } = require('../middleware/upload.middleware');
const { ensureContractAccepted } = require('../middleware/legalCheck');
const authorizeRoles = require('../middleware/role.middleware');
const { ensureAlbumOwnership, ensureArtistOwnership } = require('../middleware/albumOwnership.middleware');

// Public read routes
router.get('/', albumController.getAllAlbums);
router.get('/:id', validateIdParam, albumController.getAlbumById);
router.get('/artist/:artistId', albumController.getAlbumsByArtistId);

// Admin and Moderator routes for moderation
router.get('/admin/albums/pending', authenticate, authorizeRoles('admin', 'super_admin', 'moderator'), albumController.getPendingAlbums);
router.put('/admin/albums/:id/approve', authenticate, authorizeRoles('admin', 'super_admin', 'moderator'), albumController.approveAlbum);
router.put('/admin/albums/:id/reject', authenticate, authorizeRoles('admin', 'super_admin', 'moderator'), albumController.rejectAlbum);

// Protected write routes
router.post('/', authenticate, ensureContractAccepted, ensureArtistOwnership, validateCreateAlbum, albumController.createAlbum);
router.put('/:id', authenticate, ensureContractAccepted, validateIdParam, ensureAlbumOwnership, validateUpdateAlbum, albumController.updateAlbum);
router.delete('/:id', authenticate, validateIdParam, ensureAlbumOwnership, albumController.deleteAlbum);
router.post('/:id/cover', authenticate, ensureContractAccepted, validateIdParam, ensureAlbumOwnership, imageUpload('file'), albumController.uploadCover);

module.exports = router;
