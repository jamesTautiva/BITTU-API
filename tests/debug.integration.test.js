const http = require('http');
const app = require('../src/app');

function httpRequest({ method = 'GET', path = '/', port, headers = {}, body } = {}) {
  return new Promise((resolve, reject) => {
    const opts = { method, port, path, headers };
    const req = http.request(opts, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        let parsed = null;
        try { parsed = data ? JSON.parse(data) : null; } catch (e) { parsed = data; }
        resolve({ status: res.statusCode, headers: res.headers, body: parsed });
      });
    });
    req.on('error', reject);
    if (body) req.write(typeof body === 'string' ? body : JSON.stringify(body));
    req.end();
  });
}

describe('Debug endpoints integration', () => {
  let server;
  let port;

  beforeAll((done) => {
    server = app.listen(0, () => {
      port = server.address().port;
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  test('close-and-query returns connection-manager-closed error', async () => {
    const res = await httpRequest({ method: 'POST', path: '/api/debug/close-and-query', port });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toMatch(/ConnectionManager|getConnection|connection manager was closed/i);
  });

  test('server health remains OK after close-and-query', async () => {
    const res = await httpRequest({ method: 'GET', path: '/health', port });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });

  test('restart returns simulated restart message in test env', async () => {
    const res = await httpRequest({ method: 'POST', path: '/api/debug/restart', port });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/simulated restart|Server will exit/i);
  });
});
