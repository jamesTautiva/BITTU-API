const request = require('supertest');
const app = require('../src/app');
const { TicketMessage, Ticket, User, TicketCategory } = require('../src/models');

describe('Ticket Message Controller', () => {
  let testUser;
  let testCategory;
  let testTicket;
  let testMessage;

  beforeAll(async () => {
    // Create test user
    testUser = await User.create({
      name: 'Test User',
      email: 'testmsg@example.com',
      password: 'hashedpassword'
    });

    // Get test category
    testCategory = await TicketCategory.findOne({ where: { name: 'Technical Support' } });

    // Create test ticket
    testTicket = await Ticket.create({
      user_id: testUser.id,
      title: 'Test Ticket for Messages',
      description: 'Test description',
      category_id: testCategory.id
    });
  });

  afterAll(async () => {
    // Clean up test data
    if (testMessage) {
      await TicketMessage.destroy({ where: { id: testMessage.id } });
    }
    if (testTicket) {
      await Ticket.destroy({ where: { id: testTicket.id } });
    }
    if (testUser) {
      await User.destroy({ where: { id: testUser.id } });
    }
  });

  describe('POST /api/tickets/:ticket_id/messages', () => {
    test('should create a new message', async () => {
      const messageData = {
        message: 'This is a test message',
        message_type: 'text',
        is_internal: false
      };

      const response = await request(app)
        .post(`/api/tickets/${testTicket.id}/messages`)
        .send(messageData)
        .expect(201);

      expect(response.body.message).toBe(messageData.message);
      expect(response.body.message_type).toBe(messageData.message_type);
      expect(response.body.is_internal).toBe(messageData.is_internal);
      expect(response.body.ticket_id).toBe(testTicket.id);
      expect(response.body.User).toBeDefined();
      
      testMessage = response.body; // Save for cleanup
    });

    test('should return 404 when ticket does not exist', async () => {
      const messageData = {
        message: 'Test message'
      };

      const response = await request(app)
        .post('/api/tickets/99999/messages')
        .send(messageData)
        .expect(404);

      expect(response.body.error).toBe('Ticket no encontrado');
    });
  });

  describe('GET /api/tickets/:ticket_id/messages', () => {
    test('should get all messages for a ticket', async () => {
      const response = await request(app)
        .get(`/api/tickets/${testTicket.id}/messages`)
        .expect(200);

      expect(response.body.messages).toBeDefined();
      expect(response.body.pagination).toBeDefined();
      expect(Array.isArray(response.body.messages)).toBe(true);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(50);
    });

    test('should exclude internal messages by default', async () => {
      // Create internal message
      await TicketMessage.create({
        ticket_id: testTicket.id,
        user_id: testUser.id,
        message: 'Internal note',
        message_type: 'internal_note',
        is_internal: true
      });

      const response = await request(app)
        .get(`/api/tickets/${testTicket.id}/messages`)
        .expect(200);

      response.body.messages.forEach(message => {
        expect(message.is_internal).toBe(false);
      });
    });

    test('should include internal messages when requested', async () => {
      const response = await request(app)
        .get(`/api/tickets/${testTicket.id}/messages?include_internal=true`)
        .expect(200);

      const hasInternal = response.body.messages.some(msg => msg.is_internal === true);
      expect(hasInternal).toBe(true);
    });
  });

  describe('PUT /api/ticket-messages/:id', () => {
    test('should update a message', async () => {
      const updateData = {
        message: 'Updated message content'
      };

      const response = await request(app)
        .put(`/api/ticket-messages/${testMessage.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.message).toBe(updateData.message);
      expect(response.body.is_edited).toBe(true);
      expect(response.body.edited_at).toBeDefined();
    });

    test('should return 404 when message does not exist', async () => {
      const response = await request(app)
        .put('/api/ticket-messages/99999')
        .send({ message: 'Test' })
        .expect(404);

      expect(response.body.error).toBe('Mensaje no encontrado');
    });
  });

  describe('DELETE /api/ticket-messages/:id', () => {
    test('should delete a message', async () => {
      // Create a message to delete
      const tempMessage = await TicketMessage.create({
        ticket_id: testTicket.id,
        user_id: testUser.id,
        message: 'Message to delete'
      });

      await request(app)
        .delete(`/api/ticket-messages/${tempMessage.id}`)
        .expect(200);

      // Verify message is deleted
      const deletedMessage = await TicketMessage.findByPk(tempMessage.id);
      expect(deletedMessage).toBeNull();
    });

    test('should return 404 when message does not exist', async () => {
      const response = await request(app)
        .delete('/api/ticket-messages/99999')
        .expect(404);

      expect(response.body.error).toBe('Mensaje no encontrado');
    });
  });

  describe('POST /api/tickets/:ticket_id/messages/mark-read', () => {
    test('should mark messages as read', async () => {
      const messageIds = [testMessage.id];

      const response = await request(app)
        .post(`/api/tickets/${testTicket.id}/messages/mark-read`)
        .send({ message_ids: messageIds })
        .expect(200);

      expect(response.body.message).toBe('Mensajes marcados como leídos');
      expect(response.body.count).toBe(messageIds.length);
    });

    test('should return 400 when message_ids is not provided', async () => {
      const response = await request(app)
        .post(`/api/tickets/${testTicket.id}/messages/mark-read`)
        .send({})
        .expect(400);

      expect(response.body.error).toBe('Se requiere un array de IDs de mensajes');
    });
  });

  describe('GET /api/tickets/:ticket_id/internal-notes', () => {
    test('should get internal notes for a ticket', async () => {
      // Create internal note
      await TicketMessage.create({
        ticket_id: testTicket.id,
        user_id: testUser.id,
        message: 'Internal note for testing',
        message_type: 'internal_note',
        is_internal: true
      });

      const response = await request(app)
        .get(`/api/tickets/${testTicket.id}/internal-notes`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach(note => {
        expect(note.is_internal).toBe(true);
        expect(note.message_type).toBe('internal_note');
        expect(note.User).toBeDefined();
      });
    });
  });

  describe('POST /api/tickets/:ticket_id/internal-notes', () => {
    test('should add internal note', async () => {
      const noteData = {
        message: 'This is an internal note'
      };

      const response = await request(app)
        .post(`/api/tickets/${testTicket.id}/internal-notes`)
        .send(noteData)
        .expect(201);

      expect(response.body.message).toBe(noteData.message);
      expect(response.body.message_type).toBe('internal_note');
      expect(response.body.is_internal).toBe(true);
      expect(response.body.User).toBeDefined();
    });

    test('should return 404 when ticket does not exist', async () => {
      const response = await request(app)
        .post('/api/tickets/99999/internal-notes')
        .send({ message: 'Test note' })
        .expect(404);

      expect(response.body.error).toBe('Ticket no encontrado');
    });
  });
});
