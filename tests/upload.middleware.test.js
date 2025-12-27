const { imageUpload, audioUpload } = require('../src/middleware/upload.middleware');

describe('upload.middleware factories', () => {
  test('imageUpload returns a middleware function', () => {
    const mw = imageUpload('file');
    expect(typeof mw).toBe('function');
  });

  test('audioUpload returns a middleware function', () => {
    const mw = audioUpload('file');
    expect(typeof mw).toBe('function');
  });
});
