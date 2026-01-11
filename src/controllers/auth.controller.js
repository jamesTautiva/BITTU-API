const { User } = require('../models');
const { generateToken } = require('../utils/jwt');

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // basic validations
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'username, email and password are required' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'password must be at least 8 characters' });
    }

    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(409).json({ message: 'Email already in use' });
    }
    if (!role) {
      return res.status(400).json({ message: 'role is required' });
    }

    // roles permitidos
    const allowedRoles = ['user', 'admin', 'super_admin', 'artist', 'publisher', 'moderator','support'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.create({
      username,
      email,
      password,
      role
    });

    const token = generateToken({
      id: user.id,
      role: user.role
    });

    res.status(201).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email' });
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = generateToken({
      id: user.id,
      role: user.role
    });

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar_url: user.avatar_url
      },
      token
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
