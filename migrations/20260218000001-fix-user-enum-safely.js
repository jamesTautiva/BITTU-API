'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Primero crear el nuevo enum temporal
    await queryInterface.sequelize.query(`
      CREATE TYPE users_role_enum_new AS ENUM (
        'user', 'admin', 'super_admin', 'artist', 'publisher', 'moderator', 'support'
      );
    `);

    // 2. Convertir la columna a texto temporalmente
    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.TEXT,
      allowNull: false
    });

    // 3. Convertir de vuelta al nuevo enum
    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.ENUM('user', 'admin', 'super_admin', 'artist', 'publisher', 'moderator', 'support'),
      allowNull: false,
      defaultValue: 'user'
    });

    // 4. Eliminar el enum antiguo
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS users_role_enum;
    `);

    // 5. Renombrar el nuevo enum
    await queryInterface.sequelize.query(`
      ALTER TYPE users_role_enum_new RENAME TO users_role_enum;
    `);
  },

  async down(queryInterface, Sequelize) {
    // Revertir al enum original
    await queryInterface.sequelize.query(`
      CREATE TYPE users_role_enum_old AS ENUM ('admin', 'artist', 'user');
    `);

    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.TEXT,
      allowNull: false
    });

    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.ENUM('admin', 'artist', 'user'),
      allowNull: false,
      defaultValue: 'user'
    });

    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS users_role_enum;
    `);

    await queryInterface.sequelize.query(`
      ALTER TYPE users_role_enum_old RENAME TO users_role_enum;
    `);
  }
};
