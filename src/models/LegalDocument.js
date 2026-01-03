module.exports = (sequelize, DataTypes) => {
  const LegalDocument = sequelize.define('LegalDocument', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.ENUM('artist_contract', 'terms', 'copyright'),
      allowNull: false
    },
    version: {
      type: DataTypes.STRING,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT('long'),
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'legal_documents',
    timestamps: true
  });

  return LegalDocument;
};
