'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ticket_messages', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      ticket_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tickets',
          key: 'id'
        },
        onDelete: 'CASCADE'
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
      message: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      message_type: {
        type: Sequelize.ENUM('text', 'system', 'internal_note'),
        allowNull: false,
        defaultValue: 'text'
      },
      is_internal: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      is_edited: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      edited_at: {
        type: Sequelize.DATE,
        allowNull: true
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

    // Add indexes
    await queryInterface.addIndex('ticket_messages', ['ticket_id']);
    await queryInterface.addIndex('ticket_messages', ['user_id']);
    await queryInterface.addIndex('ticket_messages', ['message_type']);
    await queryInterface.addIndex('ticket_messages', ['is_internal']);
    await queryInterface.addIndex('ticket_messages', ['created_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ticket_messages');
  }
};
