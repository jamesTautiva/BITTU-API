const { LegalAcceptance, LegalDocument } = require('../models');

// Get legal acceptances for a user
exports.getUserLegalAcceptances = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    
    const acceptances = await LegalAcceptance.findAll({
      where: { userId },
      include: [
        {
          model: LegalDocument,
          as: 'document',
          attributes: ['id', 'title', 'type', 'version', 'is_active']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(acceptances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get legal acceptances for a user by document type
exports.getUserLegalAcceptancesByType = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    const { documentType } = req.params;
    
    // Find active document of this type
    const document = await LegalDocument.findOne({
      where: {
        type: documentType,
        is_active: true
      }
    });

    if (!document) {
      return res.status(404).json({ error: 'No active document found for this type' });
    }

    const acceptance = await LegalAcceptance.findOne({
      where: {
        userId,
        legalDocumentId: document.id
      }
    });

    res.json({
      hasAccepted: !!acceptance,
      acceptance: acceptance || null,
      document: document
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Accept a legal document
exports.acceptLegalDocument = async (req, res) => {
  try {
    const userId = req.user.id;
    const { documentId, ipAddress, userAgent } = req.body;

    // Validate required fields
    if (!documentId) {
      return res.status(400).json({ error: 'documentId is required' });
    }

    // Verify document exists and is active
    const document = await LegalDocument.findOne({
      where: {
        id: documentId,
        is_active: true
      }
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found or not active' });
    }

    // Check if already accepted
    const existingAcceptance = await LegalAcceptance.findOne({
      where: {
        userId,
        legalDocumentId: documentId
      }
    });

    if (existingAcceptance) {
      return res.status(400).json({ error: 'Document already accepted' });
    }

    // Create acceptance record
    const acceptance = await LegalAcceptance.create({
      userId,
      legalDocumentId: documentId,
      ipAddress: ipAddress || req.ip,
      userAgent: userAgent || req.get('User-Agent'),
      acceptedAt: new Date()
    });

    res.status(201).json({
      message: 'Legal document accepted successfully',
      acceptance
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
