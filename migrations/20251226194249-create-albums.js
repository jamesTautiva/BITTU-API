'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('albums', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      title: {
        type: Sequelize.STRING,
        allowNull: false
      },

      cover_image: {
        type: Sequelize.STRING
      },

      release_date: {
        type: Sequelize.DATE
      },

      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending'
      },

      artist_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'artists',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('albums');
  }
};
