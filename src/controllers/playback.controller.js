const { PlaybackLog } = require('../models');

// create a playback log for current user
exports.createPlaybackLog = async (req, res) => {
  try {
    const user_id = req.user && req.user.id;
    if (!user_id) return res.status(401).json({ error: 'Unauthorized' });

    const { song_id, device_type, device_os, device_model, ip_address, played_at } = req.body;
    if (!song_id) return res.status(400).json({ error: 'song_id is required' });

    const log = await PlaybackLog.create({
      user_id,
      song_id,
      device_type,
      device_os,
      device_model,
      ip_address,
      played_at
    });

    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get playback logs for current user (optional filter by song)
exports.getPlaybackLogs = async (req, res) => {
  try {
    const user_id = req.user && req.user.id;
    if (!user_id) return res.status(401).json({ error: 'Unauthorized' });
    const { song_id } = req.query;
    const where = { user_id };
    if (song_id) where.song_id = song_id;

    const logs = await PlaybackLog.findAll({ where });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get playback logs for any user (admin or the user themself)
exports.getPlaybackLogsForUser = async (req, res) => {
  try {
    const requester = req.user;
    if (!requester) return res.status(401).json({ error: 'Unauthorized' });

    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) return res.status(400).json({ error: 'Invalid userId' });

    // allow if admin or requesting own logs
    if (requester.role !== 'admin' && requester.id !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { song_id } = req.query;
    const where = { user_id: userId };
    if (song_id) where.song_id = song_id;

    const logs = await PlaybackLog.findAll({ where });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
