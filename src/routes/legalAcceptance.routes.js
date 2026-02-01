const router = require('express').Router();
const legalAcceptanceController = require('../controllers/legalAcceptance.controller');
const { authenticate } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticate);

// Get user's legal acceptances
router.get('/user/:userId', legalAcceptanceController.getUserLegalAcceptances);
router.get('/user/:userId/type/:documentType', legalAcceptanceController.getUserLegalAcceptancesByType);

// Accept a legal document
router.post('/accept', legalAcceptanceController.acceptLegalDocument);

module.exports = router;
