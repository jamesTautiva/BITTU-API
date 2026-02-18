const { Sequelize } = require('sequelize');
require('dotenv').config();

async function createComprehensiveGenres() {
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

    // Géneros principales
    const mainGenres = [
      { name: 'Rock', description: 'Rock music and all its subgenres' },
      { name: 'Punk', description: 'Punk rock and all its subgenres' },
      { name: 'Metal', description: 'Heavy metal music and all its subgenres' },
      { name: 'Hardcore', description: 'Hardcore punk and all its subgenres' },
      { name: 'Pop', description: 'Pop music and subgenres' },
      { name: 'Electronic', description: 'Electronic music and subgenres' },
      { name: 'Hip Hop', description: 'Hip hop and rap music' },
      { name: 'Jazz', description: 'Jazz music and subgenres' },
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

    // Subgéneros del Rock
    const rockSubgenres = [
      { name: 'Rock and Roll', parent: 'Rock', description: 'Rock clásico de los años 50, mezcla de blues, rhythm & blues y country con un ritmo enérgico. Ejemplos: Chuck Berry, Elvis Presley.' },
      { name: 'Hard Rock', parent: 'Rock', description: 'Guitarras distorsionadas, baterías potentes. Ejemplos: AC/DC, Aerosmith, Deep Purple.' },
      { name: 'Progressive Rock', parent: 'Rock', description: 'Estructuras complejas, virtuosismo instrumental. Ejemplos: Pink Floyd, Genesis, Yes.' },
      { name: 'Glam Rock', parent: 'Rock', description: 'Estética extravagante y teatral. Ejemplos: David Bowie, T. Rex, Queen.' },
      { name: 'Grunge', parent: 'Rock', description: 'Sonido sucio, introspectivo y depresivo. Ejemplos: Nirvana, Pearl Jam, Soundgarden.' },
      { name: 'Alternative Rock', parent: 'Rock', description: 'Música independiente, menos comercial. Ejemplos: R.E.M., Radiohead, The Smashing Pumpkins.' },
      { name: 'Pop Punk', parent: 'Rock', description: 'Melodías pegajosas con energía punk. Ejemplos: Green Day, Blink-182.' },
      { name: 'Math Rock', parent: 'Rock', description: 'Ritmos complejos y estructuras no convencionales. Ejemplos: Don Caballero, Battles.' },
      { name: 'Shoegaze', parent: 'Rock', description: 'Guitarras llenas de efectos, sonido etéreo. Ejemplos: My Bloody Valentine, Slowdive.' },
      { name: 'Folk Rock', parent: 'Rock', description: 'Fusión de folk tradicional con rock. Ejemplos: Bob Dylan, Simon & Garfunkel.' },
      { name: 'Post-Punk', parent: 'Rock', description: 'Experimentación sonora con sintetizadores. Ejemplos: Joy Division, Talking Heads.' },
      { name: 'Psychedelic Rock', parent: 'Rock', description: 'Influencias psicodélicas y sonidos experimentales. Ejemplos: The Doors, Jefferson Airplane.' },
      { name: 'Southern Rock', parent: 'Rock', description: 'Fusión de rock con blues y country del sur de EE.UU. Ejemplos: Lynyrd Skynyrd, The Allman Brothers Band.' },
      { name: 'Blues Rock', parent: 'Rock', description: 'Raíces profundas en el blues. Ejemplos: Eric Clapton, Stevie Ray Vaughan.' },
      { name: 'Gothic Rock', parent: 'Rock', description: 'Sonido oscuro, melancólico. Ejemplos: The Cure, Bauhaus.' },
      { name: 'Industrial Rock', parent: 'Rock', description: 'Fusión de rock con electrónica y sonidos mecánicos. Ejemplos: Nine Inch Nails, Ministry.' },
      { name: 'Noise Rock', parent: 'Rock', description: 'Rompe convenciones, enfoque experimental. Ejemplos: Sonic Youth, Swans.' },
      { name: 'Ambient Rock', parent: 'Rock', description: 'Sonidos atmosféricos, repetitivos, sin voces. Ejemplos: Explosions in the Sky, Mogwai.' },
      { name: 'Krautrock', parent: 'Rock', description: 'Rock alemán de los 70, con electrónica y minimalismo. Ejemplos: Can, Kraftwerk.' },
      { name: 'Latin Rock', parent: 'Rock', description: 'Rock con identidad cultural latinoamericana. Ejemplos: Soda Stereo, Caifanes, Héroes del Silencio.' },
      { name: 'Celtic Rock', parent: 'Rock', description: 'Fusión con música celta y medieval. Ejemplos: Flogging Molly, The Pogues.' },
      { name: 'Instrumental Rock', parent: 'Rock', description: 'Sin voces, centrado en virtuosismo. Ejemplos: Joe Satriani, Steve Vai.' },
      { name: 'Britpop', parent: 'Rock', description: 'Subgénero británico de los 90 con melodías pegajosas. Ejemplos: Oasis, Blur, Pulp.' }
    ];

    // Subgéneros del Punk
    const punkSubgenres = [
      { name: 'Punk Rock', parent: 'Punk', description: 'Forma más pura, cruda y directa. Ejemplos: The Ramones, Sex Pistols.' },
      { name: 'Hardcore Punk', parent: 'Punk', description: 'Más rápido, agresivo, con influencias de metal. Ejemplos: Black Flag, Minor Threat.' },
      { name: 'Pop Punk', parent: 'Punk', description: 'Melodías accesibles y energía punk. Ejemplos: Green Day, Blink-182.' },
      { name: 'Post-Punk', parent: 'Punk', description: 'Experimentación con sintetizadores y atmósfera. Ejemplos: Joy Division, Talking Heads.' },
      { name: 'Ska Punk', parent: 'Punk', description: 'Fusión de punk y ska (ritmos jamaiquinos). Ejemplos: The Specials, No Doubt.' },
      { name: 'Crust Punk', parent: 'Punk', description: 'Sonido denso, letras políticas y sociales. Ejemplos: Amebix, Doom.' },
      { name: 'Oi!', parent: 'Punk', description: 'Enfocado en la clase trabajadora, sonido crudo. Ejemplos: Cock Sparrer, The Business.' }
    ];

    // Subgéneros del Metal
    const metalSubgenres = [
      { name: 'Thrash Metal', parent: 'Metal', description: 'Velocidad extrema, riffs agresivos. Ejemplos: Metallica, Slayer.' },
      { name: 'Death Metal', parent: 'Metal', description: 'Distorsión extrema, voces guturales. Ejemplos: Cannibal Corpse, Death.' },
      { name: 'Black Metal', parent: 'Metal', description: 'Sonido oscuro, atmosférico, letras oscuras. Ejemplos: Mayhem, Burzum.' },
      { name: 'Doom Metal', parent: 'Metal', description: 'Tempos lentos, sonido pesado y melancólico. Ejemplos: Candlemass, My Dying Bride.' },
      { name: 'Power Metal', parent: 'Metal', description: 'Melodías épicas, letras temáticas. Ejemplos: Helloween, Blind Guardian.' },
      { name: 'Progressive Metal', parent: 'Metal', description: 'Estructuras complejas, virtuosismo. Ejemplos: Dream Theater, Tool.' },
      { name: 'Symphonic Metal', parent: 'Metal', description: 'Fusión con orquestas y coros. Ejemplos: Within Temptation, Epica.' },
      { name: 'Folk Metal', parent: 'Metal', description: 'Influencias folclóricas europeas. Ejemplos: Eluveitie, Korpiklaani.' },
      { name: 'Industrial Metal', parent: 'Metal', description: 'Fusión con sonidos industriales y electrónicos. Ejemplos: Rammstein, Ministry.' },
      { name: 'Nu Metal', parent: 'Metal', description: 'Influencias de hip-hop, rap y metal. Ejemplos: Linkin Park, Korn.' },
      { name: 'Metalcore', parent: 'Metal', description: 'Fusión de hardcore punk y metal. Ejemplos: Killswitch Engage, Parkway Drive.' },
      { name: 'Deathcore', parent: 'Metal', description: 'Fusión de death metal y hardcore punk. Ejemplos: Whitechapel, Carnifex.' },
      { name: 'Melodic Death Metal', parent: 'Metal', description: 'Death metal con melodías atractivas. Ejemplos: At the Gates, In Flames.' },
      { name: 'Groove Metal', parent: 'Metal', description: 'Riffs pesados y ritmo constante. Ejemplos: Pantera, Lamb of God.' },
      { name: 'Sludge Metal', parent: 'Metal', description: 'Fusión de doom y hardcore, sonido denso. Ejemplos: Eyehategod, Crowbar.' }
    ];

    // Subgéneros del Hardcore
    const hardcoreSubgenres = [
      { name: 'Hardcore Punk', parent: 'Hardcore', description: 'Base del género, rápido y crudo. Ejemplos: Black Flag, Minor Threat.' },
      { name: 'Metalcore', parent: 'Hardcore', description: 'Evolución del hardcore con metal. Ejemplos: Killswitch Engage, Bring Me The Horizon.' },
      { name: 'Skate Punk', parent: 'Hardcore', description: 'Influencias del skate y sonido más melódico. Ejemplos: Offspring, Rancid.' },
      { name: 'Street Punk', parent: 'Hardcore', description: 'Enfocado en la vida urbana y clase trabajadora. Ejemplos: The Casualties, Agnostic Front.' },
      { name: 'Crust Punk', parent: 'Hardcore', description: 'Subgénero extremo con letras políticas. Ejemplos: Amebix, Doom.' },
      { name: 'D-beat', parent: 'Hardcore', description: 'Rítmica rápida y agresiva, origen en el Reino Unido. Ejemplos: Discharge, Chaos UK.' },
      { name: 'Straight Edge', parent: 'Hardcore', description: 'Movimiento con enfoque en abstinencia de drogas y alcohol. Ejemplos: Minor Threat, Youth of Today.' }
    ];

    // Función para crear géneros principales
    async function createMainGenres() {
      console.log('\n🎵 Creando géneros principales...');
      const genreMap = {};
      
      for (const genre of mainGenres) {
        try {
          // Primero verificar si ya existe
          const [existing] = await sequelize.query(
            'SELECT id, name FROM genres WHERE LOWER(name) = LOWER(:name)',
            {
              replacements: { name: genre.name },
              type: sequelize.QueryTypes.SELECT
            }
          );

          if (existing && existing.length > 0) {
            genreMap[genre.name] = existing[0];
            console.log(`⚠️  Ya existe: ${genre.name}`);
            continue;
          }

          // Si no existe, crearlo
          const [result] = await sequelize.query(
            `INSERT INTO genres (name, description, created_at, updated_at) 
             VALUES (:name, :description, NOW(), NOW()) 
             RETURNING id, name`,
            {
              replacements: genre,
              type: sequelize.QueryTypes.INSERT
            }
          );

          if (result && result.length > 0) {
            genreMap[genre.name] = result[0];
            console.log(`✅ Creado: ${genre.name}`);
          }
        } catch (error) {
          console.error(`❌ Error creando ${genre.name}:`, error.message);
        }
      }
      
      return genreMap;
    }

    // Función para crear subgéneros
    async function createSubgenres(subgenres, genreMap) {
      console.log('\n🎸 Creando subgéneros...');
      
      for (const subgenre of subgenres) {
        try {
          const parentGenre = genreMap[subgenre.parent];
          if (!parentGenre) {
            console.error(`❌ No se encontró género padre: ${subgenre.parent}`);
            continue;
          }

          // Primero verificar si ya existe
          const [existing] = await sequelize.query(
            'SELECT id, name FROM genres WHERE LOWER(name) = LOWER(:name)',
            {
              replacements: { name: subgenre.name },
              type: sequelize.QueryTypes.SELECT
            }
          );

          if (existing && existing.length > 0) {
            console.log(`⚠️  Ya existe: ${subgenre.name}`);
            continue;
          }

          // Si no existe, crearlo
          const [result] = await sequelize.query(
            `INSERT INTO genres (name, description, parent_id, created_at, updated_at) 
             VALUES (:name, :description, :parent_id, NOW(), NOW()) 
             RETURNING id, name`,
            {
              replacements: {
                name: subgenre.name,
                description: subgenre.description,
                parent_id: parentGenre.id
              },
              type: sequelize.QueryTypes.INSERT
            }
          );

          if (result && result.length > 0) {
            console.log(`✅ Creado: ${subgenre.name} (hijo de ${subgenre.parent})`);
          }
        } catch (error) {
          console.error(`❌ Error creando ${subgenre.name}:`, error.message);
        }
      }
    }

    // Ejecutar creación
    const genreMap = await createMainGenres();
    await createSubgenres(rockSubgenres, genreMap);
    await createSubgenres(punkSubgenres, genreMap);
    await createSubgenres(metalSubgenres, genreMap);
    await createSubgenres(hardcoreSubgenres, genreMap);

    // Verificar resultados finales
    const [finalResults] = await sequelize.query('SELECT * FROM genres ORDER BY name');
    console.log(`\n📈 Total de géneros en BD: ${finalResults.length}`);
    
    // Estadísticas
    const mainGenresCount = finalResults.filter(g => g.parent_id === null).length;
    const subgenresCount = finalResults.filter(g => g.parent_id !== null).length;
    
    console.log(`📊 Estadísticas:`);
    console.log(`   - Géneros principales: ${mainGenresCount}`);
    console.log(`   - Subgéneros: ${subgenresCount}`);
    console.log(`   - Total: ${finalResults.length}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

createComprehensiveGenres();
