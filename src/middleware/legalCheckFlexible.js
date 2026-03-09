const { LegalDocument, LegalAcceptance } = require('../models');

/**
 * Middleware flexible que permite operaciones básicas sin contrato
 * pero requiere contrato para operaciones críticas
 */
const ensureContractAcceptedFlexible = async (req, res, next) => {
  try {
    console.log('=== FLEXIBLE LEGAL CHECK MIDDLEWARE LOADED ===');
    const userId = req.user.id;
    const requestPath = req.path; // This will be relative to /api
    const requestMethod = req.method;
    
    console.log('=== FLEXIBLE LEGAL CHECK DEBUG ===');
    console.log('User ID:', userId);
    console.log('Request:', requestMethod, requestPath);
    
    // Operaciones básicas que no requieren contrato (rutas relativas a /api)
    const basicOperations = [
      'PUT /albums/:id',           // Actualizar álbum básico
      'POST /albums/:id/cover',   // Actualizar portada
      'DELETE /albums/:id',      // Eliminar álbum
      'PUT /artists/:id/image',  // Actualizar imagen de artista
      'POST /albums',             // Crear álbum básico
    ];
    
    // Verificar si la operación actual es básica
    const isBasicOperation = basicOperations.some(op => {
      const [method, path] = op.split(' ');
      if (method !== requestMethod) return false;
      
      // Convertir ruta con parámetros a regex
      const pathRegex = new RegExp('^' + path.replace(/:id/g, '\\d+') + '$');
      return pathRegex.test(requestPath);
    });
    
    console.log('Is basic operation:', isBasicOperation);
    
    if (isBasicOperation) {
      console.log('Allowing basic operation without contract check');
      return next();
    }
    
    // Para operaciones críticas, verificar contrato
    const activeContract = await LegalDocument.findOne({
      where: {
        type: 'artist_contract',
        is_active: true
      },
      order: [['createdAt', 'DESC']]
    });

    if (!activeContract) {
      console.warn('No active artist contract found');
      return next();
    }

    const acceptance = await LegalAcceptance.findOne({
      where: {
        userId: userId,
        legalDocumentId: activeContract.id
      }
    });

    console.log('Contract acceptance:', acceptance ? 'YES' : 'NO');

    if (!acceptance) {
      console.log('Blocking critical operation - contract not accepted');
      return res.status(403).json({
        error: 'Legal Acceptance Required',
        message: 'You must accept the latest artist contract before performing this action.',
        contractId: activeContract.id,
        version: activeContract.version
      });
    }

    console.log('Critical operation allowed - contract accepted');
    next();
  } catch (error) {
    console.error('Error in flexible legal check:', error);
    return res.status(500).json({ error: 'Internal Server Error during legal check' });
  }
};

module.exports = { ensureContractAcceptedFlexible };
