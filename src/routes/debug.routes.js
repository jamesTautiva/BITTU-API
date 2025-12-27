const router = require('express').Router();
const debugController = require('../controllers/debug.controller');

// POST /debug/close-and-query -> closes DB and performs query to reproduce the error
router.post('/close-and-query', debugController.closeAndQuery);
router.post('/restart', debugController.restartServer);

module.exports = router;
