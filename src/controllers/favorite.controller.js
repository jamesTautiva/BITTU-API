const { Favorite, Song } = require('../models');

// add favorite for current user
exports.addFavorite = async (req, res) => {
  try {
    const user_id = req.user && req.user.id;
    const { song_id } = req.body;
    if (!user_id) return res.status(401).json({ error: 'Unauthorized' });
    if (!song_id) return res.status(400).json({ error: 'song_id is required' });

    const song = await Song.findByPk(song_id);
    if (!song) return res.status(404).json({ error: 'Song not found' });

    // prevent duplicates
    const existing = await Favorite.findOne({ where: { user_id, song_id } });
    if (existing) return res.status(409).json({ error: 'Already favorited' });

    const fav = await Favorite.create({ user_id, song_id });
    res.status(201).json(fav);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get all favorites for current user
exports.getFavoritesForUser = async (req, res) => {
  try {
    const user_id = req.user && req.user.id;
    if (!user_id) return res.status(401).json({ error: 'Unauthorized' });
    const favs = await Favorite.findAll({ where: { user_id } });
    res.json(favs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// delete favorite by id
exports.deleteFavorite = async (req, res) => {
  try {
    const user_id = req.user && req.user.id;
    if (!user_id) return res.status(401).json({ error: 'Unauthorized' });

    const fav = await Favorite.findByPk(req.params.id);
    if (!fav) return res.status(404).json({ error: 'Favorite not found' });
    if (fav.user_id !== user_id) return res.status(403).json({ error: 'Forbidden' });

    await fav.destroy();
    res.json({ message: 'Favorite removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// delete favorite by song id (current user)
exports.deleteFavoriteBySong = async (req, res) => {
  try {
    const user_id = req.user && req.user.id;
    const song_id = req.params.songId;
    if (!user_id) return res.status(401).json({ error: 'Unauthorized' });

    const fav = await Favorite.findOne({ where: { user_id, song_id } });
    if (!fav) return res.status(404).json({ error: 'Favorite not found' });

    await fav.destroy();
    res.json({ message: 'Favorite removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
