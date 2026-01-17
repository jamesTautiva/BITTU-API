module.exports = (sequelize, DataTypes) => {
  const Compositor = sequelize.define('Compositor', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    song_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'songs',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'compositores',
    timestamps: false
  });

  return Compositor;
};
