const { DataTypes } = require('sequelize');
const { hashPassword, comparePassword } = require('../utils/hash');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'artist', 'user'),
      allowNull: false,
      defaultValue: 'user'
    },
    avatar_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    tableName: 'users',
    timestamps: false
  });
    // 🔐 hooks
  User.beforeCreate(async (user) => {
    user.password = await hashPassword(user.password);
  });

  User.beforeUpdate(async (user) => {
    if (user.changed('password')) {
      user.password = await hashPassword(user.password);
    }
  });

  // 🔍 instance method
  User.prototype.comparePassword = function (password) {
    return comparePassword(password, this.password);
  };

  return User;
};