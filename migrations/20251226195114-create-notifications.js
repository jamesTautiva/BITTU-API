'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notifications', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      type: {
        type: Sequelize.STRING,
        allowNull: false
      },

      message: {
        type: Sequelize.TEXT,
        allowNull: false
      },

      is_read: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('notifications');
  }
};
