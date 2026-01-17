module.exports = (sequelize, DataTypes) => {
  const TicketAttachment = sequelize.define('TicketAttachment', {
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
    message_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'ticket_messages',
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
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255]
      }
    },
    original_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255]
      }
    },
    file_path: {
      type: DataTypes.STRING,
      allowNull: false
    },
    file_size: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    mime_type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 100]
      }
    },
    file_type: {
      type: DataTypes.ENUM('image', 'document', 'video', 'audio', 'other'),
      allowNull: false
    },
    is_public: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    download_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
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
    tableName: 'ticket_attachments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['ticket_id']
      },
      {
        fields: ['message_id']
      },
      {
        fields: ['user_id']
      },
      {
        fields: ['file_type']
      },
      {
        fields: ['created_at']
      }
    ]
  });

  TicketAttachment.beforeValidate((attachment) => {
    // Determine file type based on mime type
    if (attachment.mime_type) {
      if (attachment.mime_type.startsWith('image/')) {
        attachment.file_type = 'image';
      } else if (attachment.mime_type.startsWith('video/')) {
        attachment.file_type = 'video';
      } else if (attachment.mime_type.startsWith('audio/')) {
        attachment.file_type = 'audio';
      } else if (
        attachment.mime_type.includes('pdf') ||
        attachment.mime_type.includes('document') ||
        attachment.mime_type.includes('text') ||
        attachment.mime_type.includes('spreadsheet')
      ) {
        attachment.file_type = 'document';
      } else {
        attachment.file_type = 'other';
      }
    }
  });

  return TicketAttachment;
};
