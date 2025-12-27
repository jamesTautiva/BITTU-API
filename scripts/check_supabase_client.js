require('dotenv').config();
const { supabase, supabaseAdmin } = require('../src/utils/supabaseClient');
console.log('SUPABASE_URL present:', !!process.env.SUPABASE_URL);
console.log('SUPABASE_KEY present:', !!process.env.SUPABASE_KEY);
console.log('SUPABASE_SERVICE_KEY present:', !!process.env.SUPABASE_SERVICE_KEY);
console.log('supabase object type:', typeof supabase);
console.log('supabase.storage exists:', !!(supabase && supabase.storage));
if (supabase && supabase.storage) console.log('listBuckets func type:', typeof supabase.storage.listBuckets);
console.log('supabaseAdmin present?:', !!supabaseAdmin);
