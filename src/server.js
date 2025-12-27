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

    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(' Unable to connect to the database:', error.message || error);
    process.exit(1);
  }
})();
