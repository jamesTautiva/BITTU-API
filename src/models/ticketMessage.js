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
      },
      onDelete: 'CASCADE'
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1, 5000]
      }
    },
    message_type: {
      type: DataTypes.ENUM('text', 'system', 'internal_note'),
      allowNull: false,
      defaultValue: 'text'
    },
    is_internal: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    is_edited: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
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
  TicketMessage.belongsTo(Ticket, { foreignKey: 'ticket_id', as: 'Ticket' });
  TicketMessage.belongsTo(User, { foreignKey: 'user_id', as: 'User' });

  return TicketMessage;
};
