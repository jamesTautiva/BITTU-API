const { validateIdParam, validateCreateAlbum, validateUpdateAlbum } = require('../src/middleware/validators/album.validator');

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('album.validator middleware', () => {
  test('validateIdParam rejects invalid id', () => {
    const req = { params: { id: 'abc' } };
    const res = mockRes();
    const next = jest.fn();
    validateIdParam(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  test('validateCreateAlbum rejects missing required fields', async () => {
    const req = { body: {} };
    const res = mockRes();
    const next = jest.fn();
    await validateCreateAlbum(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  test('validateCreateAlbum accepts valid input and normalizes genre_id', async () => {
    const req = { body: { artist_id: 1, title: 'Album', genre_id: ' 2 ' } };
    const res = mockRes();
    const next = jest.fn();
    await validateCreateAlbum(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.body.genre_id).toBe(2);
  });

  test('validateUpdateAlbum accepts undefined genre_id', () => {
    const req = { body: {} };
    const res = mockRes();
    const next = jest.fn();
    validateUpdateAlbum(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
