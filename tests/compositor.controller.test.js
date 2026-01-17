const request = require('supertest');
const app = require('../src/app');
const { Song, Album, Artist, Compositor } = require('../src/models');

describe('Compositor Controller', () => {
  let testArtist;
  let testAlbum;
  let testSong;
  let testCompositor;

  beforeAll(async () => {
    // Create test data
    testArtist = await Artist.create({
      user_id: 1,
      name: 'Test Artist',
      bio: 'Test bio',
      status: 'approved'
    });

    testAlbum = await Album.create({
      artist_id: testArtist.id,
      title: 'Test Album',
      release_date: new Date(),
      genre_id: 1
    });

    testSong = await Song.create({
      album_id: testAlbum.id,
      title: 'Test Song',
      audio_url: 'http://example.com/audio.mp3'
    });
  });

  afterAll(async () => {
    // Clean up test data
    if (testCompositor) {
      await Compositor.destroy({ where: { id: testCompositor.id } });
    }
    if (testSong) {
      await Song.destroy({ where: { id: testSong.id } });
    }
    if (testAlbum) {
      await Album.destroy({ where: { id: testAlbum.id } });
    }
    if (testArtist) {
      await Artist.destroy({ where: { id: testArtist.id } });
    }
  });

  describe('POST /api/compositors', () => {
    test('should create a new compositor', async () => {
      const compositorData = {
        name: 'John Composer',
        song_id: testSong.id
      };

      const response = await request(app)
        .post('/api/compositors')
        .send(compositorData)
        .expect(201);

      expect(response.body.name).toBe(compositorData.name);
      expect(response.body.song_id).toBe(compositorData.song_id);
      
      testCompositor = response.body; // Save for cleanup
    });

    test('should return 404 when song does not exist', async () => {
      const compositorData = {
        name: 'Jane Composer',
        song_id: 99999
      };

      const response = await request(app)
        .post('/api/compositors')
        .send(compositorData)
        .expect(404);

      expect(response.body.error).toBe('Canción no encontrada');
    });
  });

  describe('GET /api/compositors', () => {
    test('should get all compositors', async () => {
      const response = await request(app)
        .get('/api/compositors')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/compositors/:id', () => {
    test('should get compositor by id', async () => {
      const response = await request(app)
        .get(`/api/compositors/${testCompositor.id}`)
        .expect(200);

      expect(response.body.id).toBe(testCompositor.id);
      expect(response.body.name).toBe(testCompositor.name);
      expect(response.body.Song).toBeDefined();
    });

    test('should return 404 when compositor does not exist', async () => {
      const response = await request(app)
        .get('/api/compositors/99999')
        .expect(404);

      expect(response.body.error).toBe('Compositor no encontrado');
    });
  });

  describe('GET /api/compositors/song/:song_id', () => {
    test('should get compositors by song', async () => {
      const response = await request(app)
        .get(`/api/compositors/song/${testSong.id}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].song_id).toBe(testSong.id);
    });

    test('should return 404 when song does not exist', async () => {
      const response = await request(app)
        .get('/api/compositors/song/99999')
        .expect(404);

      expect(response.body.error).toBe('Canción no encontrada');
    });
  });

  describe('PUT /api/compositors/:id', () => {
    test('should update compositor', async () => {
      const updateData = {
        name: 'John Smith Composer'
      };

      const response = await request(app)
        .put(`/api/compositors/${testCompositor.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe(updateData.name);
    });

    test('should return 404 when compositor does not exist', async () => {
      const response = await request(app)
        .put('/api/compositors/99999')
        .send({ name: 'Test' })
        .expect(404);

      expect(response.body.error).toBe('Compositor no encontrado');
    });
  });

  describe('DELETE /api/compositors/:id', () => {
    test('should delete compositor', async () => {
      // Create a compositor to delete
      const tempCompositor = await Compositor.create({
        name: 'Temp Compositor',
        song_id: testSong.id
      });

      await request(app)
        .delete(`/api/compositors/${tempCompositor.id}`)
        .expect(200);

      // Verify compositor is deleted
      const deletedCompositor = await Compositor.findByPk(tempCompositor.id);
      expect(deletedCompositor).toBeNull();
    });

    test('should return 404 when compositor does not exist', async () => {
      const response = await request(app)
        .delete('/api/compositors/99999')
        .expect(404);

      expect(response.body.error).toBe('Compositor no encontrado');
    });
  });
});
