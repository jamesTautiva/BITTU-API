'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const dialect = queryInterface.sequelize.getDialect();

    try {
      // 1. Renombrar cover_image a cover_url solo si existe
      const [columns] = await queryInterface.sequelize.query(`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'albums'
        AND column_name = 'cover_image'
      `);

      if (columns.length > 0) {
        await queryInterface.renameColumn('albums', 'cover_image', 'cover_url');
      }
    } catch (error) {
      console.log('Cover column already renamed or does not exist:', error.message);
    }

    // 2. Actualizar estado por defecto a 'pending' para coincidir con la lógica de negocio
    if (dialect === 'postgres') {
      // PostgreSQL: necesita manejo especial para ENUM
      try {
        await queryInterface.sequelize.query(`
          ALTER TYPE enum_albums_status ADD VALUE IF NOT EXISTS 'draft';
        `);
      } catch (error) {
        console.log('Draft value already exists:', error.message);
      }

      try {
        await queryInterface.sequelize.query(`
          ALTER TYPE enum_albums_status ADD VALUE IF NOT EXISTS 'approved';
        `);
      } catch (error) {
        console.log('Approved value already exists:', error.message);
      }

      try {
        await queryInterface.sequelize.query(`
          ALTER TYPE enum_albums_status ADD VALUE IF NOT EXISTS 'rejected';
        `);
      } catch (error) {
        console.log('Rejected value already exists:', error.message);
      }
    } else {
      // MariaDB/MySQL: cambio directo
      await queryInterface.changeColumn('albums', 'status', {
        type: Sequelize.ENUM('draft', 'pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending'
      });
    }

    // 3. Asegurar que release_date sea DATEONLY para consistencia
    await queryInterface.changeColumn('albums', 'release_date', {
      type: Sequelize.DATEONLY,
      allowNull: true
    });

    // 4. Actualizar álbumes existentes con estado 'draft' a 'pending'
    await queryInterface.sequelize.query(`
      UPDATE albums
      SET status = 'pending'
      WHERE status = 'draft'
    `);
  },

  async down(queryInterface, Sequelize) {
    // Revertir cambios
    try {
      await queryInterface.renameColumn('albums', 'cover_url', 'cover_image');
    } catch (error) {
      console.log('Cover column already exists:', error.message);
    }

    await queryInterface.changeColumn('albums', 'status', {
      type: Sequelize.ENUM('draft', 'pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'draft'
    });

    await queryInterface.changeColumn('albums', 'release_date', {
      type: Sequelize.DATE,
      allowNull: true
    });
  }
};
