const { Sequelize } = require('sequelize');
require('dotenv').config();

async function checkSchema() {
  const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'postgres'
  });

  try {
    await sequelize.authenticate();
    console.log('Conectado a la base de datos');

    // Verificar estructura de la tabla albums
    const [results] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'albums' 
      ORDER BY ordinal_position;
    `);

    console.log('\nEstructura actual de la tabla albums:');
    console.table(results);

    // Verificar si genre_id existe
    const hasGenreId = results.some(col => col.column_name === 'genre_id');
    console.log(`\n¿Tiene genre_id? ${hasGenreId ? 'SÍ' : 'NO'}`);

    // Verificar si cover_url existe
    const hasCoverUrl = results.some(col => col.column_name === 'cover_url');
    console.log(`¿Tiene cover_url? ${hasCoverUrl ? 'SÍ' : 'NO'}`);

    // Verificar si cover_image existe
    const hasCoverImage = results.some(col => col.column_name === 'cover_image');
    console.log(`¿Tiene cover_image? ${hasCoverImage ? 'SÍ' : 'NO'}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

checkSchema();
