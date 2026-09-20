'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const dialect = queryInterface.sequelize.getDialect();

    if (dialect === 'postgres') {
      // PostgreSQL: modificar ENUM directamente
      await queryInterface.sequelize.query(`
        ALTER TYPE enum_legal_documents_type RENAME TO enum_legal_documents_type_old;
      `);

      await queryInterface.sequelize.query(`
        CREATE TYPE enum_legal_documents_type AS ENUM (
          'artist_contract', 'terms', 'copyright', 'privacy_policy', 
          'data_consent', 'content_license', 'moderation_policy', 
          'monetization_terms', 'cookies_policy', 'notifications_policy'
        );
      `);

      await queryInterface.sequelize.query(`
        ALTER TABLE legal_documents 
        ALTER COLUMN type TYPE enum_legal_documents_type 
        USING type::text::enum_legal_documents_type;
      `);

      await queryInterface.sequelize.query(`
        DROP TYPE enum_legal_documents_type_old;
      `);
    } else {
      // MariaDB/MySQL: cambiar la columna a VARCHAR primero
      await queryInterface.changeColumn('legal_documents', 'type', {
        type: Sequelize.STRING(50),
        allowNull: false
      });

      // Luego cambiar de vuelta a ENUM con todos los valores
      await queryInterface.changeColumn('legal_documents', 'type', {
        type: Sequelize.ENUM(
          'artist_contract', 'terms', 'copyright', 'privacy_policy',
          'data_consent', 'content_license', 'moderation_policy',
          'monetization_terms', 'cookies_policy', 'notifications_policy'
        ),
        allowNull: false
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const dialect = queryInterface.sequelize.getDialect();

    if (dialect === 'postgres') {
      // Revertir ENUM PostgreSQL
      await queryInterface.sequelize.query(`
        ALTER TYPE enum_legal_documents_type RENAME TO enum_legal_documents_type_new;
      `);

      await queryInterface.sequelize.query(`
        CREATE TYPE enum_legal_documents_type AS ENUM (
          'artist_contract', 'terms', 'copyright'
        );
      `);

      await queryInterface.sequelize.query(`
        ALTER TABLE legal_documents 
        ALTER COLUMN type TYPE enum_legal_documents_type 
        USING type::text::enum_legal_documents_type;
      `);

      await queryInterface.sequelize.query(`
        DROP TYPE enum_legal_documents_type_new;
      `);
    } else {
      // Revertir ENUM MariaDB/MySQL
      await queryInterface.changeColumn('legal_documents', 'type', {
        type: Sequelize.STRING(50),
        allowNull: false
      });

      await queryInterface.changeColumn('legal_documents', 'type', {
        type: Sequelize.ENUM('artist_contract', 'terms', 'copyright'),
        allowNull: false
      });
    }
  }
};