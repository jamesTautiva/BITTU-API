const { PlaylistSong, Playlist, Song } = require('../models');

// add song to playlist (owner only)
exports.addSongToPlaylist = async (req, res) => {
  try {
    const user = req.user;
    const { playlistId } = req.params;
    const { song_id } = req.body;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    if (!song_id) return res.status(400).json({ error: 'song_id is required' });

    const playlist = await Playlist.findByPk(playlistId);
    if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
    if (playlist.user_id !== user.id) return res.status(403).json({ error: 'Forbidden' });

    const song = await Song.findByPk(song_id);
    if (!song) return res.status(404).json({ error: 'Song not found' });

    // prevent duplicates
    const exists = await PlaylistSong.findOne({ where: { playlist_id: playlistId, song_id } });
    if (exists) return res.status(409).json({ error: 'Song already in playlist' });

    const ps = await PlaylistSong.create({ playlist_id: playlistId, song_id });
    res.status(201).json(ps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// remove song from playlist (owner only)
exports.removeSongFromPlaylist = async (req, res) => {
  try {
    const user = req.user;
    const { playlistId, songId } = req.params;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const playlist = await Playlist.findByPk(playlistId);
    if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
    if (playlist.user_id !== user.id) return res.status(403).json({ error: 'Forbidden' });

    const ps = await PlaylistSong.findOne({ where: { playlist_id: playlistId, song_id: songId } });
    if (!ps) return res.status(404).json({ error: 'Song not in playlist' });

    await ps.destroy();
    res.json({ message: 'Song removed from playlist' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// list songs in playlist
exports.getSongsInPlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const items = await PlaylistSong.findAll({ where: { playlist_id: playlistId } });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
