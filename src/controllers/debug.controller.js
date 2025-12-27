const { Sequelize } = require('sequelize');

// This endpoint used to close the shared Sequelize instance which made the
// whole app unusable afterwards. To be safe, we now create a temporary
// Sequelize instance, close it, and then attempt to query using that closed
// instance to reproduce the same error without touching the app-wide
// connection manager.
exports.closeAndQuery = async (req, res) => {
  try {
    if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test') {
      return res.status(403).json({ error: 'Forbidden: debug endpoints are only available in development/test' });
    }

    const dbUrl = process.env.DATABASE_URL || '';
    const hasSslInUrl = /(?:sslmode|ssl)=?(?:require|true)/i.test(dbUrl) || /\bssl=true\b/i.test(dbUrl);
    const useSsl = process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production' || hasSslInUrl;

    const opts = { dialect: 'postgres', protocol: 'postgres', logging: false };
    if (useSsl) {
      opts.dialectOptions = { ssl: { require: true, rejectUnauthorized: false } };
    }

    // Create a temporary Sequelize instance and close it to simulate the
    // "connection manager closed" condition in an isolated way.
    const temp = new Sequelize(process.env.DATABASE_URL, opts);
    await temp.close();

    // Attempting a query on the closed instance should throw the same kind of error
    await temp.query('SELECT 1');

    // If it somehow succeeds, return a success message (unexpected)
    res.json({ message: 'Query after close unexpectedly succeeded' });
  } catch (error) {
    res.status(400).json({ error: error && error.message ? error.message : String(error) });
  }
};

exports.restartServer = async (req, res) => {
  if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test') {
    return res.status(403).json({ error: 'Forbidden: debug endpoints are only available in development/test' });
  }

  // In test environment we don't actually exit the process to avoid killing the test runner.
  if (process.env.NODE_ENV === 'test') {
    return res.json({ message: 'Test mode: simulated restart (no process exit).' });
  }

  res.json({ message: 'Server will exit to allow restart (nodemon or process manager should restart it).' });
  // give the response time to flush
  setTimeout(() => process.exit(0), 200);
};

