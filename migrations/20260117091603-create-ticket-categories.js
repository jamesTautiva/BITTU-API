'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ticket_categories', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      color: {
        type: Sequelize.STRING(7),
        allowNull: true,
        defaultValue: '#007bff'
      },
      icon: {
        type: Sequelize.STRING,
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      sort_order: {
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
    await queryInterface.addIndex('ticket_categories', ['name']);
    await queryInterface.addIndex('ticket_categories', ['is_active']);
    await queryInterface.addIndex('ticket_categories', ['sort_order']);

    // Insert default categories
    await queryInterface.bulkInsert('ticket_categories', [
      {
        name: 'Technical Support',
        description: 'Technical issues and support requests',
        color: '#dc3545',
        icon: 'tools',
        sort_order: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Account Issues',
        description: 'Login, registration, and account management',
        color: '#fd7e14',
        icon: 'user',
        sort_order: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Billing',
        description: 'Payment, subscription, and billing inquiries',
        color: '#28a745',
        icon: 'credit-card',
        sort_order: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Feature Request',
        description: 'Suggestions for new features and improvements',
        color: '#007bff',
        icon: 'lightbulb',
        sort_order: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bug Report',
        description: 'Report bugs and system issues',
        color: '#6f42c1',
        icon: 'bug',
        sort_order: 5,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ticket_categories');
  }
};
