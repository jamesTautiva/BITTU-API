require('dotenv').config();

// Unified database configuration logic
const getDatabaseConfig = (env) => {
  if (process.env.DATABASE_URL) {
    return {
      use_env_variable: 'DATABASE_URL',
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    };
  } else {
    return {
      database: process.env.DB_NAME || 'bittu_api',
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      dialect: 'mariadb'
    };
  }
};

module.exports = {
  development: getDatabaseConfig('development'),
  production: getDatabaseConfig('production'),
  test: getDatabaseConfig('test')
};