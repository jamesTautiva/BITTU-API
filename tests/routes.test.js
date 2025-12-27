const path = require('path');

function getRoutes(router) {
  if (!router || !router.stack) return [];
  const routes = [];
  router.stack.forEach((layer) => {
    if (layer.route && layer.route.path) {
      const path = layer.route.path;
      const methods = Object.keys(layer.route.methods).filter((m) => layer.route.methods[m]).map(m => m.toUpperCase());
      routes.push({ path, methods });
    } else if (layer.name === 'router' && layer.handle && layer.handle.stack) {
      // nested router: dive in
      layer.handle.stack.forEach((l) => {
        if (l.route && l.route.path) {
          const p = l.route.path;
          const methods = Object.keys(l.route.methods).filter((m) => l.route.methods[m]).map(m => m.toUpperCase());
          routes.push({ path: p, methods });
        }
      });
    }
  });
  return routes;
}

describe('Route files structure', () => {
  test('auth.routes exports login and register POST routes', () => {
    const router = require('../src/routes/auth.routes');
    const routes = getRoutes(router);
    expect(routes).toEqual(expect.arrayContaining([
      expect.objectContaining({ path: '/login', methods: expect.arrayContaining(['POST']) }),
      expect.objectContaining({ path: '/register', methods: expect.arrayContaining(['POST']) }),
    ]));
  });

  test('user.routes has expected routes', () => {
    const router = require('../src/routes/user.routes');
    const routes = getRoutes(router);
    expect(routes).toEqual(expect.arrayContaining([
      expect.objectContaining({ path: '/me', methods: expect.arrayContaining(['GET']) }),
      expect.objectContaining({ path: '/me', methods: expect.arrayContaining(['PUT']) }),
      expect.objectContaining({ path: '/change-password', methods: expect.arrayContaining(['PUT']) }),
      expect.objectContaining({ path: '/me', methods: expect.arrayContaining(['DELETE']) }),
    ]));
  });

  test('artist.routes has basic CRUD and status routes', () => {
    const router = require('../src/routes/artist.routes');
    const routes = getRoutes(router);
    expect(routes).toEqual(expect.arrayContaining([
      expect.objectContaining({ path: '/create', methods: expect.arrayContaining(['POST']) }),
      expect.objectContaining({ path: '/get-all', methods: expect.arrayContaining(['GET']) }),
      expect.objectContaining({ path: '/get-artist-by-id/:id', methods: expect.arrayContaining(['GET']) }),
      expect.objectContaining({ path: '/update/:id', methods: expect.arrayContaining(['PUT']) }),
      expect.objectContaining({ path: '/delete/:id', methods: expect.arrayContaining(['DELETE']) }),
      expect.objectContaining({ path: '/user/:userId', methods: expect.arrayContaining(['GET']) }),
      expect.objectContaining({ path: '/approved', methods: expect.arrayContaining(['GET']) }),
    ]));
  });

  test('album.routes has CRUD routes', () => {
    const router = require('../src/routes/album.routes');
    const routes = getRoutes(router);
    expect(routes).toEqual(expect.arrayContaining([
      expect.objectContaining({ path: '/', methods: expect.arrayContaining(['GET']) }),
      expect.objectContaining({ path: '/:id', methods: expect.arrayContaining(['GET']) }),
      expect.objectContaining({ path: '/', methods: expect.arrayContaining(['POST']) }),
    ]));
  });

  test('song.routes has CRUD routes', () => {
    const router = require('../src/routes/song.routes');
    const routes = getRoutes(router);
    expect(routes).toEqual(expect.arrayContaining([
      expect.objectContaining({ path: '/', methods: expect.arrayContaining(['GET']) }),
      expect.objectContaining({ path: '/:id', methods: expect.arrayContaining(['GET']) }),
      expect.objectContaining({ path: '/', methods: expect.arrayContaining(['POST']) }),
    ]));
  });

  test('comment.routes has expected routes', () => {
    const router = require('../src/routes/comment.routes');
    const routes = getRoutes(router);
    expect(routes).toEqual(expect.arrayContaining([
      expect.objectContaining({ path: '/', methods: expect.arrayContaining(['GET']) }),
      expect.objectContaining({ path: '/:id', methods: expect.arrayContaining(['GET']) }),
      expect.objectContaining({ path: '/', methods: expect.arrayContaining(['POST']) }),
    ]));
  });

  test('genre.routes has expected routes', () => {
    const router = require('../src/routes/genre.routes');
    const routes = getRoutes(router);
    expect(routes).toEqual(expect.arrayContaining([
      expect.objectContaining({ path: '/', methods: expect.arrayContaining(['GET']) }),
      expect.objectContaining({ path: '/:id', methods: expect.arrayContaining(['GET']) }),
      expect.objectContaining({ path: '/', methods: expect.arrayContaining(['POST']) }),
    ]));
  });

  test('favorite.routes has expected routes', () => {
    const router = require('../src/routes/favorite.routes');
    const routes = getRoutes(router);
    expect(routes).toEqual(expect.arrayContaining([
      expect.objectContaining({ path: '/', methods: expect.arrayContaining(['GET']) }),
      expect.objectContaining({ path: '/', methods: expect.arrayContaining(['POST']) }),
      expect.objectContaining({ path: '/:id', methods: expect.arrayContaining(['DELETE']) }),
    ]));
  });

  test('playlist and playlist-song routes exist', () => {
    const p = require('../src/routes/playlist.routes');
    const ps = require('../src/routes/playlistSong.routes');
    const proutes = getRoutes(p);
    const psroutes = getRoutes(ps);
    expect(proutes).toEqual(expect.arrayContaining([
      expect.objectContaining({ path: '/', methods: expect.arrayContaining(['GET']) }),
      expect.objectContaining({ path: '/', methods: expect.arrayContaining(['POST']) }),
    ]));
    expect(psroutes).toEqual(expect.arrayContaining([
      expect.objectContaining({ path: '/:playlistId/songs', methods: expect.arrayContaining(['GET']) }),
      expect.objectContaining({ path: '/:playlistId/songs', methods: expect.arrayContaining(['POST']) }),
    ]));
  });

  test('notification and album-genre routes exist', () => {
    const n = require('../src/routes/notification.routes');
    const ag = require('../src/routes/albumGenre.routes');
    const nr = getRoutes(n);
    const agr = getRoutes(ag);
    expect(nr).toEqual(expect.arrayContaining([
      expect.objectContaining({ path: '/', methods: expect.arrayContaining(['GET']) }),
      expect.objectContaining({ path: '/', methods: expect.arrayContaining(['POST']) }),
    ]));
    expect(agr).toEqual(expect.arrayContaining([
      expect.objectContaining({ path: '/:albumId/genres', methods: expect.arrayContaining(['GET']) }),
      expect.objectContaining({ path: '/:albumId/genres', methods: expect.arrayContaining(['POST']) }),
    ]));
  });

    test('playback.routes has expected routes', () => {
    const router = require('../src/routes/playback.routes');
    const routes = getRoutes(router);
    expect(routes).toEqual(expect.arrayContaining([
      expect.objectContaining({ path: '/', methods: expect.arrayContaining(['POST']) }),
      expect.objectContaining({ path: '/user/:userId', methods: expect.arrayContaining(['GET']) }),
    ]));
  });  

});
