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

module.exports = router;
