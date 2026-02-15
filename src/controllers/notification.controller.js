const { Notification } = require('../models');

// create notification for a user (admin or system)
exports.createNotification = async (req, res) => {
  try {
    const { user_id, type, title, message, priority, action_url } = req.body;
    
    if (!user_id || !title || !message) {
      return res.status(400).json({ error: 'user_id, title and message required' });
    }
    
    const notificationData = {
      user_id,
      type: type || 'system',
      title,
      message,
      priority: priority || 'medium',
      action_url: action_url || null
    };
    
    const notification = await Notification.create(notificationData);
    res.status(201).json(notification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: error.message });
  }
};

// get notifications for current user
exports.getNotificationsForUser = async (req, res) => {
  try {
    const user_id = req.user && req.user.id;
    if (!user_id) return res.status(401).json({ error: 'Unauthorized' });
    
    const notifications = await Notification.findAll({
      where: { user_id },
      order: [['created_at', 'DESC']],
      limit: 50 // Limitar a 50 notificaciones más recientes
    });
    
    // Contar no leídas
    const unreadCount = notifications.filter(n => !n.is_read).length;
    
    res.json({
      notifications,
      unreadCount,
      total: notifications.length
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: error.message });
  }
};

// mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    
    if (notification.user_id !== user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    await notification.update({ is_read: true });
    res.json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: error.message });
  }
};

// mark all notifications as read for user
exports.markAllAsRead = async (req, res) => {
  try {
    const user_id = req.user && req.user.id;
    if (!user_id) return res.status(401).json({ error: 'Unauthorized' });
    
    const [updatedCount] = await Notification.update(
      { is_read: true },
      { where: { user_id, is_read: false } }
    );
    
    res.json({ 
      message: 'All notifications marked as read',
      updatedCount 
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ error: error.message });
  }
};

// delete notification (owner)
exports.deleteNotification = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    
    if (notification.user_id !== user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    await notification.destroy();
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: error.message });
  }
};

// clear all notifications for user
exports.clearAllNotifications = async (req, res) => {
  try {
    const user_id = req.user && req.user.id;
    if (!user_id) return res.status(401).json({ error: 'Unauthorized' });
    
    const deletedCount = await Notification.destroy({
      where: { user_id }
    });
    
    res.json({ 
      message: 'All notifications cleared',
      deletedCount 
    });
  } catch (error) {
    console.error('Error clearing all notifications:', error);
    res.status(500).json({ error: error.message });
  }
};

// get unread count for user
exports.getUnreadCount = async (req, res) => {
  try {
    const user_id = req.user && req.user.id;
    if (!user_id) return res.status(401).json({ error: 'Unauthorized' });
    
    const unreadCount = await Notification.count({
      where: { user_id, is_read: false }
    });
    
    res.json({ unreadCount });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({ error: error.message });
  }
};
