require('dotenv').config();
const { listBuckets } = require('../src/utils/supabaseClient');

(async function(){
  try {
    const data = await listBuckets();
    console.log('Buckets:', (data || []).map(b => ({ name: b.name, public: b.public })));
  } catch (err) {
    console.error('Unexpected error:', err.message || err);
    process.exit(2);
  }
})();