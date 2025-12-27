const router = require('express').Router();
const notificationController = require('../controllers/notification.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/', authenticate, notificationController.getNotificationsForUser);
router.post('/', authenticate, notificationController.createNotification);
router.delete('/:id', authenticate, notificationController.deleteNotification);

module.exports = router;
