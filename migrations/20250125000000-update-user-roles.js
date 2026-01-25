'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Cambiar el enum de la columna role para incluir todos los roles necesarios
    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.ENUM('user', 'admin', 'super_admin', 'artist', 'publisher', 'moderator', 'support'),
      allowNull: false,
      defaultValue: 'user'
    });
  },

  async down(queryInterface, Sequelize) {
    // Revertir al enum original
    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.ENUM('admin', 'artist', 'user'),
      allowNull: false,
      defaultValue: 'user'
    });
  }
};
