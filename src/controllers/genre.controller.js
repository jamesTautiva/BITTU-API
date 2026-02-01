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
    const { name, parent_id, description, is_metal_subgenre } = req.body;
    // check uniqueness (case-insensitive)
    const existing = await Genre.findOne({
      where: sequelizeWhereLowerName(name)
    });
    if (existing) return res.status(409).json({ error: 'Genre with this name already exists' });
    const genre = await Genre.create({ name, parent_id, description, is_metal_subgenre });
    res.status(201).json(genre);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get all genres with hierarchical structure
exports.getAllGenres = async (req, res) => {
  try {
    const genres = await Genre.findAll({
      include: [
        {
          model: Genre,
          as: 'subgenres',
          include: [{ model: Genre, as: 'subgenres' }]
        }
      ],
      order: [['name', 'ASC']]
    });
    res.json(genres);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get metal subgenres specifically
exports.getMetalSubgenres = async (req, res) => {
  try {
    const subgenres = await Genre.findAll({
      where: { is_metal_subgenre: true },
      include: [
        {
          model: Genre,
          as: 'parent',
          attributes: ['id', 'name']
        }
      ],
      order: [['name', 'ASC']]
    });
    res.json(subgenres);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// initialize metal genres and subgenres
exports.initializeMetalGenres = async (req, res) => {
  try {
    // Main metal genre
    const metalGenre = await Genre.findOrCreate({
      where: { name: 'Metal' },
      defaults: {
        description: 'Heavy metal music and its various subgenres',
        is_metal_subgenre: false,
        parent_id: null
      }
    });

    // Metal subgenres
    const metalSubgenres = [
      { name: 'Heavy Metal', description: 'Traditional heavy metal' },
      { name: 'Thrash Metal', description: 'Fast, aggressive metal with complex riffing' },
      { name: 'Death Metal', description: 'Extreme metal with growled vocals and brutal sound' },
      { name: 'Black Metal', description: 'Extreme metal with atmospheric and often satanic themes' },
      { name: 'Power Metal', description: 'Melodic metal with fantasy themes and clean vocals' },
      { name: 'Doom Metal', description: 'Slow, heavy metal with dark themes' },
      { name: 'Folk Metal', description: 'Metal fused with traditional folk music' },
      { name: 'Symphonic Metal', description: 'Metal with orchestral arrangements' },
      { name: 'Progressive Metal', description: 'Complex, technical metal with long compositions' },
      { name: 'Glam Metal', description: 'Metal with pop influences and androgynous aesthetics' },
      { name: 'Nu Metal', description: 'Metal fused with alternative rock and hip hop elements' },
      { name: 'Metalcore', description: 'Extreme metal with hardcore punk influences' },
      { name: 'Deathcore', description: 'Extreme metal with death metal and hardcore elements' },
      { name: 'Gothic Metal', description: 'Metal with gothic rock influences and dark themes' },
      { name: 'Viking Metal', description: 'Metal with Norse mythology themes' },
      { name: 'Pirate Metal', description: 'Metal with pirate themes and sea shanties' },
      { name: 'Industrial Metal', description: 'Metal with industrial and electronic elements' },
      { name: 'Sludge Metal', description: 'Slow, heavy metal with hardcore punk influences' },
      { name: 'Stoner Metal', description: 'Slow-paced metal with psychedelic rock influences' }
    ];

    const createdSubgenres = [];
    for (const subgenre of metalSubgenres) {
      const [genre, created] = await Genre.findOrCreate({
        where: { name: subgenre.name },
        defaults: {
          description: subgenre.description,
          is_metal_subgenre: true,
          parent_id: metalGenre[0].id
        }
      });
      createdSubgenres.push(genre);
    }

    res.json({
      message: 'Metal genres initialized successfully',
      mainGenre: metalGenre[0],
      subgenres: createdSubgenres
    });
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
