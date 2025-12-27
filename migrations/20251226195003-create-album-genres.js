'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('album_genres', {
      album_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'albums',
          key: 'id'
        },
        onDelete: 'CASCADE',
        primaryKey: true
      },

      genre_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'genres',
          key: 'id'
        },
        onDelete: 'CASCADE',
        primaryKey: true
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('album_genres');
  }
};