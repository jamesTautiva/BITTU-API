const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configurar multer para almacenamiento en memoria
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'), false);
    }
  }
});

// Upload de imagen de usuario
router.post('/users/:id', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó ningún archivo' });
    }

    // Por ahora, guardar en un servicio externo o devolver URL temporal
    // TODO: Implementar servicio de almacenamiento (Cloudinary, S3, etc.)
    
    const imageUrl = `https://picsum.photos/seed/user${req.params.id}_${Date.now()}/200/200.jpg`;
    
    // Actualizar el avatar_url en la base de datos
    const { User } = require('../models');
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    user.avatar_url = imageUrl;
    await user.save();
    
    res.json({ 
      success: true, 
      imageUrl: imageUrl,
      message: 'Imagen subida exitosamente' 
    });
    
  } catch (error) {
    console.error('Error en upload:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
