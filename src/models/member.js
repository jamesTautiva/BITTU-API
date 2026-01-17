module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define('Member', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    artist_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'artists',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'members',
    timestamps: false
  });

  return Member;
};
