'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const dialect = queryInterface.sequelize.getDialect();

    if (dialect === 'postgres') {
      // PostgreSQL: agregar valores al ENUM existente
      const newRoles = ['super_admin', 'publisher', 'moderator', 'support'];

      for (const role of newRoles) {
        try {
          await queryInterface.sequelize.query(`
            ALTER TYPE enum_users_role ADD VALUE IF NOT EXISTS '${role}';
          `);
        } catch (error) {
          console.log(`Role ${role} already exists or error:`, error.message);
        }
      }
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
      // PostgreSQL: no es fácil eliminar valores de ENUM en PostgreSQL
      // Solo revertimos el defaultValue si es necesario
      console.log('PostgreSQL ENUM values cannot be easily removed. Keeping extended ENUM.');
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
