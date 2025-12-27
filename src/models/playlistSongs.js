module.exports = (sequelize, DataTypes) => {
  const PlaylistSong = sequelize.define('PlaylistSong', {
    playlist_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    song_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

  }, {
    tableName: 'playlist_songs',
    timestamps: false
  });

  return PlaylistSong;
};