const { TicketMessage, Ticket, User, TicketAttachment } = require('../models');

// Temporal: Verificar si los modelos se importan correctamente
console.log('🔍 Models loaded:', {
  TicketMessage: !!TicketMessage,
  Ticket: !!Ticket,
  User: !!User,
  TicketAttachment: !!TicketAttachment
});

// Create a new message in a ticket
exports.createMessage = async (req, res) => {
  try {
    const { ticket_id } = req.params;
    const { message, message_type = 'text', is_internal = false } = req.body;
    const user_id = req.user?.id || 1; // Get from auth middleware or default

    // Verify ticket exists
    const ticket = await Ticket.findByPk(ticket_id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket no encontrado' });
    }

    const ticketMessage = await TicketMessage.create({
      ticket_id,
      user_id,
      message,
      message_type,
      is_internal
    });

    // Include related data in response
    const messageWithRelations = await TicketMessage.findByPk(ticketMessage.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'email']
        },
        {
          model: TicketAttachment,
          required: false
        }
      ]
    });

    res.status(201).json(messageWithRelations);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Error al crear el mensaje' });
  }
};

// Get all messages for a ticket
exports.getTicketMessages = async (req, res) => {
  try {
    const { id } = req.params; // Corregido: era ticket_id, ahora es id
    const { page = 1, limit = 50, include_internal = false } = req.query;

    console.log('🔍 getTicketMessages called for ticket_id:', id);

    const offset = (page - 1) * limit;
    const where = { ticket_id: id }; // Usar el id como ticket_id
    
    if (include_internal !== 'true') {
      where.is_internal = false;
    }

    console.log('📋 Query where:', where);

    // Simplificar la consulta para probar
    const messages = await TicketMessage.findAll({
      where,
      order: [['created_at', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    console.log('✅ Messages found:', messages.length);

    res.json({
      messages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: messages.length,
        pages: Math.ceil(messages.length / limit)
      }
    });
  } catch (error) {
    console.error('❌ Error getting messages:', error);
    res.status(500).json({ error: 'Error al obtener los mensajes', details: error.message });
  }
};

// Update a message
exports.updateMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const user_id = req.user?.id || 1;

    const ticketMessage = await TicketMessage.findByPk(id);
    if (!ticketMessage) {
      return res.status(404).json({ error: 'Mensaje no encontrado' });
    }

    // Check if user owns the message
    if (ticketMessage.user_id !== user_id) {
      return res.status(403).json({ error: 'No tienes permiso para editar este mensaje' });
    }

    // Don't allow editing system messages
    if (ticketMessage.message_type === 'system') {
      return res.status(400).json({ error: 'No se pueden editar mensajes del sistema' });
    }

    await ticketMessage.update({
      message,
      is_edited: true,
      edited_at: new Date()
    });

    const updatedMessage = await TicketMessage.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'email']
        }
      ]
    });

    res.json(updatedMessage);
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({ error: 'Error al actualizar el mensaje' });
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user?.id || 1;

    const ticketMessage = await TicketMessage.findByPk(id);
    if (!ticketMessage) {
      return res.status(404).json({ error: 'Mensaje no encontrado' });
    }

    // Check if user owns the message
    if (ticketMessage.user_id !== user_id) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este mensaje' });
    }

    // Don't allow deleting system messages
    if (ticketMessage.message_type === 'system') {
      return res.status(400).json({ error: 'No se pueden eliminar mensajes del sistema' });
    }

    await ticketMessage.destroy();
    res.json({ message: 'Mensaje eliminado correctamente' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Error al eliminar el mensaje' });
  }
};

// Mark messages as read (for internal notifications)
exports.markMessagesAsRead = async (req, res) => {
  try {
    const { ticket_id } = req.params;
    const { message_ids } = req.body; // Array of message IDs
    const user_id = req.user?.id || 1;

    if (!message_ids || !Array.isArray(message_ids)) {
      return res.status(400).json({ error: 'Se requiere un array de IDs de mensajes' });
    }

    // This would typically update a separate read_status table
    // For now, we'll just return success
    res.json({ message: 'Mensajes marcados como leídos', count: message_ids.length });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ error: 'Error al marcar mensajes como leídos' });
  }
};

// Get internal notes for a ticket
exports.getInternalNotes = async (req, res) => {
  try {
    const { ticket_id } = req.params;

    const messages = await TicketMessage.findAll({
      where: { 
        ticket_id,
        is_internal: true 
      },
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'email']
        }
      ],
      order: [['created_at', 'ASC']]
    });

    res.json(messages);
  } catch (error) {
    console.error('Error getting internal notes:', error);
    res.status(500).json({ error: 'Error al obtener las notas internas' });
  }
};

// Add internal note
exports.addInternalNote = async (req, res) => {
  try {
    const { ticket_id } = req.params;
    const { message } = req.body;
    const user_id = req.user?.id || 1;

    // Verify ticket exists
    const ticket = await Ticket.findByPk(ticket_id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket no encontrado' });
    }

    const internalNote = await TicketMessage.create({
      ticket_id,
      user_id,
      message,
      message_type: 'internal_note',
      is_internal: true
    });

    const noteWithRelations = await TicketMessage.findByPk(internalNote.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'email']
        }
      ]
    });

    res.status(201).json(noteWithRelations);
  } catch (error) {
    console.error('Error adding internal note:', error);
    res.status(500).json({ error: 'Error al agregar nota interna' });
  }
};
