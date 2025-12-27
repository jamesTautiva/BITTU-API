// Middleware to validate Genre requests
exports.validateIdParam = (req, res, next) => {
  const { id } = req.params;
  const parsed = parseInt(id, 10);
  if (!id || Number.isNaN(parsed) || parsed <= 0) {
    return res.status(400).json({ error: 'Invalid id parameter' });
  }
  req.params.id = parsed;
  return next();
};

exports.validateCreateGenre = (req, res, next) => {
  const { name } = req.body || {};
  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'name is required and must be a non-empty string' });
  }
  const trimmed = name.trim();
  if (trimmed.length < 2 || trimmed.length > 50) {
    return res.status(400).json({ error: 'name must be between 2 and 50 characters' });
  }
  req.body.name = trimmed;
  return next();
};

exports.validateUpdateGenre = (req, res, next) => {
  const { name } = req.body || {};
  if (name === undefined) return next(); // nothing to update
  if (typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'name must be a non-empty string' });
  }
  const trimmed = name.trim();
  if (trimmed.length < 2 || trimmed.length > 50) {
    return res.status(400).json({ error: 'name must be between 2 and 50 characters' });
  }
  req.body.name = trimmed;
  return next();
};
