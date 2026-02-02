require('dotenv').config();
const sequelize = require('../config/database');
const { TicketCategory } = require('../models');
const seedTicketCategories = require('./ticketCategories');

async function runSeeds() {
  try {
    console.log('🌱 Iniciando seeds de BITU API...');
    
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida');
    
    // Sincronizar modelos (solo las tablas necesarias)
    await TicketCategory.sync({ force: false });
    console.log('✅ Modelo TicketCategory sincronizado');
    
    // Ejecutar seed de categorías
    await seedTicketCategories();
    
    console.log('\n🎉 Seeds completados exitosamente!');
    
  } catch (error) {
    console.error('❌ Error ejecutando seeds:', error);
    process.exit(1);
  } finally {
    // Cerrar conexión
    await sequelize.close();
    console.log('🔚 Conexión a la base de datos cerrada');
    process.exit(0);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runSeeds();
}

module.exports = { runSeeds };
