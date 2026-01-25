require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/database');
const routes = require('./routes');

const PORT = process.env.PORT || 3000;

app.use('/api', routes);

(async () => {
  try {
    await sequelize.authenticate();
    console.log(' Database connected');

    // Sincronizar base de datos (solo en desarrollo o cuando se necesite resetear)
    if (process.env.SYNC_DB === 'true') {
      console.log(' Synchronizing database...');
      await sequelize.sync({ force: true }); // force: true elimina y recrea las tablas
      console.log(' Database synchronized successfully');
    }

    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(' Unable to connect to the database:', error.message || error);
    process.exit(1);
  }
})();
