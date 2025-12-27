const { ensureBucket } = require('../utils/supabaseClient');

exports.setupBuckets = async (req, res) => {
  try {
    const setupSecret = process.env.SUPABASE_SETUP_SECRET;
    const headerSecret = req.get('X-SETUP-SECRET');
    const env = process.env.NODE_ENV || 'development';

    if (!process.env.SUPABASE_SERVICE_KEY && env === 'production') {
      return res.status(403).json({ error: 'Not allowed in production without SUPABASE_SERVICE_KEY' });
    }

    if (setupSecret && setupSecret !== headerSecret) {
      return res.status(401).json({ error: 'Invalid setup secret' });
    }

    const buckets = ['avatars', 'artists', 'albums', 'songs'];
    const results = [];
    for (const b of buckets) {
      try {
        await ensureBucket(b);
        results.push({ bucket: b, status: 'ensured' });
      } catch (err) {
        results.push({ bucket: b, status: 'error', message: err.message || err });
      }
    }

    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
