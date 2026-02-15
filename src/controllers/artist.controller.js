const { Artist } = require('../models');
const path = require('path');
const { uploadFile } = require('../utils/supabaseClient');

// create a new artist
exports.createArtist = async (req, res) => {
  try {
    const { name, bio, userId, user_id } = req.body;
    
    // Accept both userId and user_id for compatibility
    const finalUserId = userId || user_id;
    
    if (!finalUserId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    if (!name) {
      return res.status(400).json({ error: 'Artist name is required' });
    }
    
    const newArtist = await Artist.create({ 
        name, 
        bio: bio || null,
        status: 'pending',
        user_id: finalUserId 
    });
    
    res.status(201).json(newArtist);
  } catch (error) {
    console.error('Error creating artist:', error);
    res.status(500).json({ error: 'Error al crear el artista: ' + error.message });
  }
};

//get all artists
exports.getAllArtists = async (req, res) => {
  try {
    const artists = await Artist.findAll({
      include: [{ model: require('../models').User, as: 'User' }]
    });
    res.json(artists);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los artistas' });
  }
};

// get artist by id
exports.getArtistById = async (req, res) => {
  try {
    const artist = await Artist.findByPk(req.params.id, {
      include: [
        { model: require('../models').User, as: 'User' },
        { 
          model: require('../models').Album, 
          include: [
            { model: require('../models').Genre, as: 'primaryGenre', attributes: ['id', 'name'] },
            { 
              model: require('../models').Song, 
              order: [['created_at', 'ASC']] 
            }
          ]
        }
      ]
    });
    if (!artist) {
      return res.status(404).json({ error: 'Artista no encontrado' });
    }
    res.json(artist);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el artista' });
  }
};

// update artist status
exports.updateArtistStatus = async (req, res) => {
  try {
    const artist = await Artist.findByPk(req.params.id);
    if (!artist) {
      return res.status(404).json({ error: 'Artista no encontrado' });
    }
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }
    
    artist.status = status;
    await artist.save();
    res.json({ message: 'Estado actualizado', artist });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el estado' });
  }
};

// update artist
exports.updateArtist = async (req, res) => {
  try {
    const artist = await Artist.findByPk(req.params.id);
    if (!artist) {
      return res.status(404).json({ error: 'Artista no encontrado' });
    }
    const { name, bio, image_url, status } = req.body;
    if (name) artist.name = name;
    if (bio) artist.bio = bio;
    if (image_url) artist.image_url = image_url;
    if (status) artist.status = status;

    await artist.save();
    res.json({ message: 'Artista actualizado', artist });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el artista' });
  }
};

// delete artist
exports.deleteArtist = async (req, res) => {
  try {
    const artist = await Artist.findByPk(req.params.id);
    if (!artist) {
      return res.status(404).json({ error: 'Artista no encontrado' });
    }
    await artist.destroy();
    res.json({ message: 'Artista eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el artista' });
  }
};  
// get artists by user id
exports.getArtistByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: 'Valid User ID is required' });
    }
    
    const artist = await Artist.findOne({ 
      where: { user_id: userId },
      include: [{ model: require('../models').User, as: 'User', attributes: ['id', 'username', 'email'] }]
    });
    
    if (!artist) {
      return res.status(404).json({ error: 'Artista no encontrado para este usuario' });
    }
    
    res.json(artist);
  } catch (error) {
    console.error('Error getting artist by user ID:', error);
    res.status(500).json({ error: 'Error al obtener el artista por ID de usuario: ' + error.message });
  }
};

// get all approved artists
exports.getApprovedArtists = async (req, res) => {
  try {
    const artists = await Artist.findAll({ where: { status: 'approved' } });
    res.json(artists);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los artistas aprobados' });
  }
};  

// get all pending artists
exports.getPendingArtists = async (req, res) => {
  try {
    const artists = await Artist.findAll({ where: { status: 'pending' } });
    res.json(artists);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los artistas pendientes' });
  }
};  

// get all rejected artists
exports.getRejectedArtists = async (req, res) => {
  try {
    const artists = await Artist.findAll({ where: { status: 'rejected' } });
    res.json(artists);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los artistas rechazados' });
  }
};

// upload artist image
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) return res.status(400).json({ error: 'No file uploaded' });
    const artist = await Artist.findByPk(req.params.id);
    if (!artist) return res.status(404).json({ error: 'Artista no encontrado' });

    const ext = path.extname(req.file.originalname) || '';
    const filename = `artists/artist_${artist.id}_${Date.now()}${ext}`;
    const url = await uploadFile('artists', filename, req.file.buffer, req.file.mimetype);

    artist.image_url = url;
    await artist.save();
    res.json({ message: 'Imagen de artista subida', url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



