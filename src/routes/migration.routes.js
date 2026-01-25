const express = require('express');
const router = express.Router();
const { sequelize } = require('../config/database');

// Endpoint para ejecutar migraciones (solo para desarrollo/emergencia)
router.post('/run-migrations', async (req, res) => {
  try {
    const { execSync } = require('child_process');
    
    // Ejecutar migraciones
    const result = execSync('npx sequelize-cli db:migrate', { 
      encoding: 'utf8',
      cwd: process.cwd()
    });
    
    res.json({ 
      success: true, 
      message: 'Migrations executed successfully',
      output: result 
    });
  } catch (error) {
    console.error('Migration error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;
