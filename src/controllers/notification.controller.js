const { Notification } = require('../models');

// create notification for a user (admin or system)
exports.createNotification = async (req, res) => {
  try {
    const { user_id, message } = req.body;
    if (!user_id || !message) return res.status(400).json({ error: 'user_id and message required' });
    const n = await Notification.create({ user_id, message });
    res.status(201).json(n);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get notifications for current user
exports.getNotificationsForUser = async (req, res) => {
  try {
    const user_id = req.user && req.user.id;
    if (!user_id) return res.status(401).json({ error: 'Unauthorized' });
    const notes = await Notification.findAll({ where: { user_id } });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// delete notification (owner)
exports.deleteNotification = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    const n = await Notification.findByPk(req.params.id);
    if (!n) return res.status(404).json({ error: 'Notification not found' });
    if (n.user_id !== user.id) return res.status(403).json({ error: 'Forbidden' });
    await n.destroy();
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
