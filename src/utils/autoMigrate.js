const { sequelize } = require('../config/database');

const autoMigrate = async () => {
  try {
    // Solo ejecutar en producción si la variable está activada
    if (process.env.AUTO_MIGRATE === 'true') {
      console.log('Running auto-migration...');
      
      const { execSync } = require('child_process');
      const result = execSync('npx sequelize-cli db:migrate', { 
        encoding: 'utf8',
        cwd: process.cwd()
      });
      
      console.log('Migration completed:', result);
    }
  } catch (error) {
    console.error('Auto-migration failed:', error);
  }
};

module.exports = autoMigrate;
