const request = require('supertest');

// 1. Mock Middleware BEFORE importing app
jest.mock('../src/middleware/auth.middleware', () => ({
  authenticate: (req, res, next) => {
    req.user = { id: 1, role: 'user' }; // Mock logged in user
    next();
  }
}));

// 2. Mock Models BEFORE importing app
// We need to mock the entire models object that controllers use
const mockLegalDocument = {
  findOne: jest.fn()
};
const mockLegalAcceptance = {
  findOne: jest.fn()
};
const mockArtist = {
  create: jest.fn(),
  findOne: jest.fn()
};

jest.mock('../src/models', () => ({
  LegalDocument: mockLegalDocument,
  LegalAcceptance: mockLegalAcceptance,
  Artist: mockArtist,
  // Mock other models to avoid crashes if referenced
  User: {},
  Album: {},
  Song: {},
  Playlist: {},
  Comment: {},
  Genre: {},
  AlbumGenre: {},
  Notification: {},
  Favorite: {},
  PlaylistSong: {},
  PlaybackLog: {}
}));

// 3. Import App
const app = require('../src/app');

describe('Legal Acceptance Enforcement', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should BLOCK artist creation if no acceptance exists', async () => {
    // Setup: Active contract exists
    mockLegalDocument.findOne.mockResolvedValue({
      id: 100,
      type: 'artist_contract',
      version: '1.0',
      is_active: true
    });

    // Setup: User has NOT accepted
    mockLegalAcceptance.findOne.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/artists/create')
      .send({ name: 'Test Artist', bio: 'Bio' });

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBe('Legal Acceptance Required');
    expect(mockLegalAcceptance.findOne).toHaveBeenCalled();
  });

  test('should ALLOW artist creation if acceptance exists', async () => {
    // Setup: Active contract exists
    mockLegalDocument.findOne.mockResolvedValue({
      id: 100,
      type: 'artist_contract',
      version: '1.0',
      is_active: true
    });

    // Setup: User HAS accepted
    mockLegalAcceptance.findOne.mockResolvedValue({
      id: 50,
      userId: 1,
      legalDocumentId: 100
    });

    // Setup: Artist creation succeeds
    mockArtist.create.mockResolvedValue({
      id: 1,
      name: 'Test Artist',
      status: 'pending'
    });

    const res = await request(app)
      .post('/api/artists/create')
      .send({ name: 'Test Artist', bio: 'Bio', userId: 1 });

    expect(res.statusCode).toBe(201);
    expect(mockArtist.create).toHaveBeenCalled();
  });

  test('should ALLOW if no active contract exists (fallback)', async () => {
    // Setup: NO active contract
    mockLegalDocument.findOne.mockResolvedValue(null);

    // Setup: Artist creation succeeds
    mockArtist.create.mockResolvedValue({
      id: 1,
      name: 'Test Artist',
      status: 'pending'
    });

    const res = await request(app)
      .post('/api/artists/create')
      .send({ name: 'Test Artist', bio: 'Bio', userId: 1 });

    expect(res.statusCode).toBe(201);
  });
});
