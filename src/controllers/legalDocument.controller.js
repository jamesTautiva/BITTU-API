const { LegalDocument } = require('../models');

// Get all legal documents
exports.getAllLegalDocuments = async (req, res) => {
  try {
    const documents = await LegalDocument.findAll({
      where: { is_active: true },
      order: [['createdAt', 'DESC']]
    });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get legal document by id
exports.getLegalDocumentById = async (req, res) => {
  try {
    const document = await LegalDocument.findByPk(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create legal document (admin only)
exports.createLegalDocument = async (req, res) => {
  try {
    const { title, content, type, version, is_active } = req.body;

    if (!title || !content || !type) {
      return res.status(400).json({ error: 'title, content, and type are required' });
    }

    const document = await LegalDocument.create({
      title,
      content,
      type,
      version: version || '1.0',
      is_active: is_active !== undefined ? is_active : true
    });

    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update legal document (admin only)
exports.updateLegalDocument = async (req, res) => {
  try {
    const document = await LegalDocument.findByPk(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const { title, content, type, version, is_active } = req.body;
    
    if (title) document.title = title;
    if (content) document.content = content;
    if (type) document.type = type;
    if (version) document.version = version;
    if (is_active !== undefined) document.is_active = is_active;

    await document.save();
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete legal document (admin only)
exports.deleteLegalDocument = async (req, res) => {
  try {
    const document = await LegalDocument.findByPk(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    await document.destroy();
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
