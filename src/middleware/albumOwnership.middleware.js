const { Album, Artist } = require('../models');

/**
 * Middleware para verificar que el usuario tiene permisos sobre un álbum
 * Solo los artistas dueños del álbum o administradores pueden modificarlo
 */
const ensureAlbumOwnership = async (req, res, next) => {
  try {
    const albumId = req.params.id;
    
    // Verificar que el álbum existe
    const album = await Album.findByPk(albumId);
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }

    // Obtener el artista dueño del álbum
    const artist = await Artist.findByPk(album.artist_id);
    if (!artist) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    // Verificar permisos
    const userId = req.user.id;
    const userRole = req.user.role;
    const isOwner = artist.user_id === userId;
    const isAdmin = ['admin', 'super_admin'].includes(userRole);

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        message: 'You can only modify your own albums'
      });
    }

    // Agregar información del álbum al request para uso posterior
    req.album = album;
    req.artist = artist;
    req.isAlbumOwner = isOwner;

    next();
  } catch (error) {
    console.error('Error in album ownership middleware:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Middleware para verificar que el usuario puede crear álbumes para un artista específico
 */
const ensureArtistOwnership = async (req, res, next) => {
  try {
    // Debug: Log request details
    console.log('=== ENSURE ARTIST OWNERSHIP DEBUG ===');
    console.log('req.body type:', typeof req.body);
    console.log('req.body:', req.body);
    console.log('req.body keys:', req.body ? Object.keys(req.body) : 'undefined');
    
    // Handle both JSON and FormData
    let artist_id;
    if (req.body && req.body.artist_id) {
      // JSON request
      artist_id = req.body.artist_id;
      console.log('Using JSON artist_id:', artist_id);
    } else if (req.body && typeof req.body.get === 'function') {
      // FormData request
      artist_id = req.body.get('artist_id');
      console.log('Using FormData artist_id:', artist_id);
    }
    
    console.log('Final artist_id:', artist_id);
    
    if (!artist_id) {
      console.log('ERROR: artist_id is missing or undefined');
      return res.status(400).json({ error: 'artist_id is required' });
    }

    // Verificar que el artista existe
    const artist = await Artist.findByPk(artist_id);
    if (!artist) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    // Verificar permisos
    const userId = req.user.id;
    const userRole = req.user.role;
    const isOwner = artist.user_id === userId;
    const isAdmin = ['admin', 'super_admin'].includes(userRole);

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        message: 'You can only create albums for your own artist profile'
      });
    }

    // Agregar información del artista al request
    req.artist = artist;
    req.isArtistOwner = isOwner;

    next();
  } catch (error) {
    console.error('Error in artist ownership middleware:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  ensureAlbumOwnership,
  ensureArtistOwnership
};
