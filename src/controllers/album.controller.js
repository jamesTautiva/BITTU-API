const { Album, Artist, Genre, Song, AlbumGenre } = require('../models');
const path = require('path');
const { uploadFile } = require('../utils/supabaseClient');

// create album
exports.createAlbum = async (req, res) => {
  try {
    const { artist_id, title, cover_image, release_date, genre_ids } = req.body;

    if (!artist_id || !title) {
      return res.status(400).json({ error: 'artist_id and title are required' });
    }

    // Artist validation is now handled by ensureArtistOwnership middleware
    
    // Parse genre_ids if it's a string
    let parsedGenreIds = [];
    if (genre_ids) {
      try {
        parsedGenreIds = typeof genre_ids === 'string' ? JSON.parse(genre_ids) : genre_ids;
        
        // Validate that it's an array and has max 3 items
        if (!Array.isArray(parsedGenreIds)) {
          return res.status(400).json({ error: 'genre_ids must be an array' });
        }
        
        if (parsedGenreIds.length > 3) {
          return res.status(400).json({ error: 'Maximum 3 genres allowed' });
        }
        
        // Validate each genre exists
        for (const genreId of parsedGenreIds) {
          const genre = await Genre.findByPk(genreId);
          if (!genre) return res.status(404).json({ error: `Genre with id ${genreId} not found` });
        }
      } catch (parseError) {
        return res.status(400).json({ error: 'Invalid genre_ids format' });
      }
    }

    // Create the album (without genre_id since we'll use album_genres)
    const album = await Album.create({ 
      artist_id, 
      title, 
      cover_image, 
      release_date, 
      status: 'pending'
    });

    // Create album-genre associations if genres provided
    if (parsedGenreIds.length > 0) {
      const albumGenres = parsedGenreIds.map(genreId => ({
        album_id: album.id,
        genre_id: genreId
      }));
      
      await AlbumGenre.bulkCreate(albumGenres);
    }

    // Fetch the album with genres for response
    const albumWithGenres = await Album.findByPk(album.id, {
      include: [
        {
          model: Genre,
          as: 'genres',
          attributes: ['id', 'name'],
          through: { attributes: [] }
        }
      ]
    });

    res.status(201).json(albumWithGenres);
  } catch (error) {
    console.error('Error creating album:', error);
    res.status(500).json({ error: error.message });
  }
};

// get all albums
exports.getAllAlbums = async (req, res) => {
  try {
    const albums = await Album.findAll({ 
      include: [
        { model: Genre, as: 'primaryGenre', attributes: ['id', 'name'] },
        {
          model: Genre,
          as: 'genres',
          attributes: ['id', 'name'],
          through: { attributes: [] }
        }
      ]
    });
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
        { model: Genre, as: 'primaryGenre', attributes: ['id', 'name'] },
        {
          model: Genre,
          as: 'genres',
          attributes: ['id', 'name'],
          through: { attributes: [] }
        }
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

    const { title, cover_image, release_date, status, genre_id } = req.body;
    if (title) album.title = title;
    if (cover_image) album.cover_image = cover_image;
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
    console.log(`[${req.user.role}] User ${req.user.id} (${req.user.email}) fetching pending albums`);
    
    const albums = await Album.findAll({
      where: { status: 'pending' },
      include: [
        { model: Artist, attributes: ['id', 'name'] },
        { model: Genre, as: 'primaryGenre', attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    console.log(`[${req.user.role}] Found ${albums.length} pending albums`);
    res.json(albums);
  } catch (error) {
    console.error('Error getting pending albums:', error);
    res.status(500).json({ error: error.message });
  }
};

// approve album
exports.approveAlbum = async (req, res) => {
  try {
    const albumId = req.params.id;
    console.log(`[${req.user.role}] User ${req.user.id} (${req.user.email}) approving album ${albumId}`);
    
    const album = await Album.findByPk(albumId);
    if (!album) return res.status(404).json({ error: 'Album not found' });

    album.status = 'approved';
    await album.save();
    
    console.log(`[${req.user.role}] Album ${albumId} approved successfully by ${req.user.role}`);
    res.json({ 
      message: 'Album approved successfully', 
      album,
      approvedBy: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error) {
    console.error('Error approving album:', error);
    res.status(500).json({ error: error.message });
  }
};

// reject album
exports.rejectAlbum = async (req, res) => {
  try {
    const albumId = req.params.id;
    console.log(`[${req.user.role}] User ${req.user.id} (${req.user.email}) rejecting album ${albumId}`);
    
    const album = await Album.findByPk(albumId);
    if (!album) return res.status(404).json({ error: 'Album not found' });

    album.status = 'rejected';
    await album.save();
    
    console.log(`[${req.user.role}] Album ${albumId} rejected successfully by ${req.user.role}`);
    res.json({ 
      message: 'Album rejected successfully', 
      album,
      rejectedBy: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role
      }
    });
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

    album.cover_image = url;
    await album.save();
    res.json({ message: 'Cover uploaded', url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
