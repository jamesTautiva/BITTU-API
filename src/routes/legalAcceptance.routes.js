const router = require('express').Router();
const legalAcceptanceController = require('../controllers/legalAcceptance.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Get user's legal acceptances (no auth required for public access)
router.get('/user/:userId', legalAcceptanceController.getUserLegalAcceptances);
router.get('/user/:userId/type/:documentType', legalAcceptanceController.getUserLegalAcceptancesByType);

// Accept a legal document (requires authentication)
router.post('/accept', authenticate, legalAcceptanceController.acceptLegalDocument);

module.exports = router;
