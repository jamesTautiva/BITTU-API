const { Playlist } = require('../models');

// create playlist for authenticated user
exports.createPlaylist = async (req, res) => {
  try {
    const user_id = req.user && req.user.id;
    const { name, description } = req.body;
    if (!user_id) return res.status(401).json({ error: 'Unauthorized' });
    if (!name) return res.status(400).json({ error: 'name is required' });

    const playlist = await Playlist.create({ user_id, name, description });
    res.status(201).json(playlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get all playlists (optionally for a user)
exports.getAllPlaylists = async (req, res) => {
  try {
    const { user_id } = req.query;
    const where = {};
    if (user_id) where.user_id = user_id;
    const playlists = await Playlist.findAll({ where });
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get playlist by id
exports.getPlaylistById = async (req, res) => {
  try {
    const playlist = await Playlist.findByPk(req.params.id);
    if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// update playlist (owner only)
exports.updatePlaylist = async (req, res) => {
  try {
    const user = req.user;
    const playlist = await Playlist.findByPk(req.params.id);
    if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
    if (!user || user.id !== playlist.user_id) return res.status(403).json({ error: 'Forbidden' });

    const { name, description } = req.body;
    if (name) playlist.name = name;
    if (description) playlist.description = description;
    await playlist.save();
    res.json({ message: 'Playlist updated', playlist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// delete playlist (owner only)
exports.deletePlaylist = async (req, res) => {
  try {
    const user = req.user;
    const playlist = await Playlist.findByPk(req.params.id);
    if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
    if (!user || user.id !== playlist.user_id) return res.status(403).json({ error: 'Forbidden' });

    await playlist.destroy();
    res.json({ message: 'Playlist deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
