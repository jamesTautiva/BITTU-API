'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ticket_attachments', {
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
      message_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'ticket_messages',
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
      filename: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      original_name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      file_path: {
        type: Sequelize.STRING,
        allowNull: false
      },
      file_size: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      mime_type: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      file_type: {
        type: Sequelize.ENUM('image', 'document', 'video', 'audio', 'other'),
        allowNull: false
      },
      is_public: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      download_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
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
    await queryInterface.addIndex('ticket_attachments', ['ticket_id']);
    await queryInterface.addIndex('ticket_attachments', ['message_id']);
    await queryInterface.addIndex('ticket_attachments', ['user_id']);
    await queryInterface.addIndex('ticket_attachments', ['file_type']);
    await queryInterface.addIndex('ticket_attachments', ['created_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ticket_attachments');
  }
};
