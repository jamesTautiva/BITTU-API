module.exports = (sequelize, DataTypes) => {
  const PlaybackLog = sequelize.define('PlaybackLog', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    song_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    device_type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    device_os: {
      type: DataTypes.STRING,
      allowNull: true
    },
    device_model: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ip_address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    played_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'playback_logs',
    timestamps: false
  });

  return PlaybackLog;
};
