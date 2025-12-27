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

(async () => {
  const server = app.listen(0, async () => {
    const port = server.address().port;
    console.log('Server listening on port', port);

    try {
      console.log('\n--> POST /api/debug/close-and-query');
      const res1 = await httpRequest({ method: 'POST', path: '/api/debug/close-and-query', port });
      console.log('Status:', res1.status);
      console.log('Body:', JSON.stringify(res1.body, null, 2));

      console.log('\n--> POST /api/debug/restart');
      const res2 = await httpRequest({ method: 'POST', path: '/api/debug/restart', port });
      console.log('Status:', res2.status);
      console.log('Body:', JSON.stringify(res2.body, null, 2));

    } catch (err) {
      console.error('Error while making requests:', err.message || err);
    } finally {
      server.close(() => process.exit(0));
    }
  });
})();
