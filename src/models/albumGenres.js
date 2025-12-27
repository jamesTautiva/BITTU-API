module.exports = (sequelize, DataTypes) => {
  const AlbumGenre = sequelize.define('AlbumGenre', {
    album_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    genre_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'album_genres',
    timestamps: false
  });

  return AlbumGenre;
};