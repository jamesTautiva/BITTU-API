const { Compositor, Song } = require('../models');

// create a new compositor
exports.createCompositor = async (req, res) => {
  try {
    const { name, song_id } = req.body;
    
    // Verify song exists
    const song = await Song.findByPk(song_id);
    if (!song) {
      return res.status(404).json({ error: 'Canción no encontrada' });
    }
    
    const newCompositor = await Compositor.create({ 
      name, 
      song_id
    });
    res.status(201).json(newCompositor);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el compositor' });
  }
};

// get all compositors
exports.getAllCompositors = async (req, res) => {
  try {
    const compositors = await Compositor.findAll({
      include: [{
        model: Song,
        attributes: ['id', 'title']
      }]
    });
    res.json(compositors);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los compositores' });
  }
};

// get compositor by id
exports.getCompositorById = async (req, res) => {
  try {
    const compositor = await Compositor.findByPk(req.params.id, {
      include: [{
        model: Song,
        attributes: ['id', 'title']
      }]
    });
    if (!compositor) {
      return res.status(404).json({ error: 'Compositor no encontrado' });
    }
    res.json(compositor);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el compositor' });
  }
};

// get compositors by song
exports.getCompositorsBySong = async (req, res) => {
  try {
    const { song_id } = req.params;
    
    // Verify song exists
    const song = await Song.findByPk(song_id);
    if (!song) {
      return res.status(404).json({ error: 'Canción no encontrada' });
    }
    
    const compositors = await Compositor.findAll({
      where: { song_id },
      include: [{
        model: Song,
        attributes: ['id', 'title']
      }]
    });
    res.json(compositors);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los compositores de la canción' });
  }
};

// update compositor
exports.updateCompositor = async (req, res) => {
  try {
    const compositor = await Compositor.findByPk(req.params.id);
    if (!compositor) {
      return res.status(404).json({ error: 'Compositor no encontrado' });
    }
    const { name, song_id } = req.body;
    
    // If song_id is provided, verify song exists
    if (song_id && song_id !== compositor.song_id) {
      const song = await Song.findByPk(song_id);
      if (!song) {
        return res.status(404).json({ error: 'Canción no encontrada' });
      }
    }
    
    await compositor.update({ name, song_id });
    res.json(compositor);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el compositor' });
  }
};

// delete compositor
exports.deleteCompositor = async (req, res) => {
  try {
    const compositor = await Compositor.findByPk(req.params.id);
    if (!compositor) {
      return res.status(404).json({ error: 'Compositor no encontrado' });
    }
    await compositor.destroy();
    res.json({ message: 'Compositor eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el compositor' });
  }
};
