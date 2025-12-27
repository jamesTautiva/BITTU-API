const router = require('express').Router();
const supabaseController = require('../controllers/supabase.controller');

// POST /supabase/setup - ensure required buckets exist
router.post('/setup', supabaseController.setupBuckets);

module.exports = router;
