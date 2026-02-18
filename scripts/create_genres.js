const { Sequelize } = require('sequelize');
require('dotenv').config();

async function createGenres() {
  const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });

  try {
    await sequelize.authenticate();
    console.log('📊 Conectado a la base de datos');

    // Géneros principales para crear
    const genres = [
      { name: 'Rock', description: 'Rock music and subgenres' },
      { name: 'Pop', description: 'Pop music and subgenres' },
      { name: 'Jazz', description: 'Jazz music and subgenres' },
      { name: 'Electronic', description: 'Electronic music and subgenres' },
      { name: 'Hip Hop', description: 'Hip hop and rap music' },
      { name: 'Classical', description: 'Classical music' },
      { name: 'Reggae', description: 'Reggae and dancehall music' },
      { name: 'Blues', description: 'Blues music' },
      { name: 'Country', description: 'Country and folk music' },
      { name: 'Funk', description: 'Funk music' },
      { name: 'Soul', description: 'Soul music' },
      { name: 'R&B', description: 'Rhythm and blues' },
      { name: 'Latin', description: 'Latin music' },
      { name: 'Indie', description: 'Independent music' }
    ];

    console.log(`🎵 Creando ${genres.length} géneros...`);

    for (const genre of genres) {
      try {
        const [createdGenre, created] = await sequelize.query(
          `INSERT INTO genres (name, description, created_at, updated_at) 
           VALUES (:name, :description, NOW(), NOW()) 
           ON CONFLICT (name) DO NOTHING 
           RETURNING *`,
          {
            replacements: genre,
            type: sequelize.QueryTypes.INSERT
          }
        );

        if (created && createdGenre.length > 0) {
          console.log(`✅ Creado: ${genre.name}`);
        } else {
          console.log(`⚠️  Ya existe: ${genre.name}`);
        }
      } catch (error) {
        console.error(`❌ Error creando ${genre.name}:`, error.message);
      }
    }

    // Verificar resultados
    const [results] = await sequelize.query('SELECT * FROM genres ORDER BY name');
    console.log(`\n📈 Total de géneros en BD: ${results.length}`);
    console.log('\n🎵 Lista de géneros:');
    results.forEach((genre, index) => {
      console.log(`${index + 1}. ${genre.name} - ${genre.description || 'Sin descripción'}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

createGenres();
