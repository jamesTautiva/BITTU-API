module.exports = (sequelize, DataTypes) => {
  const Album = sequelize.define('Album', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    artist_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    genre_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cover_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    
    release_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending'
    }
  }, {
    tableName: 'albums',
    timestamps: false
  });

  return Album;
};