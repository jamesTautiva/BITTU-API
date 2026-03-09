const { Album, Artist, Genre, Song, AlbumGenre } = require('../models');
const path = require('path');
const { uploadFile } = require('../utils/supabaseClient');

// create album
exports.createAlbum = async (req, res) => {
  try {
    console.log('=== CREATE ALBUM DEBUG ===');
    console.log('req.body type:', typeof req.body);
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);
    
    // Handle both JSON and FormData
    let artist_id, title, cover_image, release_date, genre_ids;
    
    if (req.body && typeof req.body.get === 'function') {
      // FormData request
      artist_id = req.body.get('artist_id');
      title = req.body.get('title');
      release_date = req.body.get('release_date');
      const status = req.body.get('status') || 'pending';
      const genreIdsString = req.body.get('genre_ids');
      
      if (genreIdsString) {
        try {
          genre_ids = JSON.parse(genreIdsString);
        } catch (e) {
          console.error('Error parsing genre_ids:', e);
          genre_ids = [];
        }
      }
      
      // Handle file upload
      if (req.file) {
        console.log('Processing file upload...');
        const ext = path.extname(req.file.originalname) || '';
        const filename = `albums/temp_album_${Date.now()}${ext}`;
        
        try {
          cover_image = await uploadFile('albums', filename, req.file.buffer, req.file.mimetype);
          console.log('File uploaded successfully:', cover_image);
        } catch (uploadError) {
          console.error('Error uploading file:', uploadError);
          return res.status(500).json({ error: 'Error uploading cover image: ' + uploadError.message });
        }
      }
      
      console.log('FormData parsed - title:', title, 'artist_id:', artist_id, 'genre_ids:', genre_ids);
    } else {
      // JSON request (legacy)
      artist_id = req.body.artist_id;
      title = req.body.title;
      cover_image = req.body.cover_image;
      release_date = req.body.release_date;
      genre_ids = req.body.genre_ids || [];
      
      console.log('JSON parsed - title:', title, 'artist_id:', artist_id, 'genre_ids:', genre_ids);
    }

    if (!artist_id || !title) {
      return res.status(400).json({ error: 'artist_id and title are required' });
    }

    // Parse and validate genre_ids
    let parsedGenreIds = [];
    if (genre_ids) {
      try {
        parsedGenreIds = typeof genre_ids === 'string' ? JSON.parse(genre_ids) : genre_ids;
        
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
        
        // Set the first genre as primary genre
        const primaryGenreId = parsedGenreIds[0];
        
        console.log('Creating album with primary genre:', primaryGenreId);
        
        // Create the album with primary genre
        const album = await Album.create({ 
          artist_id, 
          title, 
          cover_image: cover_image || null, 
          release_date, 
          genre_id: primaryGenreId, // Set primary genre
          status: 'pending'
        });

        // Create additional genre associations if more than one
        if (parsedGenreIds.length > 1) {
          const additionalGenres = parsedGenreIds.slice(1); // Skip first one (already primary)
          const albumGenres = additionalGenres.map(genreId => ({
            album_id: album.id,
            genre_id: genreId
          }));
          
          await AlbumGenre.bulkCreate(albumGenres);
          console.log(`Added ${additionalGenres.length} additional genre associations`);
        }

        // Fetch the album with associations
        const albumResponse = await Album.findByPk(album.id, {
          include: [
            { model: Artist, attributes: ['id', 'name'] },
            { model: Genre, as: 'primaryGenre', attributes: ['id', 'name'] },
            {
              model: Genre,
              as: 'genres',
              attributes: ['id', 'name'],
              through: { attributes: [] }
            }
          ]
        });

        console.log(`Album created successfully: ID ${album.id}, Title: ${title}`);
        res.status(201).json(albumResponse);
        
      } catch (parseError) {
        console.error('Error parsing genre_ids:', parseError);
        return res.status(400).json({ error: 'Invalid genre_ids format' });
      }
    } else {
      // No genres provided - create album without genre
      const album = await Album.create({ 
        artist_id, 
        title, 
        cover_image: cover_image || null, 
        release_date, 
        status: 'pending'
      });

      // Fetch the album with basic associations
      const albumResponse = await Album.findByPk(album.id, {
        include: [
          { model: Artist, attributes: ['id', 'name'] }
        ]
      });

      console.log(`Album created without genres: ID ${album.id}, Title: ${title}`);
      res.status(201).json(albumResponse);
    }
    
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

    // Get albums for this artist with songs and artist info
    const albums = await Album.findAll({
      where: { artist_id: artistId },
      include: [
        { model: Artist, attributes: ['id', 'name'] },
        { model: Genre, as: 'primaryGenre', attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    console.log(`=== ALBUMS BY ARTIST DEBUG ===`);
    console.log(`Artist ID: ${artistId}, Artist Name: ${artist.name}`);
    console.log(`Found ${albums.length} albums`);
    
    albums.forEach((album, index) => {
      console.log(`Album ${index + 1}:`, {
        id: album.id,
        title: album.title,
        cover_image: album.cover_image,
        hasCover: !!album.cover_image,
        coverLength: album.cover_image ? album.cover_image.length : 0
      });
    });

    res.json(albums);
  } catch (error) {
    console.error('Error getting albums by artist ID:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateAlbum = async (req, res) => {
  try {
    const albumId = req.params.id;
    
    console.log('=== UPDATE ALBUM DEBUG ===');
    console.log('Album ID:', albumId);
    console.log('Request body type:', typeof req.body);
    console.log('Has file:', !!req.file);
    console.log('Headers:', req.headers);
    
    const album = await Album.findByPk(albumId);
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }

    // Handle both JSON and FormData
    let title, cover_image, release_date, status, genre_ids;
    
    if (req.body && typeof req.body.get === 'function') {
      // FormData request
      title = req.body.get('title');
      cover_image = req.body.get('cover_image');
      release_date = req.body.get('release_date');
      status = req.body.get('status');
      const genreIdsString = req.body.get('genre_ids');
      
      if (genreIdsString) {
        try {
          genre_ids = JSON.parse(genreIdsString);
        } catch (e) {
          console.error('Error parsing genre_ids:', e);
          genre_ids = [];
        }
      }
      
      // Handle file upload
      console.log('=== FILE UPLOAD DEBUG ===');
      console.log('req.file exists:', !!req.file);
      if (req.file) {
        console.log('req.file details:', {
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          buffer: req.file.buffer ? 'Buffer exists' : 'No buffer'
        });
        
        const ext = path.extname(req.file.originalname) || '';
        const filename = `albums/album_${album.id}_${Date.now()}${ext}`;
        
        console.log('Uploading file:', filename);
        cover_image = await uploadFile('albums', filename, req.file.buffer, req.file.mimetype);
        console.log('File uploaded successfully:', cover_image);
      } else {
        console.log('No file received in req.file');
        console.log('req.body keys:', req.body ? Object.keys(req.body) : 'No req.body');
        
        // Check if file is in FormData under different name
        if (req.body && typeof req.body.get === 'function') {
          const fileField = req.body.get('cover_image');
          console.log('cover_image from FormData:', fileField);
          console.log('cover_image type:', typeof fileField);
        }
      }
      
      console.log('FormData parsed - title:', title, 'genre_ids:', genre_ids);
    } else {
      // JSON request
      title = req.body.title;
      cover_image = req.body.cover_image;
      release_date = req.body.release_date;
      status = req.body.status;
      genre_ids = req.body.genre_ids || [];
      
      console.log('JSON parsed - title:', title, 'genre_ids:', genre_ids);
    }

    // Update album fields
    if (title !== undefined && title !== null) album.title = title;
    if (cover_image !== undefined && cover_image !== null) album.cover_image = cover_image;
    if (release_date !== undefined && release_date !== null) album.release_date = release_date;
    if (status !== undefined && status !== null) album.status = status;

    await album.save();

    // Handle genre associations if provided
    if (genre_ids && Array.isArray(genre_ids) && genre_ids.length > 0) {
      // Remove existing genre associations
      await AlbumGenre.destroy({ where: { album_id: album.id } });
      
      // Validate and add new genre associations
      const validGenreIds = [];
      for (const genreId of genre_ids) {
        const genre = await Genre.findByPk(genreId);
        if (genre) {
          validGenreIds.push(genreId);
        } else {
          console.warn(`Genre with id ${genreId} not found, skipping`);
        }
      }
      
      if (validGenreIds.length > 0) {
        const albumGenres = validGenreIds.map(genreId => ({
          album_id: album.id,
          genre_id: genreId
        }));
        
        await AlbumGenre.bulkCreate(albumGenres);
        console.log(`Added ${validGenreIds.length} genre associations to album ${album.id}`);
      }
    }

    // Fetch updated album with associations
    const updatedAlbum = await Album.findByPk(album.id, {
      include: [
        { model: Artist, attributes: ['id', 'name'] },
        { model: Genre, as: 'primaryGenre', attributes: ['id', 'name'] },
        {
          model: Genre,
          as: 'genres',
          attributes: ['id', 'name'],
          through: { attributes: [] }
        }
      ]
    });

    console.log(`Album ${album.id} updated successfully`);
    res.json({ message: 'Album updated successfully', album: updatedAlbum });
  } catch (error) {
    console.error('Error updating album:', error);
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
    console.log('=== UPLOAD COVER DEBUG ===');
    console.log('req.file:', req.file);
    console.log('req.params.id:', req.params.id);
    
    if (!req.file || !req.file.buffer) {
      console.log('No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      console.log('Invalid file type:', req.file.mimetype);
      return res.status(400).json({ 
        error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed',
        receivedType: req.file.mimetype
      });
    }
    
    // Validate file size (5MB limit)
    if (req.file.size > 5 * 1024 * 1024) {
      console.log('File too large:', req.file.size);
      return res.status(400).json({ 
        error: 'File too large. Maximum size is 5MB',
        receivedSize: req.file.size
      });
    }
    
    const album = await Album.findByPk(req.params.id);
    if (!album) {
      console.log('Album not found:', req.params.id);
      return res.status(404).json({ error: 'Album not found' });
    }

    console.log('Album found:', album.id, album.title);

    const ext = path.extname(req.file.originalname) || '';
    const filename = `albums/album_${album.id}_${Date.now()}${ext}`;
    
    console.log('Uploading file:', filename);
    console.log('File size:', req.file.size);
    console.log('File type:', req.file.mimetype);
    
    const url = await uploadFile('albums', filename, req.file.buffer, req.file.mimetype);
    
    console.log('File uploaded successfully:', url);

    album.cover_image = url;
    await album.save();
    
    console.log('Album updated with cover image');
    
    res.json({ 
      message: 'Cover uploaded successfully', 
      url,
      album: {
        id: album.id,
        title: album.title,
        cover_image: album.cover_image
      }
    });
  } catch (error) {
    console.error('Error uploading cover:', error);
    res.status(500).json({ error: error.message });
  }
};
