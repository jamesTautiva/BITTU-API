const { Genre } = require('../src/models');
const sequelize = require('../src/config/database');
require('dotenv').config();

async function createGenres() {
  try {
    await sequelize.authenticate();
    console.log('📊 Conectado a la base de datos');

    // Estructura jerárquica de géneros
    const genreHierarchy = {
      // 5 GÉNEROS PRINCIPALES
      'Heavy Metal': {
        description: 'Heavy Metal y todos sus subgéneros',
        subgenres: [
          'Heavy Metal Tradicional',
          'Heavy Metal Clásico (NWOBHM)',
          'Speed Metal',
          'Thrash Metal',
          'Bay Area Thrash',
          'Crossover Thrash',
          'Technical / Progressive Thrash',
          'Death Metal',
          'Old School Death Metal (OSDM)',
          'Melodic Death Metal (Melodeath)',
          'Technical Death Metal',
          'Brutal Death Metal',
          'Death \'n\' Roll',
          'Black Metal',
          'First / Second Wave Black Metal',
          'Atmospheric Black Metal',
          'Symphonic Black Metal',
          'Depressive Suicidal Black Metal (DSBM)',
          'Blackgaze',
          'Doom Metal',
          'Traditional Doom',
          'Epic Doom',
          'Funeral Doom',
          'Stoner Doom',
          'Sludge Metal',
          'Power Metal',
          'European Power Metal',
          'US Power Metal',
          'Symphonic Power Metal',
          'Prog, Djent & Modern Metal',
          'Progressive Metal',
          'Djent',
          'Thall',
          'Alternative Metal',
          'Groove Metal',
          'Industrial Metal',
          'Nu Metal',
          'Folk, Pagan & Metal Regional',
          'Viking Metal',
          'Folk Metal',
          'Pirate Metal',
          'Medieval Metal',
          'Celtic Metal'
        ]
      },
      'Rock': {
        description: 'Rock y todos sus subgéneros',
        subgenres: [
          'Classic & Hard Rock',
          'Hard Rock',
          'Blues Rock',
          'Psychedelic Rock',
          'Acid Rock',
          'Progressive & Art Rock',
          'Symphonic Rock',
          'Krautrock',
          'Neo-Prog',
          'Math Rock',
          'Space Rock',
          'Alternative Rock',
          'Grunge',
          'Britpop',
          'Post-Rock',
          'College Rock',
          'Stoner & Desert Rock',
          'Desert Rock',
          'Palm Desert Scene',
          'Gothic & Glam Rock',
          'Glam Rock / Hair Metal',
          'Gothic Rock',
          'Garage & Noise Rock',
          'Garage Rock / Garage Rock Revival',
          'Noise Rock',
          'No Wave'
        ]
      },
      'Hardcore': {
        description: 'Hardcore y todos sus subgéneros',
        subgenres: [
          'Hardcore Punk (Escena Clásica)',
          'First Wave Hardcore',
          'Youth Crew',
          'D-Beat',
          'Fastcore',
          'Thrashcore',
          'Heavy Hardcore & Beatdown',
          'Beatdown Hardcore',
          'Slam Hardcore / Groove Beatdown',
          'Toughguy Hardcore',
          'Metalcore',
          'Metallic Hardcore (90s Metalcore)',
          'Melodic Metalcore',
          'Progressive Metalcore',
          'Mathcore',
          'Easycore',
          'Deathcore',
          'Downtempo Deathcore',
          'Symphonic Deathcore',
          'Technical Deathcore',
          'Brutal Deathcore',
          'Post-Hardcore & Emo',
          'Post-Hardcore',
          'Screamo / Skramz',
          'Midwest Emo',
          'Emoviolence'
        ]
      },
      'Punk': {
        description: 'Punk y todos sus subgéneros',
        subgenres: [
          'Punk Rock Clásico / Tradicional',
          'Proto-Punk',
          '77 Punk',
          'Garage Punk',
          'Anarcho & Street Punk',
          'Anarcho-Punk',
          'Street Punk',
          'Oi!',
          'UK82',
          'Crust Punk',
          'Pop Punk & Skate Punk',
          'Skate Punk',
          'Pop Punk',
          'Org-Core',
          'Horror & Dark Punk',
          'Horror Punk',
          'Deathrock',
          'Folk Punk & Fusiones',
          'Cowpunk',
          'Celtic Punk',
          'Gypsy Punk'
        ]
      },
      'Indie & Fusiones Alternativas': {
        description: 'Indie y fusiones alternativas',
        subgenres: [
          'Indie Rock',
          'Post-Punk Revival',
          'Indie Pop',
          'Dance-Rock',
          'Shoegaze & Dream Pop',
          'Shoegaze',
          'Dream Pop',
          'Slowcore',
          'Indie Folk & Roots',
          'Chamber Folk',
          'Freak Folk',
          'Anti-Folk',
          'Post-Punk & Darkwave',
          'Post-Punk',
          'Coldwave',
          'Darkwave',
          'Synthwave / Retrowave'
        ]
      }
    };

    console.log(`🎵 Creando estructura jerárquica de géneros...`);

    // Primero crear los géneros principales
    const mainGenreIds = {};
    for (const [mainGenreName, mainGenreData] of Object.entries(genreHierarchy)) {
      try {
        const [mainGenre, created] = await Genre.findOrCreate({
          where: { name: mainGenreName },
          defaults: {
            name: mainGenreName,
            description: mainGenreData.description,
            parent_id: null
          }
        });

        mainGenreIds[mainGenreName] = mainGenre.id;

        if (created) {
          console.log(`✅ Género principal creado: ${mainGenreName}`);
        } else {
          console.log(`⚠️  Género principal ya existe: ${mainGenreName}`);
        }
      } catch (error) {
        console.error(`❌ Error creando género principal ${mainGenreName}:`, error.message);
      }
    }

    // Luego crear los subgéneros
    let totalSubgenres = 0;
    for (const [mainGenreName, mainGenreData] of Object.entries(genreHierarchy)) {
      const parentId = mainGenreIds[mainGenreName];

      for (const subgenreName of mainGenreData.subgenres) {
        try {
          const [subgenre, created] = await Genre.findOrCreate({
            where: { name: subgenreName },
            defaults: {
              name: subgenreName,
              description: `Subgénero de ${mainGenreName}`,
              parent_id: parentId
            }
          });

          if (created) {
            console.log(`  ✅ Subgénero creado: ${subgenreName} (padre: ${mainGenreName})`);
            totalSubgenres++;
          } else {
            console.log(`  ⚠️  Subgénero ya existe: ${subgenreName}`);
          }
        } catch (error) {
          console.error(`  ❌ Error creando subgénero ${subgenreName}:`, error.message);
        }
      }
    }

    // Verificar resultados
    const results = await Genre.findAll({ order: [['name', 'ASC']] });
    const mainGenres = await Genre.findAll({ where: { parent_id: null }, order: [['name', 'ASC']] });
    const subgenres = await Genre.findAll({ where: { parent_id: { [sequelize.Sequelize.Op.ne]: null } } });

    console.log(`\n📈 Total de géneros en BD: ${results.length}`);
    console.log(`📊 Géneros principales: ${mainGenres.length}`);
    console.log(`📊 Subgéneros: ${subgenres.length}`);
    console.log(`🎉 Subgéneros nuevos creados: ${totalSubgenres}`);

    console.log('\n🎵 Géneros principales:');
    mainGenres.forEach((genre, index) => {
      console.log(`${index + 1}. ${genre.name} - ${genre.description || 'Sin descripción'}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  createGenres().then(() => {
    process.exit(0);
  }).catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
}

module.exports = { createGenres };
