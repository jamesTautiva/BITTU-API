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
db.LegalDocument = require('./LegalDocument')(sequelize, DataTypes);
db.LegalAcceptance = require('./LegalAcceptance')(sequelize, DataTypes);
db.Member = require('./member')(sequelize, DataTypes);
db.Compositor = require('./compositor')(sequelize, DataTypes);
db.Ticket = require('./ticket')(sequelize, DataTypes);
db.TicketCategory = require('./ticketCategory')(sequelize, DataTypes);
db.TicketMessage = require('./ticketMessage')(sequelize, DataTypes);
db.TicketAttachment = require('./ticketAttachment')(sequelize, DataTypes);
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

db.Genre.hasMany(db.Genre, { foreignKey: 'parent_id', as: 'subgenres', onDelete: 'CASCADE' });
db.Genre.belongsTo(db.Genre, { foreignKey: 'parent_id', as: 'parent' });

db.Album.belongsToMany(db.Genre, { through: db.AlbumGenre, foreignKey: 'album_id', otherKey: 'genre_id', as: 'genres', onDelete: 'CASCADE' });
db.Genre.belongsToMany(db.Album, { through: db.AlbumGenre, foreignKey: 'genre_id', otherKey: 'album_id', as: 'albums', onDelete: 'CASCADE' });

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

// Legal Documents & Acceptances
db.LegalDocument.hasMany(db.LegalAcceptance, { foreignKey: 'legalDocumentId' });
db.LegalAcceptance.belongsTo(db.LegalDocument, { foreignKey: 'legalDocumentId' });

db.User.hasMany(db.LegalAcceptance, { foreignKey: 'userId' });
db.LegalAcceptance.belongsTo(db.User, { foreignKey: 'userId' });

// Artist and Members relationship
db.Artist.hasMany(db.Member, { foreignKey: 'artist_id', onDelete: 'CASCADE' });
db.Member.belongsTo(db.Artist, { foreignKey: 'artist_id' });

// Song and Compositors relationship
db.Song.hasMany(db.Compositor, { foreignKey: 'song_id', onDelete: 'CASCADE' });
db.Compositor.belongsTo(db.Song, { foreignKey: 'song_id' });

// Ticket System relationships
db.User.hasMany(db.Ticket, { foreignKey: 'user_id', as: 'createdTickets', onDelete: 'CASCADE' });
db.Ticket.belongsTo(db.User, { foreignKey: 'user_id', as: 'creator' });

db.User.hasMany(db.Ticket, { foreignKey: 'assigned_to', as: 'assignedTickets', onDelete: 'SET NULL' });
db.Ticket.belongsTo(db.User, { foreignKey: 'assigned_to', as: 'assignedTo' });

db.TicketCategory.hasMany(db.Ticket, { foreignKey: 'category_id', onDelete: 'RESTRICT' });
db.Ticket.belongsTo(db.TicketCategory, { foreignKey: 'category_id' });

db.Ticket.hasMany(db.TicketMessage, { foreignKey: 'ticket_id', onDelete: 'CASCADE' });
db.TicketMessage.belongsTo(db.Ticket, { foreignKey: 'ticket_id' });

db.User.hasMany(db.TicketMessage, { foreignKey: 'user_id', onDelete: 'CASCADE' });
db.TicketMessage.belongsTo(db.User, { foreignKey: 'user_id' });

db.Ticket.hasMany(db.TicketAttachment, { foreignKey: 'ticket_id', onDelete: 'CASCADE' });
db.TicketAttachment.belongsTo(db.Ticket, { foreignKey: 'ticket_id' });

db.TicketMessage.hasMany(db.TicketAttachment, { foreignKey: 'message_id', onDelete: 'CASCADE' });
db.TicketAttachment.belongsTo(db.TicketMessage, { foreignKey: 'message_id' });

db.User.hasMany(db.TicketAttachment, { foreignKey: 'user_id', onDelete: 'CASCADE' });
db.TicketAttachment.belongsTo(db.User, { foreignKey: 'user_id' });

// Legal documents and acceptances
db.LegalDocument.hasMany(db.LegalAcceptance, { foreignKey: 'legalDocumentId', onDelete: 'CASCADE' });
db.LegalAcceptance.belongsTo(db.LegalDocument, { foreignKey: 'legalDocumentId' });
db.User.hasMany(db.LegalAcceptance, { foreignKey: 'userId', onDelete: 'CASCADE' });

module.exports = db;