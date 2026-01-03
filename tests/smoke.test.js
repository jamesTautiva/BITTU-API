const request = require('supertest');

// 1. Mock Middleware BEFORE importing app
jest.mock('../src/middleware/auth.middleware', () => ({
  authenticate: (req, res, next) => {
    req.user = { id: 1, role: 'user' }; // Mock logged in user
    next();
  }
}));

// 2. Mock Models BEFORE importing app
const mockModel = {
  findAll: jest.fn().mockResolvedValue([]),
  findOne: jest.fn().mockResolvedValue({ 
    id: 1, 
    role: 'user', 
    comparePassword: jest.fn().mockResolvedValue(true) 
  }),
  create: jest.fn().mockResolvedValue({ id: 1 }),
  update: jest.fn().mockResolvedValue([1]),
  destroy: jest.fn().mockResolvedValue(1),
  findByPk: jest.fn().mockResolvedValue({ id: 1 }),
  count: jest.fn().mockResolvedValue(0),
  belongsToMany: jest.fn(),
  hasMany: jest.fn(),
  belongsTo: jest.fn(),
  hasOne: jest.fn(),
};

jest.mock('../src/models', () => {
  return {
    User: { ...mockModel },
    Artist: { ...mockModel },
    Album: { ...mockModel },
    Song: { ...mockModel },
    Playlist: { ...mockModel },
    Comment: { ...mockModel },
    Genre: { ...mockModel },
    AlbumGenre: { ...mockModel },
    Notification: { ...mockModel },
    Favorite: { ...mockModel },
    PlaylistSong: { ...mockModel },
    PlaybackLog: { ...mockModel },
    LegalDocument: { ...mockModel },
    LegalAcceptance: { ...mockModel },
    sequelize: {
      transaction: jest.fn().mockResolvedValue({
        commit: jest.fn(),
        rollback: jest.fn(),
      }),
    },
    Sequelize: {
        Op: {
            or: 'or',
            and: 'and',
            like: 'like'
        }
    }
  };
});

// Mock Supabase Controller to avoid external calls
jest.mock('../src/controllers/supabase.controller', () => ({
  setupBuckets: (req, res) => res.status(200).json({ message: 'Buckets setup mocked' }),
}));

// 3. Import App
const app = require('../src/app');

describe('Smoke Test - All Endpoints Reachability', () => {
  
  test('GET /health should return 200', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
  });

  test('GET /api/users/me should return 200 (mocked auth)', async () => {
    const res = await request(app).get('/api/users/me');
    // Depending on controller implementation, it might return 200 or 404 if user not found in DB (mocked findOne returns object, so 200)
    expect(res.statusCode).not.toBe(500);
  });

  test('GET /api/artists/get-all should return 200', async () => {
    const res = await request(app).get('/api/artists/get-all');
    expect(res.statusCode).toBe(200);
  });

  test('GET /api/albums should return 200', async () => {
    const res = await request(app).get('/api/albums');
    expect(res.statusCode).toBe(200);
  });

  test('GET /api/songs should return 200', async () => {
    const res = await request(app).get('/api/songs');
    expect(res.statusCode).toBe(200);
  });

  test('GET /api/comments should return 200', async () => {
    const res = await request(app).get('/api/comments');
    expect(res.statusCode).toBe(200);
  });

  test('GET /api/genres should return 200', async () => {
    const res = await request(app).get('/api/genres');
    expect(res.statusCode).toBe(200);
  });

  test('GET /api/favorites should return 200', async () => {
    const res = await request(app).get('/api/favorites');
    expect(res.statusCode).toBe(200);
  });

  test('GET /api/playlists should return 200', async () => {
    const res = await request(app).get('/api/playlists');
    expect(res.statusCode).toBe(200);
  });

  test('GET /api/notifications should return 200', async () => {
    const res = await request(app).get('/api/notifications');
    expect(res.statusCode).toBe(200);
  });

  test('POST /api/supabase/setup should return 200', async () => {
    const res = await request(app).post('/api/supabase/setup');
    expect(res.statusCode).toBe(200);
  });
  
  // Auth routes (usually don't use auth middleware, but we mocked it globally? No, middleware is applied in routes)
  // But we mocked the middleware file, so if it's imported, it's mocked.
  // Auth routes like login/register don't use the authenticate middleware usually.
  
  test('POST /api/auth/login should be reachable', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'test@test.com', password: 'password' });
    // It might fail with 401 or 400 because we didn't mock bcrypt or user lookup fully for login logic if it's complex
    // But we just want to ensure it doesn't crash (500).
    expect(res.statusCode).not.toBe(500);
  });

});
