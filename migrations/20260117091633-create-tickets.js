'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tickets', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
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
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ticket_categories',
          key: 'id'
        },
        onDelete: 'RESTRICT'
      },
      assigned_to: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      priority: {
        type: Sequelize.ENUM('low', 'medium', 'high', 'urgent'),
        allowNull: false,
        defaultValue: 'medium'
      },
      status: {
        type: Sequelize.ENUM('open', 'in_progress', 'pending_user', 'resolved', 'closed'),
        allowNull: false,
        defaultValue: 'open'
      },
      ticket_number: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      resolved_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      closed_at: {
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
    await queryInterface.addIndex('tickets', ['user_id']);
    await queryInterface.addIndex('tickets', ['category_id']);
    await queryInterface.addIndex('tickets', ['assigned_to']);
    await queryInterface.addIndex('tickets', ['status']);
    await queryInterface.addIndex('tickets', ['priority']);
    await queryInterface.addIndex('tickets', ['ticket_number']);
    await queryInterface.addIndex('tickets', ['created_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tickets');
  }
};
