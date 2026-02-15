const router = require('express').Router();
const notificationController = require('../controllers/notification.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Get notifications for current user with unread count
router.get('/', authenticate, notificationController.getNotificationsForUser);

// Get unread count only (for badge)
router.get('/unread-count', authenticate, notificationController.getUnreadCount);

// Create notification (admin/system)
router.post('/', authenticate, notificationController.createNotification);

// Mark notification as read
router.put('/:id/read', authenticate, notificationController.markAsRead);

// Mark all notifications as read
router.post('/mark-all-read', authenticate, notificationController.markAllAsRead);

// Delete specific notification
router.delete('/:id', authenticate, notificationController.deleteNotification);

// Clear all notifications for user
router.delete('/clear-all', authenticate, notificationController.clearAllNotifications);

module.exports = router;
