'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const dialect = queryInterface.sequelize.getDialect();

    if (dialect === 'postgres') {
      // PostgreSQL: usar tipos ENUM específicos
      await queryInterface.sequelize.query(`
        CREATE TYPE users_role_enum_new AS ENUM (
          'user', 'admin', 'super_admin', 'artist', 'publisher', 'moderator', 'support'
        );
      `);

      await queryInterface.changeColumn('users', 'role', {
        type: Sequelize.TEXT,
        allowNull: false
      });

      await queryInterface.changeColumn('users', 'role', {
        type: Sequelize.ENUM('user', 'admin', 'super_admin', 'artist', 'publisher', 'moderator', 'support'),
        allowNull: false,
        defaultValue: 'user'
      });

      await queryInterface.sequelize.query(`
        DROP TYPE IF EXISTS users_role_enum;
      `);

      await queryInterface.sequelize.query(`
        ALTER TYPE users_role_enum_new RENAME TO users_role_enum;
      `);
    } else {
      // MariaDB/MySQL: cambiar directamente el ENUM en la columna
      await queryInterface.changeColumn('users', 'role', {
        type: Sequelize.ENUM('user', 'admin', 'super_admin', 'artist', 'publisher', 'moderator', 'support'),
        allowNull: false,
        defaultValue: 'user'
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const dialect = queryInterface.sequelize.getDialect();

    if (dialect === 'postgres') {
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
    } else {
      // MariaDB/MySQL: revertir al ENUM original
      await queryInterface.changeColumn('users', 'role', {
        type: Sequelize.ENUM('admin', 'artist', 'user'),
        allowNull: false,
        defaultValue: 'user'
      });
    }
  }
};
