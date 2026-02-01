const router = require('express').Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth.middleware');


router.get('/me', authenticate, userController.getProfile);
// Operan sobre el usuario autenticado (id desde el token)
router.put('/me', authenticate, userController.updateProfile);
router.put('/change-password', authenticate, userController.changePassword);
router.delete('/me', authenticate, userController.deleteAccount);
const { imageUpload } = require('../middleware/upload.middleware');
// avatar upload
router.post('/me/avatar', authenticate, imageUpload('file'), userController.uploadAvatar);
// avatar upload by ID (for admin use)
router.post('/:id/avatar', authenticate, imageUpload('file'), userController.uploadAvatarById);
//admin routes
router.get('/admin', authenticate, userController.getAllUsers);
router.get('/admin/:id', authenticate, userController.getUserById);
router.put('/admin/:id', authenticate, userController.updateUser);
router.delete('/admin/:id', authenticate, userController.deleteUser);

module.exports = router;
