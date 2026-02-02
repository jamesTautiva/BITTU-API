'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, drop the existing enum constraint
    await queryInterface.changeColumn('legal_documents', 'type', {
      type: Sequelize.TEXT,
      allowNull: false
    });

    // Then add the new enum constraint
    await queryInterface.changeColumn('legal_documents', 'type', {
      type: Sequelize.ENUM(
        'terms_conditions',
        'privacy_policy', 
        'data_consent',
        'content_license',
        'copyright_declaration',
        'moderation_policy',
        'monetization_terms',
        'cookies_policy',
        'notifications_policy',
        'artist_contract',
        'terms',
        'copyright'
      ),
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert to original enum
    await queryInterface.changeColumn('legal_documents', 'type', {
      type: Sequelize.TEXT,
      allowNull: false
    });

    await queryInterface.changeColumn('legal_documents', 'type', {
      type: Sequelize.ENUM('artist_contract', 'terms', 'copyright'),
      allowNull: false
    });
  }
};
