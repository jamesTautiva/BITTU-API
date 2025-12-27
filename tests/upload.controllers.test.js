const userController = require('../src/controllers/user.controller');
const artistController = require('../src/controllers/artist.controller');
const albumController = require('../src/controllers/album.controller');
const songController = require('../src/controllers/song.controller');

const { uploadFile } = require('../src/utils/supabaseClient');
const { User, Artist, Album, Song } = require('../src/models');

jest.mock('../src/utils/supabaseClient', () => ({
  uploadFile: jest.fn()
}));

describe('Upload controllers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function mockRes() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  }

  test('uploadAvatar stores URL and returns it', async () => {
    const mockUser = { id: 1, avatar_url: null, save: jest.fn().mockResolvedValue() };
    jest.spyOn(User, 'findByPk').mockResolvedValue(mockUser);
    uploadFile.mockResolvedValue('https://supabase/public/avatars/avatar.png');

    const req = { user: { id: 1 }, file: { buffer: Buffer.from('a'), originalname: 'a.png', mimetype: 'image/png' } };
    const res = mockRes();

    await userController.uploadAvatar(req, res);

    expect(uploadFile).toHaveBeenCalledWith('avatars', expect.stringContaining('avatars/'), req.file.buffer, 'image/png');
    expect(mockUser.avatar_url).toBe('https://supabase/public/avatars/avatar.png');
    expect(mockUser.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ url: 'https://supabase/public/avatars/avatar.png' }));
  });

  test('uploadImage for artist stores URL and returns it', async () => {
    const mockArtist = { id: 2, image_url: null, save: jest.fn().mockResolvedValue() };
    jest.spyOn(Artist, 'findByPk').mockResolvedValue(mockArtist);
    uploadFile.mockResolvedValue('https://supabase/public/artists/img.png');

    const req = { params: { id: '2' }, file: { buffer: Buffer.from('b'), originalname: 'b.jpg', mimetype: 'image/jpeg' } };
    const res = mockRes();

    await artistController.uploadImage(req, res);

    expect(uploadFile).toHaveBeenCalledWith('artists', expect.stringContaining('artists/'), req.file.buffer, 'image/jpeg');
    expect(mockArtist.image_url).toBe('https://supabase/public/artists/img.png');
    expect(mockArtist.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ url: 'https://supabase/public/artists/img.png' }));
  });

  test('uploadCover for album stores URL and returns it', async () => {
    const mockAlbum = { id: 3, cover_url: null, save: jest.fn().mockResolvedValue() };
    jest.spyOn(Album, 'findByPk').mockResolvedValue(mockAlbum);
    uploadFile.mockResolvedValue('https://supabase/public/albums/cover.png');

    const req = { params: { id: '3' }, file: { buffer: Buffer.from('c'), originalname: 'c.png', mimetype: 'image/png' } };
    const res = mockRes();

    await albumController.uploadCover(req, res);

    expect(uploadFile).toHaveBeenCalledWith('albums', expect.stringContaining('albums/'), req.file.buffer, 'image/png');
    expect(mockAlbum.cover_url).toBe('https://supabase/public/albums/cover.png');
    expect(mockAlbum.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ url: 'https://supabase/public/albums/cover.png' }));
  });

  test('uploadAudio for song stores URL and returns it', async () => {
    const mockSong = { id: 4, audio_url: null, save: jest.fn().mockResolvedValue() };
    jest.spyOn(Song, 'findByPk').mockResolvedValue(mockSong);
    uploadFile.mockResolvedValue('https://supabase/public/songs/audio.mp3');

    const req = { params: { id: '4' }, file: { buffer: Buffer.from('d'), originalname: 'd.mp3', mimetype: 'audio/mpeg' } };
    const res = mockRes();

    await songController.uploadAudio(req, res);

    expect(uploadFile).toHaveBeenCalledWith('songs', expect.stringContaining('songs/'), req.file.buffer, 'audio/mpeg');
    expect(mockSong.audio_url).toBe('https://supabase/public/songs/audio.mp3');
    expect(mockSong.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ url: 'https://supabase/public/songs/audio.mp3' }));
  });
});
