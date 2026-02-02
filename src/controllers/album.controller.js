const { Album, Artist, Genre, Song } = require('../models');
const path = require('path');
const { uploadFile } = require('../utils/supabaseClient');

// create album
exports.createAlbum = async (req, res) => {
  try {
    const { artist_id, title, cover_url, release_date } = req.body;

    if (!artist_id || !title) {
      return res.status(400).json({ error: 'artist_id and title are required' });
    }

    // Optionally check artist exists
    const artist = await Artist.findByPk(artist_id);
    if (!artist) return res.status(404).json({ error: 'Artist not found' });

    // if genre_id provided, ensure it exists
    if (req.body.genre_id) {
      const genre = await Genre.findByPk(req.body.genre_id);
      if (!genre) return res.status(404).json({ error: 'Genre not found' });
    }

    const album = await Album.create({ artist_id, title, cover_url, release_date, status: 'pending', genre_id: req.body.genre_id || null });
    res.status(201).json(album);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get all albums
exports.getAllAlbums = async (req, res) => {
  try {
  const albums = await Album.findAll({ include: [{ model: Genre, as: 'primaryGenre', attributes: ['id', 'name'] }] });
    res.json(albums);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get album by id
exports.getAlbumById = async (req, res) => {
  try {
  const album = await Album.findByPk(req.params.id, { 
    include: [
      { model: Genre, as: 'primaryGenre', attributes: ['id', 'name'] }
    ] 
  });
    if (!album) return res.status(404).json({ error: 'Album not found' });
    res.json(album);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get albums by artist id
exports.getAlbumsByArtistId = async (req, res) => {
  try {
    const artistId = req.params.artistId;
    
    // Validate artist exists
    const artist = await Artist.findByPk(artistId);
    if (!artist) return res.status(404).json({ error: 'Artist not found' });

    // Get albums for this artist with songs
    const albums = await Album.findAll({
      where: { artist_id: artistId },
      include: [
        { model: Genre, as: 'primaryGenre', attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(albums);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// update album
exports.updateAlbum = async (req, res) => {
  try {
    const album = await Album.findByPk(req.params.id);
    if (!album) return res.status(404).json({ error: 'Album not found' });

    const { title, cover_url, release_date, status, genre_id } = req.body;
    if (title) album.title = title;
    if (cover_url) album.cover_url = cover_url;
    if (release_date) album.release_date = release_date;
    if (status) album.status = status;
    if (genre_id !== undefined) {
      if (genre_id !== null) {
        const genre = await Genre.findByPk(genre_id);
        if (!genre) return res.status(404).json({ error: 'Genre not found' });
      }
      album.genre_id = genre_id;
    }

    await album.save();
    res.json({ message: 'Album updated', album });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// delete album
exports.deleteAlbum = async (req, res) => {
  try {
    const album = await Album.findByPk(req.params.id);
    if (!album) return res.status(404).json({ error: 'Album not found' });
    await album.destroy();
    res.json({ message: 'Album deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get pending albums for admin moderation
exports.getPendingAlbums = async (req, res) => {
  try {
    const albums = await Album.findAll({
      where: { status: 'pending' },
      include: [
        { model: Artist, attributes: ['id', 'name'] },
        { model: Genre, as: 'primaryGenre', attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(albums);
  } catch (error) {
    console.error('Error getting pending albums:', error);
    res.status(500).json({ error: error.message });
  }
};

// approve album
exports.approveAlbum = async (req, res) => {
  try {
    const album = await Album.findByPk(req.params.id);
    if (!album) return res.status(404).json({ error: 'Album not found' });

    album.status = 'approved';
    await album.save();
    
    res.json({ message: 'Album approved successfully', album });
  } catch (error) {
    console.error('Error approving album:', error);
    res.status(500).json({ error: error.message });
  }
};

// reject album
exports.rejectAlbum = async (req, res) => {
  try {
    const album = await Album.findByPk(req.params.id);
    if (!album) return res.status(404).json({ error: 'Album not found' });

    album.status = 'rejected';
    await album.save();
    
    res.json({ message: 'Album rejected successfully', album });
  } catch (error) {
    console.error('Error rejecting album:', error);
    res.status(500).json({ error: error.message });
  }
};

// upload cover
exports.uploadCover = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) return res.status(400).json({ error: 'No file uploaded' });
    const album = await Album.findByPk(req.params.id);
    if (!album) return res.status(404).json({ error: 'Album not found' });

    const ext = path.extname(req.file.originalname) || '';
    const filename = `albums/album_${album.id}_${Date.now()}${ext}`;
    const url = await uploadFile('albums', filename, req.file.buffer, req.file.mimetype);

    album.cover_url = url;
    await album.save();
    res.json({ message: 'Cover uploaded', url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
