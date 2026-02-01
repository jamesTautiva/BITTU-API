'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('genres', 'parent_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'genres',
        key: 'id'
      },
      onDelete: 'CASCADE'
    });

    await queryInterface.addColumn('genres', 'description', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('genres', 'is_metal_subgenre', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });

    await queryInterface.addColumn('genres', 'created_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });

    await queryInterface.addColumn('genres', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('genres', 'parent_id');
    await queryInterface.removeColumn('genres', 'description');
    await queryInterface.removeColumn('genres', 'is_metal_subgenre');
    await queryInterface.removeColumn('genres', 'created_at');
    await queryInterface.removeColumn('genres', 'updated_at');
  }
};
