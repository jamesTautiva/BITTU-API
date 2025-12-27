const { AlbumGenre, Album, Genre } = require('../models');

// add genre to album
exports.addGenreToAlbum = async (req, res) => {
  try {
    const { albumId } = req.params;
    const { genre_id } = req.body;
    if (!genre_id) return res.status(400).json({ error: 'genre_id required' });

    const album = await Album.findByPk(albumId);
    if (!album) return res.status(404).json({ error: 'Album not found' });

    const genre = await Genre.findByPk(genre_id);
    if (!genre) return res.status(404).json({ error: 'Genre not found' });

    const exists = await AlbumGenre.findOne({ where: { album_id: albumId, genre_id } });
    if (exists) return res.status(409).json({ error: 'Genre already associated' });

    const ag = await AlbumGenre.create({ album_id: albumId, genre_id });
    res.status(201).json(ag);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// remove genre from album
exports.removeGenreFromAlbum = async (req, res) => {
  try {
    const { albumId, genreId } = req.params;
    const ag = await AlbumGenre.findOne({ where: { album_id: albumId, genre_id: genreId } });
    if (!ag) return res.status(404).json({ error: 'Association not found' });
    await ag.destroy();
    res.json({ message: 'Genre removed from album' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// list genres for album
exports.getGenresForAlbum = async (req, res) => {
  try {
    const { albumId } = req.params;
    const list = await AlbumGenre.findAll({ where: { album_id: albumId } });
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
