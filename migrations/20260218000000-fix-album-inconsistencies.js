'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Renombrar cover_image a cover_url para consistencia con el modelo
    await queryInterface.renameColumn('albums', 'cover_image', 'cover_url');
    
    // 2. Actualizar estado por defecto a 'pending' para coincidir con la lógica de negocio
    await queryInterface.changeColumn('albums', 'status', {
      type: Sequelize.ENUM('draft', 'pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending'
    });
    
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
    await queryInterface.renameColumn('albums', 'cover_url', 'cover_image');
    
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
