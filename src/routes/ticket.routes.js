const router = require('express').Router();
const ticketController = require('../controllers/ticket.controller');
const ticketMessageController = require('../controllers/ticketMessage.controller');
const { authenticate } = require('../middleware/auth.middleware');
const authorizeRoles = require('../middleware/role.middleware');
const { validateCreateTicket, validateUpdateTicket } = require('../middleware/validators/ticket.validator');

// Public routes (authenticated users)
router.post('/', validateCreateTicket, ticketController.createTicket); // Temporarily without auth for testing
router.get('/my-tickets', authenticate, ticketController.getUserTickets);
router.get('/assigned-tickets', authenticate, ticketController.getAssignedTickets);
router.get('/:id', authenticate, ticketController.getTicketById);

// Admin and Support routes
router.get('/', ticketController.getAllTickets); // Temporarily without auth for testing
router.put('/:id', authenticate, authorizeRoles('admin', 'super_admin', 'support', 'moderator'), validateUpdateTicket, ticketController.updateTicket);
router.put('/:id/assign', authenticate, authorizeRoles('admin', 'super_admin', 'support', 'moderator'), ticketController.assignTicket);
router.put('/:id/status', ticketController.updateTicketStatus); // Temporarily without auth for testing
router.delete('/:id', authenticate, authorizeRoles('admin', 'super_admin'), ticketController.deleteTicket);

// Ticket messages
router.get('/:id/messages', ticketMessageController.getTicketMessages); // Temporarily without auth for testing
router.post('/:id/messages', ticketMessageController.createMessage); // Temporarily without auth for testing
router.put('/messages/:id', authenticate, authorizeRoles('admin', 'super_admin', 'support', 'moderator'), ticketMessageController.updateMessage);
router.delete('/messages/:id', authenticate, authorizeRoles('admin', 'super_admin', 'support'), ticketMessageController.deleteMessage);

// Ticket categories
router.get('/categories/all', ticketController.getCategories);

// Temporal sync route for development
router.post('/sync-models', ticketController.syncModels);

module.exports = router;
