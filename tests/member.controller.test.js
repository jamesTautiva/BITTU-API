const request = require('supertest');
const app = require('../src/app');
const { Artist, Member } = require('../src/models');

describe('Member Controller', () => {
  let testArtist;
  let testMember;

  beforeAll(async () => {
    // Create a test artist
    testArtist = await Artist.create({
      user_id: 1,
      name: 'Test Artist',
      bio: 'Test bio',
      status: 'approved'
    });
  });

  afterAll(async () => {
    // Clean up test data
    if (testMember) {
      await Member.destroy({ where: { id: testMember.id } });
    }
    if (testArtist) {
      await Artist.destroy({ where: { id: testArtist.id } });
    }
  });

  describe('POST /api/members', () => {
    test('should create a new member', async () => {
      const memberData = {
        name: 'John Doe',
        role: 'Guitarist',
        artist_id: testArtist.id
      };

      const response = await request(app)
        .post('/api/members')
        .send(memberData)
        .expect(201);

      expect(response.body.name).toBe(memberData.name);
      expect(response.body.role).toBe(memberData.role);
      expect(response.body.artist_id).toBe(memberData.artist_id);
      
      testMember = response.body; // Save for cleanup
    });

    test('should return 404 when artist does not exist', async () => {
      const memberData = {
        name: 'Jane Doe',
        role: 'Vocalist',
        artist_id: 99999
      };

      const response = await request(app)
        .post('/api/members')
        .send(memberData)
        .expect(404);

      expect(response.body.error).toBe('Artista no encontrado');
    });
  });

  describe('GET /api/members', () => {
    test('should get all members', async () => {
      const response = await request(app)
        .get('/api/members')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/members/:id', () => {
    test('should get member by id', async () => {
      const response = await request(app)
        .get(`/api/members/${testMember.id}`)
        .expect(200);

      expect(response.body.id).toBe(testMember.id);
      expect(response.body.name).toBe(testMember.name);
      expect(response.body.Artist).toBeDefined();
    });

    test('should return 404 when member does not exist', async () => {
      const response = await request(app)
        .get('/api/members/99999')
        .expect(404);

      expect(response.body.error).toBe('Miembro no encontrado');
    });
  });

  describe('GET /api/members/artist/:artist_id', () => {
    test('should get members by artist', async () => {
      const response = await request(app)
        .get(`/api/members/artist/${testArtist.id}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].artist_id).toBe(testArtist.id);
    });

    test('should return 404 when artist does not exist', async () => {
      const response = await request(app)
        .get('/api/members/artist/99999')
        .expect(404);

      expect(response.body.error).toBe('Artista no encontrado');
    });
  });

  describe('PUT /api/members/:id', () => {
    test('should update member', async () => {
      const updateData = {
        name: 'John Smith',
        role: 'Lead Guitarist'
      };

      const response = await request(app)
        .put(`/api/members/${testMember.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe(updateData.name);
      expect(response.body.role).toBe(updateData.role);
    });

    test('should return 404 when member does not exist', async () => {
      const response = await request(app)
        .put('/api/members/99999')
        .send({ name: 'Test', role: 'Test' })
        .expect(404);

      expect(response.body.error).toBe('Miembro no encontrado');
    });
  });

  describe('DELETE /api/members/:id', () => {
    test('should delete member', async () => {
      // Create a member to delete
      const tempMember = await Member.create({
        name: 'Temp Member',
        role: 'Temp Role',
        artist_id: testArtist.id
      });

      await request(app)
        .delete(`/api/members/${tempMember.id}`)
        .expect(200);

      // Verify member is deleted
      const deletedMember = await Member.findByPk(tempMember.id);
      expect(deletedMember).toBeNull();
    });

    test('should return 404 when member does not exist', async () => {
      const response = await request(app)
        .delete('/api/members/99999')
        .expect(404);

      expect(response.body.error).toBe('Miembro no encontrado');
    });
  });
});
