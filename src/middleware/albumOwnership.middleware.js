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
    const { artist_id } = req.body;
    
    if (!artist_id) {
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
