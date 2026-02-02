const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const TicketMessage = sequelize.define('TicketMessage', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ticket_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tickets',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    message_type: {
      type: DataTypes.ENUM('text', 'internal_note', 'solution'),
      defaultValue: 'text',
      allowNull: false
    },
    is_internal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_edited: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    edited_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'ticket_messages',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['ticket_id']
      },
      {
        fields: ['user_id']
      },
      {
        fields: ['message_type']
      },
      {
        fields: ['is_internal']
      },
      {
        fields: ['created_at']
      }
    ]
  });

  // Asociaciones
  TicketMessage.belongsTo(sequelize.models.Ticket, { foreignKey: 'ticket_id', as: 'Ticket' });
  TicketMessage.belongsTo(sequelize.models.User, { foreignKey: 'user_id', as: 'User' });

  return TicketMessage;
};
