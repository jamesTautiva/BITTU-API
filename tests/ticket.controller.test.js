const request = require('supertest');
const app = require('../src/app');
const { Ticket, TicketCategory, User } = require('../src/models');

describe('Ticket Controller', () => {
  let testUser;
  let testCategory;
  let testTicket;

  beforeAll(async () => {
    // Create test user
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword'
    });

    // Test category should already exist from migration
    testCategory = await TicketCategory.findOne({ where: { name: 'Technical Support' } });
  });

  afterAll(async () => {
    // Clean up test data
    if (testTicket) {
      await Ticket.destroy({ where: { id: testTicket.id } });
    }
    if (testUser) {
      await User.destroy({ where: { id: testUser.id } });
    }
  });

  describe('POST /api/tickets', () => {
    test('should create a new ticket', async () => {
      const ticketData = {
        title: 'Test Ticket',
        description: 'This is a test ticket description',
        category_id: testCategory.id,
        priority: 'high'
      };

      const response = await request(app)
        .post('/api/tickets')
        .send(ticketData)
        .expect(201);

      expect(response.body.title).toBe(ticketData.title);
      expect(response.body.description).toBe(ticketData.description);
      expect(response.body.category_id).toBe(ticketData.category_id);
      expect(response.body.priority).toBe(ticketData.priority);
      expect(response.body.ticket_number).toMatch(/^TK-\d{8}-\d{4}$/);
      expect(response.body.status).toBe('open');
      expect(response.body.TicketCategory).toBeDefined();
      expect(response.body.creator).toBeDefined();
      
      testTicket = response.body; // Save for cleanup
    });

    test('should return 404 when category does not exist', async () => {
      const ticketData = {
        title: 'Test Ticket',
        description: 'This is a test ticket description',
        category_id: 99999
      };

      const response = await request(app)
        .post('/api/tickets')
        .send(ticketData)
        .expect(404);

      expect(response.body.error).toBe('Categoría no encontrada');
    });

    test('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/tickets')
        .send({})
        .expect(500);

      expect(response.body.error).toBe('Error al crear el ticket');
    });
  });

  describe('GET /api/tickets', () => {
    test('should get all tickets with pagination', async () => {
      const response = await request(app)
        .get('/api/tickets')
        .expect(200);

      expect(response.body.tickets).toBeDefined();
      expect(response.body.pagination).toBeDefined();
      expect(Array.isArray(response.body.tickets)).toBe(true);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(20);
    });

    test('should filter tickets by status', async () => {
      const response = await request(app)
        .get('/api/tickets?status=open')
        .expect(200);

      expect(Array.isArray(response.body.tickets)).toBe(true);
      response.body.tickets.forEach(ticket => {
        expect(ticket.status).toBe('open');
      });
    });

    test('should filter tickets by priority', async () => {
      const response = await request(app)
        .get('/api/tickets?priority=high')
        .expect(200);

      expect(Array.isArray(response.body.tickets)).toBe(true);
      response.body.tickets.forEach(ticket => {
        expect(ticket.priority).toBe('high');
      });
    });

    test('should search tickets', async () => {
      const response = await request(app)
        .get('/api/tickets?search=Test')
        .expect(200);

      expect(Array.isArray(response.body.tickets)).toBe(true);
    });
  });

  describe('GET /api/tickets/:id', () => {
    test('should get ticket by id with full relations', async () => {
      const response = await request(app)
        .get(`/api/tickets/${testTicket.id}`)
        .expect(200);

      expect(response.body.id).toBe(testTicket.id);
      expect(response.body.title).toBe(testTicket.title);
      expect(response.body.TicketCategory).toBeDefined();
      expect(response.body.creator).toBeDefined();
      expect(response.body.TicketMessages).toBeDefined();
    });

    test('should return 404 when ticket does not exist', async () => {
      const response = await request(app)
        .get('/api/tickets/99999')
        .expect(404);

      expect(response.body.error).toBe('Ticket no encontrado');
    });
  });

  describe('PUT /api/tickets/:id', () => {
    test('should update ticket', async () => {
      const updateData = {
        title: 'Updated Ticket Title',
        status: 'in_progress'
      };

      const response = await request(app)
        .put(`/api/tickets/${testTicket.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.title).toBe(updateData.title);
      expect(response.body.status).toBe(updateData.status);
    });

    test('should return 404 when ticket does not exist', async () => {
      const response = await request(app)
        .put('/api/tickets/99999')
        .send({ title: 'Test' })
        .expect(404);

      expect(response.body.error).toBe('Ticket no encontrado');
    });
  });

  describe('DELETE /api/tickets/:id', () => {
    test('should delete ticket', async () => {
      // Create a ticket to delete
      const tempTicket = await Ticket.create({
        user_id: testUser.id,
        title: 'Temp Ticket',
        description: 'Temp description',
        category_id: testCategory.id
      });

      await request(app)
        .delete(`/api/tickets/${tempTicket.id}`)
        .expect(200);

      // Verify ticket is deleted
      const deletedTicket = await Ticket.findByPk(tempTicket.id);
      expect(deletedTicket).toBeNull();
    });

    test('should return 404 when ticket does not exist', async () => {
      const response = await request(app)
        .delete('/api/tickets/99999')
        .expect(404);

      expect(response.body.error).toBe('Ticket no encontrado');
    });
  });

  describe('GET /api/tickets/categories', () => {
    test('should get all active categories', async () => {
      const response = await request(app)
        .get('/api/tickets/categories')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      response.body.forEach(category => {
        expect(category.is_active).toBe(true);
        expect(category.name).toBeDefined();
        expect(category.color).toBeDefined();
      });
    });
  });

  describe('GET /api/tickets/user/:userId', () => {
    test('should get user tickets', async () => {
      const response = await request(app)
        .get(`/api/tickets/user/${testUser.id}`)
        .expect(200);

      expect(response.body.tickets).toBeDefined();
      expect(response.body.pagination).toBeDefined();
      expect(Array.isArray(response.body.tickets)).toBe(true);
      
      response.body.tickets.forEach(ticket => {
        expect(ticket.user_id).toBe(testUser.id);
      });
    });
  });

  describe('GET /api/tickets/stats', () => {
    test('should get ticket statistics', async () => {
      const response = await request(app)
        .get('/api/tickets/stats')
        .expect(200);

      expect(response.body.open).toBeDefined();
      expect(response.body.in_progress).toBeDefined();
      expect(response.body.resolved).toBeDefined();
      expect(response.body.closed).toBeDefined();
      expect(response.body.urgent).toBeDefined();
      expect(response.body.high).toBeDefined();
      expect(response.body.last_30_days).toBeDefined();
      
      // All should be numbers
      Object.values(response.body).forEach(value => {
        expect(typeof value).toBe('number');
        expect(value).toBeGreaterThanOrEqual(0);
      });
    });
  });
});
