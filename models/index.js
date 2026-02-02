const { Sequelize } = require('sequelize');
const sequelize = require('../src/config/database');

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Importar modelos desde src/models
db.User = require('../src/models/user')(sequelize, Sequelize.DataTypes);
db.Artist = require('../src/models/artist')(sequelize, Sequelize.DataTypes);
db.Album = require('../src/models/album')(sequelize, Sequelize.DataTypes);
db.Song = require('../src/models/song')(sequelize, Sequelize.DataTypes);
db.Member = require('../src/models/member')(sequelize, Sequelize.DataTypes);
db.Compositor = require('../src/models/compositor')(sequelize, Sequelize.DataTypes);
db.Genre = require('../src/models/genre')(sequelize, Sequelize.DataTypes);
db.AlbumGenre = require('../src/models/albumGenres')(sequelize, Sequelize.DataTypes);
db.Playlist = require('../src/models/playlist')(sequelize, Sequelize.DataTypes);
db.PlaylistSong = require('../src/models/playlistSongs')(sequelize, Sequelize.DataTypes);
db.Comment = require('../src/models/comment')(sequelize, Sequelize.DataTypes);
db.Favorite = require('../src/models/favorites')(sequelize, Sequelize.DataTypes);
db.Notification = require('../src/models/notification')(sequelize, Sequelize.DataTypes);
db.PlaybackLog = require('../src/models/playbackLog')(sequelize, Sequelize.DataTypes);
db.LegalDocument = require('../src/models/LegalDocument')(sequelize, Sequelize.DataTypes);
db.LegalAcceptance = require('../src/models/LegalAcceptance')(sequelize, Sequelize.DataTypes);
db.Ticket = require('../src/models/ticket')(sequelize, Sequelize.DataTypes);
db.TicketCategory = require('../src/models/ticketCategory')(sequelize, Sequelize.DataTypes);

// Definir relaciones
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
