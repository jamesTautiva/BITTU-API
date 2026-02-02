const router = require('express').Router();
const ticketController = require('../controllers/ticket.controller');
const ticketMessageController = require('../controllers/ticketMessage.controller');
const { authenticate } = require('../middleware/auth.middleware');
const authorizeRoles = require('../middleware/role.middleware');
const { validateCreateTicket, validateUpdateTicket } = require('../middleware/validators/ticket.validator');

// Public routes (authenticated users)
router.post('/', validateCreateTicket, ticketController.createTicket); // Temporarily without auth for testing
router.get('/my-tickets', authenticate, ticketController.getUserTickets);
router.get('/:id', authenticate, ticketController.getTicketById);

// Admin and Support routes
router.get('/', ticketController.getAllTickets); // Temporarily without auth for testing
router.put('/:id', authenticate, authorizeRoles('admin', 'super_admin', 'support', 'moderator'), validateUpdateTicket, ticketController.updateTicket);
router.put('/:id/assign', authenticate, authorizeRoles('admin', 'super_admin', 'support', 'moderator'), ticketController.assignTicket);
router.put('/:id/status', authenticate, authorizeRoles('admin', 'super_admin', 'support', 'moderator'), ticketController.updateTicketStatus);
router.delete('/:id', authenticate, authorizeRoles('admin', 'super_admin'), ticketController.deleteTicket);

// Ticket messages
router.get('/:id/messages', authenticate, ticketMessageController.getTicketMessages);
router.post('/:id/messages', authenticate, ticketMessageController.createMessage);
router.put('/messages/:id', authenticate, authorizeRoles('admin', 'super_admin', 'support', 'moderator'), ticketMessageController.updateMessage);
router.delete('/messages/:id', authenticate, authorizeRoles('admin', 'super_admin', 'support'), ticketMessageController.deleteMessage);

// Ticket categories
router.get('/categories/all', ticketController.getCategories);

module.exports = router;
