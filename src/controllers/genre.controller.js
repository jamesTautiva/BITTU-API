const { Genre, sequelize } = require('../models');
const { Op, fn, col, where } = require('sequelize');

// helper to produce a case-insensitive where clause for name
const sequelizeWhereLowerName = (name, opts = {}) => {
  const clauses = [where(fn('lower', col('name')), name.toLowerCase())];
  if (opts.excludeId) {
    clauses.push({ id: { [Op.ne]: opts.excludeId } });
  }
  return { [Op.and]: clauses };
};

// create genre
exports.createGenre = async (req, res) => {
  try {
    const { name } = req.body; // validated and trimmed by middleware
    // check uniqueness (case-insensitive)
    const existing = await Genre.findOne({
      where: sequelizeWhereLowerName(name)
    });
    if (existing) return res.status(409).json({ error: 'Genre with this name already exists' });
    const genre = await Genre.create({ name });
    res.status(201).json(genre);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get all genres
exports.getAllGenres = async (req, res) => {
  try {
    const genres = await Genre.findAll();
    res.json(genres);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get genre by id
exports.getGenreById = async (req, res) => {
  try {
    const genre = await Genre.findByPk(req.params.id);
    if (!genre) return res.status(404).json({ error: 'Genre not found' });
    res.json(genre);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// update genre
exports.updateGenre = async (req, res) => {
  try {
    const genre = await Genre.findByPk(req.params.id);
    if (!genre) return res.status(404).json({ error: 'Genre not found' });
    const { name } = req.body; // validated/trimmed by middleware
    if (name) {
      // check uniqueness vs others
      const existing = await Genre.findOne({
        where: sequelizeWhereLowerName(name, { excludeId: genre.id })
      });
      if (existing) return res.status(409).json({ error: 'Another genre with this name exists' });
      genre.name = name;
    }
    await genre.save();
    res.json({ message: 'Genre updated', genre });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// delete genre
exports.deleteGenre = async (req, res) => {
  try {
    const genre = await Genre.findByPk(req.params.id);
    if (!genre) return res.status(404).json({ error: 'Genre not found' });
    await genre.destroy();
    res.json({ message: 'Genre deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
