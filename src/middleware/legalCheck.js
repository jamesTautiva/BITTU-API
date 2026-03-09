const { LegalDocument, LegalAcceptance } = require('../models');

/**
 * Middleware to ensure the user has accepted the latest active artist contract.
 */
const ensureContractAccepted = async (req, res, next) => {
  try {
    const userId = req.user.id; // Assuming req.user is populated by auth middleware
    
    console.log('=== LEGAL CHECK DEBUG ===');
    console.log('User ID from token:', userId);
    console.log('User object:', req.user);
    console.log('Request URL:', req.url);
    console.log('Request Method:', req.method);

    // 1. Find the active artist contract
    const activeContract = await LegalDocument.findOne({
      where: {
        type: 'artist_contract',
        is_active: true
      },
      order: [['createdAt', 'DESC']] // Get the latest one if multiple are active (though logic implies one)
    });

    console.log('Active contract found:', activeContract ? 'YES' : 'NO');
    if (activeContract) {
      console.log('Contract ID:', activeContract.id, 'Title:', activeContract.title);
    }

    // If no active contract exists, we might allow it (system init) or block.
    // Requirement says: "Si NO existe aceptación válida del contrato" -> Block.
    // But if there is NO contract to accept?
    // Let's assume if no contract exists, we can't enforce it.
    // BUT, for safety, let's log it.
    if (!activeContract) {
      // If no contract is defined in the system, maybe it's safe?
      // Or maybe we should block saying "System error: No contract available".
      // For now, let's assume if no contract exists, we can't enforce it.
      // BUT, for safety, let's log it.
      console.warn('No active artist_contract found. allowing action but this might be wrong.');
      return next();
    }

    // 2. Check if user accepted THIS version
    const acceptance = await LegalAcceptance.findOne({
      where: {
        userId: userId,
        legalDocumentId: activeContract.id
      }
    });

    console.log('Acceptance found:', acceptance ? 'YES' : 'NO');
    if (acceptance) {
      console.log('Accepted at:', acceptance.acceptedAt);
    }

    if (!acceptance) {
      console.log('Blocking action - contract not accepted');
      return res.status(403).json({
        error: 'Legal Acceptance Required',
        message: 'You must accept the latest artist contract before performing this action.',
        contractId: activeContract.id,
        version: activeContract.version
      });
    }

    console.log('Legal check passed - proceeding with action');
    // 3. Proceed
    next();
  } catch (error) {
    console.error('Error in ensureContractAccepted:', error);
    return res.status(500).json({ error: 'Internal Server Error during legal check' });
  }
};

module.exports = { ensureContractAccepted };
