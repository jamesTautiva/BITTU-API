const { Song, Album } = require('../models');
const path = require('path');
const { uploadFile } = require('../utils/supabaseClient');

// create song
exports.createSong = async (req, res) => {
  try {
    const { album_id, title, audio_url } = req.body;
    if (!album_id || !title) return res.status(400).json({ error: 'album_id and title are required' });

    const album = await Album.findByPk(album_id);
    if (!album) return res.status(404).json({ error: 'Album not found' });

    const song = await Song.create({ album_id, title, audio_url });
    res.status(201).json(song);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get all songs
exports.getAllSongs = async (req, res) => {
  try {
    const songs = await Song.findAll();
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get song by id
exports.getSongById = async (req, res) => {
  try {
    const song = await Song.findByPk(req.params.id);
    if (!song) return res.status(404).json({ error: 'Song not found' });
    res.json(song);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// update song
exports.updateSong = async (req, res) => {
  try {
    const song = await Song.findByPk(req.params.id);
    if (!song) return res.status(404).json({ error: 'Song not found' });

    const { title, audio_url } = req.body;
    if (title) song.title = title;
    if (audio_url) song.audio_url = audio_url;

    await song.save();
    res.json({ message: 'Song updated', song });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// delete song
exports.deleteSong = async (req, res) => {
  try {
    const song = await Song.findByPk(req.params.id);
    if (!song) return res.status(404).json({ error: 'Song not found' });
    await song.destroy();
    res.json({ message: 'Song deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// upload audio file for song
exports.uploadAudio = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) return res.status(400).json({ error: 'No file uploaded' });
    const song = await Song.findByPk(req.params.id);
    if (!song) return res.status(404).json({ error: 'Song not found' });

    const ext = path.extname(req.file.originalname) || '';
    const filename = `songs/song_${song.id}_${Date.now()}${ext}`;
    const url = await uploadFile('songs', filename, req.file.buffer, req.file.mimetype);

    song.audio_url = url;
    await song.save();
    res.json({ message: 'Audio uploaded', url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
