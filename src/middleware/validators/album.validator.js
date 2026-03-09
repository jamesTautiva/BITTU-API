const { Genre } = require('../../models');

exports.validateIdParam = (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id) || id <= 0) return res.status(400).json({ error: 'Invalid id parameter' });
  req.params.id = id;
  return next();
};

exports.validateCreateAlbum = async (req, res, next) => {
  // Handle both JSON and FormData
  let artist_id, title, genre_ids;
  
  if (req.body && typeof req.body.get === 'function') {
    // FormData request
    artist_id = req.body.get('artist_id');
    title = req.body.get('title');
    const genreIdsString = req.body.get('genre_ids');
    
    if (genreIdsString) {
      try {
        genre_ids = JSON.parse(genreIdsString);
        if (Array.isArray(genre_ids)) {
          // Validate each genre_id is a positive integer
          for (const genreId of genre_ids) {
            const gid = parseInt(genreId, 10);
            if (Number.isNaN(gid) || gid <= 0) {
              return res.status(400).json({ error: 'genre_ids must contain only positive integers' });
            }
          }
        }
      } catch (e) {
        return res.status(400).json({ error: 'genre_ids must be a valid JSON array' });
      }
    }
  } else {
    // JSON request
    const body = req.body || {};
    artist_id = body.artist_id;
    title = body.title;
    genre_ids = body.genre_ids;
    
    // Legacy support for genre_id (singular)
    if (body.genre_id !== undefined && body.genre_id !== null) {
      const gid = parseInt(body.genre_id, 10);
      if (Number.isNaN(gid) || gid <= 0) {
        return res.status(400).json({ error: 'genre_id must be a positive integer' });
      }
      // Convert to array for consistency
      genre_ids = [gid];
    }
    
    if (genre_ids && Array.isArray(genre_ids)) {
      for (const genreId of genre_ids) {
        const gid = parseInt(genreId, 10);
        if (Number.isNaN(gid) || gid <= 0) {
          return res.status(400).json({ error: 'genre_ids must contain only positive integers' });
        }
      }
    }
  }
  
  if (!artist_id || !title) {
    return res.status(400).json({ error: 'artist_id and title are required' });
  }
  
  // Store validated data back to req.body for controller
  req.body.artist_id = artist_id;
  req.body.title = title;
  req.body.genre_ids = genre_ids;
  
  return next();
};

exports.validateUpdateAlbum = (req, res, next) => {
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
        if (Array.isArray(genre_ids)) {
          // Validate each genre_id is a positive integer
          for (const genreId of genre_ids) {
            const gid = parseInt(genreId, 10);
            if (Number.isNaN(gid) || gid <= 0) {
              return res.status(400).json({ error: 'genre_ids must contain only positive integers' });
            }
          }
        }
      } catch (e) {
        return res.status(400).json({ error: 'genre_ids must be a valid JSON array' });
      }
    }
  } else {
    // JSON request
    const body = req.body || {};
    title = body.title;
    cover_image = body.cover_image;
    release_date = body.release_date;
    status = body.status;
    genre_ids = body.genre_ids;
    
    // Legacy support for genre_id (singular)
    if (body.genre_id !== undefined && body.genre_id !== null) {
      const gid = parseInt(body.genre_id, 10);
      if (Number.isNaN(gid) || gid <= 0) {
        return res.status(400).json({ error: 'genre_id must be a positive integer' });
      }
      // Convert to array for consistency
      genre_ids = [gid];
    }
    
    if (genre_ids && Array.isArray(genre_ids)) {
      for (const genreId of genre_ids) {
        const gid = parseInt(genreId, 10);
        if (Number.isNaN(gid) || gid <= 0) {
          return res.status(400).json({ error: 'genre_ids must contain only positive integers' });
        }
      }
    }
  }
  
  return next();
};
