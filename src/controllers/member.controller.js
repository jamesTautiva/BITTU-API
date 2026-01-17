const { Member, Artist } = require('../models');

// create a new member
exports.createMember = async (req, res) => {
  try {
    const { name, role, artist_id } = req.body;
    
    // Verify artist exists
    const artist = await Artist.findByPk(artist_id);
    if (!artist) {
      return res.status(404).json({ error: 'Artista no encontrado' });
    }
    
    const newMember = await Member.create({ 
      name, 
      role,
      artist_id
    });
    res.status(201).json(newMember);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el miembro' });
  }
};

// get all members
exports.getAllMembers = async (req, res) => {
  try {
    const members = await Member.findAll({
      include: [{
        model: Artist,
        attributes: ['id', 'name']
      }]
    });
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los miembros' });
  }
};

// get member by id
exports.getMemberById = async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id, {
      include: [{
        model: Artist,
        attributes: ['id', 'name']
      }]
    });
    if (!member) {
      return res.status(404).json({ error: 'Miembro no encontrado' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el miembro' });
  }
};

// get members by artist
exports.getMembersByArtist = async (req, res) => {
  try {
    const { artist_id } = req.params;
    
    // Verify artist exists
    const artist = await Artist.findByPk(artist_id);
    if (!artist) {
      return res.status(404).json({ error: 'Artista no encontrado' });
    }
    
    const members = await Member.findAll({
      where: { artist_id },
      include: [{
        model: Artist,
        attributes: ['id', 'name']
      }]
    });
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los miembros del artista' });
  }
};

// update member
exports.updateMember = async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Miembro no encontrado' });
    }
    const { name, role, artist_id } = req.body;
    
    // If artist_id is provided, verify artist exists
    if (artist_id && artist_id !== member.artist_id) {
      const artist = await Artist.findByPk(artist_id);
      if (!artist) {
        return res.status(404).json({ error: 'Artista no encontrado' });
      }
    }
    
    await member.update({ name, role, artist_id });
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el miembro' });
  }
};

// delete member
exports.deleteMember = async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Miembro no encontrado' });
    }
    await member.destroy();
    res.json({ message: 'Miembro eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el miembro' });
  }
};
