require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/database');
const { Genre, LegalDocument, TicketCategory } = require('./models');

// Validate critical environment variables
const requiredEnvVars = ['JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
  console.error('Please set these variables in your .env file');
  process.exit(1);
}

const PORT = process.env.PORT || 3000;

// Función para verificar y crear datos iniciales si no existen
async function seedInitialData() {
  try {
    console.log('🌱 Verificando datos iniciales...');

    // Verificar y crear géneros si no existen
    const genreCount = await Genre.count();
    if (genreCount === 0) {
      console.log('🎵 Creando géneros iniciales...');
      const { createGenres } = require('../scripts/create_genres');
      await createGenres();
    } else {
      console.log(`✅ Géneros ya existen (${genreCount} registros)`);
    }

    // Verificar y crear documentos legales si no existen
    const docCount = await LegalDocument.count();
    if (docCount === 0) {
      console.log('📄 Creando documentos legales iniciales...');
      const { seedLegalDocuments } = require('../scripts/seed-legal-documents');
      await seedLegalDocuments();
    } else if (docCount < 9) {
      console.log(`📄 Actualizando documentos legales (solo ${docCount} de 9 encontrados)...`);
      // Limpiar y recrear documentos legales para tener todos los 9
      await LegalDocument.destroy({ where: {} });
      const { seedLegalDocuments } = require('../scripts/seed-legal-documents');
      await seedLegalDocuments();
    } else {
      console.log(`✅ Documentos legales ya existen (${docCount} registros)`);
    }

    // Verificar y crear categorías de tickets si no existen
    const ticketCategoryCount = await TicketCategory.count();
    if (ticketCategoryCount === 0) {
      console.log('🎫 Creando categorías de tickets iniciales...');
      const { runSeeds } = require('./seeds');
      await runSeeds();
    } else {
      console.log(`✅ Categorías de tickets ya existen (${ticketCategoryCount} registros)`);
    }

    console.log('🎉 Datos iniciales verificados/completados');
  } catch (error) {
    console.error('❌ Error en seeds iniciales:', error.message);
    // No detener la aplicación si fallan los seeds
  }
}

(async () => {

  try {
    await sequelize.authenticate();
    console.log(' Database connected');

      await sequelize.sync({ alter: true }); // Usar alter para modificar tablas existentes
    // Sincronizar base de datos siempre al iniciar
    // Esto crea tablas faltantes y agrega columnas faltantes sin borrar datos
    console.log(' Synchronizing database...');
    await sequelize.sync({ alter: true });
    console.log(' Database synchronized successfully');

    // Ejecutar seeds iniciales automáticamente
    await seedInitialData();

    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(' Unable to connect to the database:', error.message || error);
    process.exit(1);
  }
})();
