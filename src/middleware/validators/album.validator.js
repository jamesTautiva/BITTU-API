const { Genre } = require('../../models');

exports.validateIdParam = (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id) || id <= 0) return res.status(400).json({ error: 'Invalid id parameter' });
  req.params.id = id;
  return next();
};

exports.validateCreateAlbum = async (req, res, next) => {
  const { artist_id, title, genre_id } = req.body || {};
  if (!artist_id || !title) return res.status(400).json({ error: 'artist_id and title are required' });
  if (genre_id !== undefined && genre_id !== null) {
    const gid = parseInt(genre_id, 10);
    if (Number.isNaN(gid) || gid <= 0) return res.status(400).json({ error: 'genre_id must be a positive integer' });
    // optional existence check deferred to controller to avoid circular requires
    req.body.genre_id = gid;
  }
  return next();
};

exports.validateUpdateAlbum = (req, res, next) => {
  const { title, cover_url, release_date, status, genre_id } = req.body || {};
  if (genre_id !== undefined && genre_id !== null) {
    const gid = parseInt(genre_id, 10);
    if (Number.isNaN(gid) || gid <= 0) return res.status(400).json({ error: 'genre_id must be a positive integer' });
    req.body.genre_id = gid;
  }
  return next();
};
