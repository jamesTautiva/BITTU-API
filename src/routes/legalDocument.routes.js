const router = require('express').Router();
const legalDocumentController = require('../controllers/legalDocument.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Public routes - anyone can view active documents
router.get('/', legalDocumentController.getAllLegalDocuments);
router.get('/:id', legalDocumentController.getLegalDocumentById);

// Protected routes - admin only
router.post('/', authenticate, legalDocumentController.createLegalDocument);
router.put('/:id', authenticate, legalDocumentController.updateLegalDocument);
router.delete('/:id', authenticate, legalDocumentController.deleteLegalDocument);

module.exports = router;
