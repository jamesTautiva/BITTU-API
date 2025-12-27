const { Sequelize, DataTypes } = require('sequelize');
require  ('dotenv').config();
const sequelize = require('../config/database');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require('./user')(sequelize, DataTypes);
db.Artist = require('./artist')(sequelize, DataTypes);
db.Album = require('./album')(sequelize, DataTypes);
db.Song = require('./song')(sequelize, DataTypes);
db.Playlist = require('./playlist')(sequelize, DataTypes);
db.Comment = require('./comment')(sequelize, DataTypes);
db.Genre = require('./genre')(sequelize, DataTypes);
db.AlbumGenre = require('./albumGenres')(sequelize, DataTypes);
db.Notification = require('./notification')(sequelize, DataTypes);
db.Favorite = require('./favorites')(sequelize, DataTypes);
db.PlaylistSong = require('./playlistSongs')(sequelize, DataTypes);
db.PlaybackLog = require('./playbackLog')(sequelize, DataTypes);
//relationships

db.User.hasOne(db.Artist, { foreignKey: 'user_id', onDelete: 'CASCADE' });
db.Artist.belongsTo(db.User, { foreignKey: 'user_id' });

db.Artist.hasMany(db.Album, { foreignKey: 'artist_id', onDelete: 'CASCADE' });
db.Album.belongsTo(db.Artist, { foreignKey: 'artist_id' });

db.Album.hasMany(db.Song, { foreignKey: 'album_id', onDelete: 'CASCADE' });
db.Song.belongsTo(db.Album, { foreignKey: 'album_id' });

// optional primary genre for an album
db.Album.belongsTo(db.Genre, { foreignKey: 'genre_id', as: 'primaryGenre' });
db.Genre.hasMany(db.Album, { foreignKey: 'genre_id' });

db.User.hasMany(db.Playlist, { foreignKey: 'user_id', onDelete: 'CASCADE' });
db.Playlist.belongsTo(db.User, { foreignKey: 'user_id' });

db.User.hasMany(db.Comment, { foreignKey: 'user_id', onDelete: 'CASCADE' });
db.Comment.belongsTo(db.User, { foreignKey: 'user_id' });

db.Song.hasMany(db.Comment, { foreignKey: 'song_id', onDelete: 'CASCADE' });
db.Comment.belongsTo(db.Song, { foreignKey: 'song_id' });

db.Album.hasMany(db.Comment, { foreignKey: 'album_id', onDelete: 'CASCADE' });
db.Comment.belongsTo(db.Album, { foreignKey: 'album_id' });

db.Album.belongsToMany(db.Genre, { through: db.AlbumGenre, foreignKey: 'album_id', onDelete: 'CASCADE' });
db.Genre.belongsToMany(db.Album, { through: db.AlbumGenre, foreignKey: 'genre_id', onDelete: 'CASCADE' });

db.User.hasMany(db.Notification, { foreignKey: 'user_id', onDelete: 'CASCADE' });
db.Notification.belongsTo(db.User, { foreignKey: 'user_id' });

db.User.belongsToMany(db.Song, { through: db.Favorite, foreignKey: 'user_id', onDelete: 'CASCADE' });
db.Song.belongsToMany(db.User, { through: db.Favorite, foreignKey: 'song_id', onDelete: 'CASCADE' });

db.Playlist.belongsToMany(db.Song, { through: db.PlaylistSong, foreignKey: 'playlist_id', onDelete: 'CASCADE' });
db.Song.belongsToMany(db.Playlist, { through: db.PlaylistSong, foreignKey: 'song_id', onDelete: 'CASCADE' });

// Playback logs
db.User.hasMany(db.PlaybackLog, { foreignKey: 'user_id', onDelete: 'CASCADE' });
db.PlaybackLog.belongsTo(db.User, { foreignKey: 'user_id' });

db.Song.hasMany(db.PlaybackLog, { foreignKey: 'song_id', onDelete: 'CASCADE' });
db.PlaybackLog.belongsTo(db.Song, { foreignKey: 'song_id' });

module.exports = db;