const bcrypt = require('bcryptjs');
const { User } = require('../models');
const path = require('path');
const { uploadFile } = require('../utils/supabaseClient');



// get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// update user profile
exports.updateProfile = async (req, res) => {
  try {
    // El endpoint usa `/me` (usuario autenticado). Tomamos el id del token.
    const id = req.user && req.user.id;
    const user = await User.findByPk(id);
        
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        const { username, email, role, avatar_url } = req.body;
        
        // Validar rol si se proporciona
        if (role) {
          const allowedRoles = ['user', 'admin', 'super_admin', 'artist', 'publisher', 'moderator', 'support'];
          if (!allowedRoles.includes(role)) {
            return res.status(400).json({ error: 'Rol inválido' });
          }
          user.role = role;
        }
        
        if (username) user.username = username;
        if (email) user.email = email;
        if (avatar_url) user.avatar_url = avatar_url;

        await user.save();
        res.json({ message: 'Perfil actualizado', user });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
};

// change user password

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Campos requeridos' });
    }

    // Validaciones mínimas
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 8 caracteres' });
    }

    if (typeof confirmPassword !== 'undefined' && newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'confirmPassword no coincide con newPassword' });
    }

    // Usar id del usuario autenticado
    const id = req.user && req.user.id;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Contraseña actual incorrecta' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;

    await user.save();

    res.json({ message: 'Contraseña actualizada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// delete user account
exports.deleteAccount = async (req, res) => {
  try {
    const id = req.user && req.user.id;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await user.destroy();

    res.json({ message: 'Cuenta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// upload avatar
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) return res.status(400).json({ error: 'No file uploaded' });
    const id = req.user && req.user.id;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const ext = path.extname(req.file.originalname) || '';
    const filename = `avatars/user_${id}_${Date.now()}${ext}`;
    const url = await uploadFile('avatars', filename, req.file.buffer, req.file.mimetype);

    user.avatar_url = url;
    await user.save();
    res.json({ message: 'Avatar subido', url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// endpoints para admins
// get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get user by id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// update user
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    const { username, email, role } = req.body;
    
    // Validar rol si se proporciona
    if (role) {
      const allowedRoles = ['user', 'admin', 'super_admin', 'artist', 'publisher', 'moderator', 'support'];
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({ error: 'Rol inválido' });
      }
      user.role = role;
    }
    
    if (username) user.username = username;
    if (email) user.email = email;
    
    await user.save();
    res.json({ message: 'Usuario actualizado', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    await user.destroy();
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
