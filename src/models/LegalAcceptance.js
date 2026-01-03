module.exports = (sequelize, DataTypes) => {
  const LegalAcceptance = sequelize.define('LegalAcceptance', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    legalDocumentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'legal_documents',
        key: 'id'
      }
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    acceptedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'legal_acceptances',
    timestamps: true
  });

  return LegalAcceptance;
};
