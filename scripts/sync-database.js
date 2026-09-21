require('dotenv').config();
const sequelize = require('../src/config/database');
const db = require('../src/models');

async function syncDatabase() {
  try {
    console.log('🔍 Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa');

    console.log('\n🔄 Sincronizando modelos con la base de datos...');
    console.log('Esto creará las tablas faltantes y actualizará las existentes...\n');

    // Sincronizar todos los modelos con alter: true
    await sequelize.sync({ alter: true });
    console.log('✅ Sincronización completada');

    console.log('\n📊 Estado de las tablas:');
    
    // Verificar tablas principales
    const tables = [
      { name: 'Users', model: db.User },
      { name: 'Artists', model: db.Artist },
      { name: 'Albums', model: db.Album },
      { name: 'Songs', model: db.Song },
      { name: 'Playlists', model: db.Playlist },
      { name: 'PlaylistSongs', model: db.PlaylistSong },
      { name: 'Genres', model: db.Genre },
      { name: 'AlbumGenres', model: db.AlbumGenre },
      { name: 'Comments', model: db.Comment },
      { name: 'Notifications', model: db.Notification },
      { name: 'Favorites', model: db.Favorite },
      { name: 'Tickets', model: db.Ticket },
      { name: 'TicketCategories', model: db.TicketCategory },
      { name: 'TicketMessages', model: db.TicketMessage },
      { name: 'TicketAttachments', model: db.TicketAttachment },
      { name: 'LegalDocuments', model: db.LegalDocument },
      { name: 'LegalAcceptances', model: db.LegalAcceptance },
      { name: 'Members', model: db.Member },
      { name: 'Compositors', model: db.Compositor },
      { name: 'PlaybackLogs', model: db.PlaybackLog }
    ];

    for (const table of tables) {
      try {
        const count = await table.model.count();
        console.log(`  ✅ ${table.name}: ${count} registros`);
      } catch (error) {
        console.log(`  ❌ ${table.name}: Error - ${error.message}`);
      }
    }

    console.log('\n🌱 Ejecutando seeds iniciales...');
    
    // Ejecutar seeds
    const { Genre, LegalDocument, TicketCategory } = db;

    // Géneros
    const genreCount = await Genre.count();
    if (genreCount === 0) {
      console.log('🎵 Creando géneros iniciales...');
      const { createGenres } = require('./create_genres');
      await createGenres();
    } else {
      console.log(`✅ Géneros ya existen (${genreCount} registros)`);
    }

    // Documentos legales
    const docCount = await LegalDocument.count();
    if (docCount === 0) {
      console.log('📄 Creando documentos legales iniciales...');
      const { seedLegalDocuments } = require('./seed-legal-documents');
      await seedLegalDocuments();
    } else if (docCount < 9) {
      console.log(`📄 Actualizando documentos legales (${docCount} de 9)...`);
      await LegalDocument.destroy({ where: {} });
      const { seedLegalDocuments } = require('./seed-legal-documents');
      await seedLegalDocuments();
    } else {
      console.log(`✅ Documentos legales ya existen (${docCount} registros)`);
    }

    // Categorías de tickets
    const ticketCategoryCount = await TicketCategory.count();
    if (ticketCategoryCount === 0) {
      console.log('🎫 Creando categorías de tickets iniciales...');
      const { runSeeds } = require('../src/seeds');
      await runSeeds();
    } else {
      console.log(`✅ Categorías de tickets ya existen (${ticketCategoryCount} registros)`);
    }

    console.log('\n🎉 Sincronización y seeds completados exitosamente\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error durante la sincronización:', error.message);
    console.error(error);
    process.exit(1);
  }
}

syncDatabase();
