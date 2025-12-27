'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('playlist_songs', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      playlist_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'playlists',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      song_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'songs',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      position: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('playlist_songs');
  }
};
