const { validateIdParam, validateCreateGenre, validateUpdateGenre } = require('../src/middleware/validators/genre.validator');

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('genre.validator middleware', () => {
  test('validateIdParam rejects invalid id', () => {
    const req = { params: { id: 'abc' } };
    const res = mockRes();
    const next = jest.fn();
    validateIdParam(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  test('validateIdParam accepts valid id', () => {
    const req = { params: { id: '42' } };
    const res = mockRes();
    const next = jest.fn();
    validateIdParam(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.params.id).toBe(42);
  });

  test('validateCreateGenre rejects missing or bad name', () => {
    const req = { body: {} };
    const res = mockRes();
    const next = jest.fn();
    validateCreateGenre(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  test('validateCreateGenre accepts valid name and trims', () => {
    const req = { body: { name: '  Rock  ' } };
    const res = mockRes();
    const next = jest.fn();
    validateCreateGenre(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.body.name).toBe('Rock');
  });

  test('validateUpdateGenre allows undefined name (no-op)', () => {
    const req = { body: {} };
    const res = mockRes();
    const next = jest.fn();
    validateUpdateGenre(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('validateUpdateGenre rejects empty name', () => {
    const req = { body: { name: '   ' } };
    const res = mockRes();
    const next = jest.fn();
    validateUpdateGenre(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });
});
