const { body, param, query } = require('express-validator');

// Create ticket validation
exports.validateCreateTicket = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('El título debe tener entre 3 y 255 caracteres'),
  
  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('La descripción debe tener al menos 10 caracteres'),
  
  body('category_id')
    .isInt({ min: 1 })
    .withMessage('La categoría debe ser un número entero válido'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('La prioridad debe ser: low, medium, high o urgent')
];

// Update ticket validation
exports.validateUpdateTicket = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID del ticket debe ser un número entero válido'),
  
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('El título debe tener entre 3 y 255 caracteres'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage('La descripción debe tener al menos 10 caracteres'),
  
  body('category_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La categoría debe ser un número entero válido'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('La prioridad debe ser: low, medium, high o urgent'),
  
  body('status')
    .optional()
    .isIn(['open', 'in_progress', 'pending_user', 'resolved', 'closed'])
    .withMessage('El estado debe ser: open, in_progress, pending_user, resolved o closed'),
  
  body('assigned_to')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El ID del asignado debe ser un número entero válido')
];

// Get tickets validation
exports.validateGetTickets = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número entero mayor a 0'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un número entre 1 y 100'),
  
  query('status')
    .optional()
    .isIn(['open', 'in_progress', 'pending_user', 'resolved', 'closed'])
    .withMessage('El estado debe ser: open, in_progress, pending_user, resolved o closed'),
  
  query('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('La prioridad debe ser: low, medium, high o urgent'),
  
  query('category_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La categoría debe ser un número entero válido'),
  
  query('assigned_to')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El ID del asignado debe ser un número entero válido'),
  
  query('search')
    .optional()
    .isLength({ min: 2 })
    .withMessage('La búsqueda debe tener al menos 2 caracteres')
];

// Ticket ID validation
exports.validateTicketId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID del ticket debe ser un número entero válido')
];

// Message validation
exports.validateMessage = [
  body('message')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('El mensaje debe tener entre 1 y 2000 caracteres'),
  
  body('is_internal')
    .optional()
    .isBoolean()
    .withMessage('is_internal debe ser un valor booleano')
];
