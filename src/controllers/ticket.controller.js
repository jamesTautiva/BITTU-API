const { Ticket, TicketCategory, User, TicketMessage, TicketAttachment } = require('../models');
const { Op } = require('sequelize');

// Create a new ticket
exports.createTicket = async (req, res) => {
  try {
    const { title, description, category_id, priority = 'medium' } = req.body;
    const user_id = req.user?.id || 1; // Get from auth middleware or default

    // Verify category exists
    const category = await TicketCategory.findByPk(category_id);
    if (!category) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    const ticket = await Ticket.create({
      user_id,
      title,
      description,
      category_id,
      priority
    });

    // Include related data in response
    const ticketWithRelations = await Ticket.findByPk(ticket.id, {
      include: [
        {
          model: TicketCategory,
          attributes: ['id', 'name', 'color', 'icon']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.status(201).json(ticketWithRelations);
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ error: 'Error al crear el ticket' });
  }
};

// Get all tickets with filtering and pagination
exports.getAllTickets = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      priority,
      category_id,
      assigned_to,
      search
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    // Build filters
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (category_id) where.category_id = category_id;
    if (assigned_to) where.assigned_to = assigned_to;
    
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { ticket_number: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows: tickets } = await Ticket.findAndCountAll({
      where,
      include: [
        {
          model: TicketCategory,
          attributes: ['id', 'name', 'color', 'icon']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'assignedTo',
          attributes: ['id', 'name', 'email'],
          required: false
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      tickets,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error getting tickets:', error);
    res.status(500).json({ error: 'Error al obtener los tickets' });
  }
};

// Get ticket by ID with messages and attachments
exports.getTicketById = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findByPk(id, {
      include: [
        {
          model: TicketCategory,
          attributes: ['id', 'name', 'color', 'icon']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'assignedTo',
          attributes: ['id', 'name', 'email'],
          required: false
        },
        {
          model: TicketMessage,
          include: [
            {
              model: User,
              attributes: ['id', 'name', 'email']
            },
            {
              model: TicketAttachment,
              required: false
            }
          ],
          order: [['created_at', 'ASC']]
        },
        {
          model: TicketAttachment,
          where: { message_id: null },
          required: false
        }
      ]
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket no encontrado' });
    }

    res.json(ticket);
  } catch (error) {
    console.error('Error getting ticket:', error);
    res.status(500).json({ error: 'Error al obtener el ticket' });
  }
};

// Update ticket
exports.updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category_id, priority, status, assigned_to } = req.body;

    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket no encontrado' });
    }

    // Verify category exists if provided
    if (category_id && category_id !== ticket.category_id) {
      const category = await TicketCategory.findByPk(category_id);
      if (!category) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
      }
    }

    // Update timestamps for status changes
    const updateData = { title, description, category_id, priority, status, assigned_to };
    
    if (status === 'resolved' && ticket.status !== 'resolved') {
      updateData.resolved_at = new Date();
    }
    
    if (status === 'closed' && ticket.status !== 'closed') {
      updateData.closed_at = new Date();
    }

    await ticket.update(updateData);

    // Return updated ticket with relations
    const updatedTicket = await Ticket.findByPk(id, {
      include: [
        {
          model: TicketCategory,
          attributes: ['id', 'name', 'color', 'icon']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'assignedTo',
          attributes: ['id', 'name', 'email'],
          required: false
        }
      ]
    });

    res.json(updatedTicket);
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({ error: 'Error al actualizar el ticket' });
  }
};

// Delete ticket
exports.deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket no encontrado' });
    }

    await ticket.destroy();
    res.json({ message: 'Ticket eliminado correctamente' });
  } catch (error) {
    console.error('Error deleting ticket:', error);
    res.status(500).json({ error: 'Error al eliminar el ticket' });
  }
};

// Get ticket categories
exports.getTicketCategories = async (req, res) => {
  try {
    const categories = await TicketCategory.findAll({
      where: { is_active: true },
      order: [['sort_order', 'ASC'], ['name', 'ASC']]
    });
    res.json(categories);
  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({ error: 'Error al obtener las categorías' });
  }
};

// Get user's tickets
exports.getUserTickets = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20, status } = req.query;

    const offset = (page - 1) * limit;
    const where = { user_id: userId };
    
    if (status) where.status = status;

    const { count, rows: tickets } = await Ticket.findAndCountAll({
      where,
      include: [
        {
          model: TicketCategory,
          attributes: ['id', 'name', 'color', 'icon']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      tickets,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error getting user tickets:', error);
    res.status(500).json({ error: 'Error al obtener los tickets del usuario' });
  }
};

// Get ticket statistics
exports.getTicketStats = async (req, res) => {
  try {
    const stats = await Promise.all([
      Ticket.count({ where: { status: 'open' } }),
      Ticket.count({ where: { status: 'in_progress' } }),
      Ticket.count({ where: { status: 'resolved' } }),
      Ticket.count({ where: { status: 'closed' } }),
      Ticket.count({ where: { priority: 'urgent' } }),
      Ticket.count({ where: { priority: 'high' } }),
      Ticket.count({ where: { created_at: { [Op.gte]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000) } } })
    ]);

    res.json({
      open: stats[0],
      in_progress: stats[1],
      resolved: stats[2],
      closed: stats[3],
      urgent: stats[4],
      high: stats[5],
      last_30_days: stats[6]
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
};

// Get all ticket categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await TicketCategory.findAll({
      where: { is_active: true },
      order: [['sort_order', 'ASC'], ['name', 'ASC']]
    });
    
    res.json(categories);
  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({ error: 'Error al obtener las categorías' });
  }
};

// Assign ticket to user
exports.assignTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { assigned_to } = req.body;
    
    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket no encontrado' });
    }
    
    ticket.assigned_to = assigned_to;
    await ticket.save();
    
    const updatedTicket = await Ticket.findByPk(id, {
      include: [
        { model: TicketCategory, attributes: ['id', 'name', 'color', 'icon'] },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email'], required: false }
      ]
    });
    
    res.json(updatedTicket);
  } catch (error) {
    console.error('Error assigning ticket:', error);
    res.status(500).json({ error: 'Error al asignar el ticket' });
  }
};

// Update ticket status
exports.updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket no encontrado' });
    }
    
    ticket.status = status;
    
    // Set resolved_at or closed_at timestamps
    if (status === 'resolved') {
      ticket.resolved_at = new Date();
    } else if (status === 'closed') {
      ticket.closed_at = new Date();
    }
    
    await ticket.save();
    
    const updatedTicket = await Ticket.findByPk(id, {
      include: [
        { model: TicketCategory, attributes: ['id', 'name', 'color', 'icon'] },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email'], required: false }
      ]
    });
    
    res.json(updatedTicket);
  } catch (error) {
    console.error('Error updating ticket status:', error);
    res.status(500).json({ error: 'Error al actualizar el estado del ticket' });
  }
};

// Get user tickets
exports.getUserTickets = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      page = 1,
      limit = 20,
      status,
      priority,
      category_id,
      search
    } = req.query;

    const offset = (page - 1) * limit;
    const where = { user_id: userId };

    // Build filters
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (category_id) where.category_id = category_id;
    
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { ticket_number: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows: tickets } = await Ticket.findAndCountAll({
      where,
      include: [
        { model: TicketCategory, attributes: ['id', 'name', 'color', 'icon'] },
        { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email'], required: false }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      tickets,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error getting user tickets:', error);
    res.status(500).json({ error: 'Error al obtener los tickets del usuario' });
  }
};

// Update ticket
exports.updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category_id, priority, status, assigned_to } = req.body;
    
    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket no encontrado' });
    }
    
    // Update fields
    if (title) ticket.title = title;
    if (description) ticket.description = description;
    if (category_id) ticket.category_id = category_id;
    if (priority) ticket.priority = priority;
    if (status) {
      ticket.status = status;
      if (status === 'resolved') ticket.resolved_at = new Date();
      if (status === 'closed') ticket.closed_at = new Date();
    }
    if (assigned_to !== undefined) ticket.assigned_to = assigned_to;
    
    await ticket.save();
    
    const updatedTicket = await Ticket.findByPk(id, {
      include: [
        { model: TicketCategory, attributes: ['id', 'name', 'color', 'icon'] },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email'], required: false }
      ]
    });
    
    res.json(updatedTicket);
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({ error: 'Error al actualizar el ticket' });
  }
};

// Delete ticket
exports.deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    
    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket no encontrado' });
    }
    
    await ticket.destroy();
    
    res.json({ message: 'Ticket eliminado correctamente' });
  } catch (error) {
    console.error('Error deleting ticket:', error);
    res.status(500).json({ error: 'Error al eliminar el ticket' });
  }
};
