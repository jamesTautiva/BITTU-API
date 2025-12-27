const BASE = process.env.BASE_URL || 'http://localhost:3000';

async function post(path, body, token) {
  const res = await fetch(BASE + path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(body)
  });
  const txt = await res.text();
  let json; try { json = JSON.parse(txt); } catch(e) { json = { raw: txt }; }
  return { status: res.status, body: json };
}

async function get(path, token) {
  const res = await fetch(BASE + path, {
    method: 'GET',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  const txt = await res.text();
  let json; try { json = JSON.parse(txt); } catch(e) { json = { raw: txt }; }
  return { status: res.status, body: json };
}

(async function run() {
  console.log(`Using BASE URL: ${BASE}`);

  try {
    // 1. Register artist user (use unique emails per run)
    console.log('\n1) Register artist user');
    const runSuffix = Date.now() + '-' + Math.floor(Math.random() * 10000);
    const artistEmail = `artist1_${runSuffix}@example.com`;
    const user2Email = `user2_${runSuffix}@example.com`;

    let r = await post('/api/auth/register', { username: 'artist1', email: artistEmail, password: 'password123' });
    console.log('status', r.status, 'body', r.body);
    let ARTIST_TOKEN = r.body && r.body.token;
    let ARTIST_USER_ID = r.body && r.body.user && r.body.user.id;

    // If registration returned 409 (exists), try login
    if (!ARTIST_TOKEN && r.status === 409) {
      console.log('Artist exists, logging in...');
      const l = await post('/api/auth/login', { email: artistEmail, password: 'password123' });
      console.log('login status', l.status, l.body);
      if (l.body && l.body.token) {
        ARTIST_TOKEN = l.body.token;
      }
      if (l.body && l.body.user && l.body.user.id) {
        ARTIST_USER_ID = l.body.user.id;
      }
    }

    if (!ARTIST_TOKEN) {
      console.warn('No ARTIST_TOKEN obtained; aborting flow. Set BASE to a running server and ensure auth endpoints work.');
      process.exit(1);
    }

    // 2) Create artist profile
    console.log('\n2) Create artist profile');
    r = await post('/api/artists/create', { name: 'Mi Arte', bio: 'Biografía', userId: ARTIST_USER_ID }, ARTIST_TOKEN);
    console.log('status', r.status, 'body', r.body);
    const ARTIST_ID = r.body && r.body.id;

    // 3) Create album
    console.log('\n3) Create album');
    r = await post('/api/albums', { artist_id: ARTIST_ID, title: 'Mi Álbum', cover_url: 'https://example.com/cover.jpg', release_date: '2025-12-26' }, ARTIST_TOKEN);
    console.log('status', r.status, 'body', r.body);
    const ALBUM_ID = r.body && r.body.id;

    // 4) Create a song
    console.log('\n4) Create song');
    r = await post('/api/songs', { album_id: ALBUM_ID, title: 'Canción 1', audio_url: 'https://example.com/audio1.mp3' }, ARTIST_TOKEN);
    console.log('status', r.status, 'body', r.body);
    const SONG_ID = r.body && r.body.id;

    // 5) Register second user (playlist owner) — use unique email
    console.log('\n5) Register normal user');
    r = await post('/api/auth/register', { username: 'user2', email: user2Email, password: 'password123' });
    console.log('status', r.status, 'body', r.body);
    let USER2_TOKEN = r.body && r.body.token;
    let USER2_ID = r.body && r.body.user && r.body.user.id;
    if (!USER2_TOKEN && r.status === 409) {
      console.log('User2 exists, logging in...');
      const l = await post('/api/auth/login', { email: user2Email, password: 'password123' });
      console.log('login status', l.status, l.body);
      USER2_TOKEN = l.body && l.body.token;
      if (l.body && l.body.user && l.body.user.id) {
        USER2_ID = l.body.user.id;
      }
    }
    if (!USER2_TOKEN) {
      console.warn('No USER2_TOKEN obtained; aborting.');
      process.exit(1);
    }

    // 6) Create playlist
    console.log('\n6) Create playlist');
    r = await post('/api/playlists', { name: 'Favoritas', description: 'Mis pistas' }, USER2_TOKEN);
    console.log('status', r.status, 'body', r.body);
    const PLAYLIST_ID = r.body && r.body.id;

    // 7) Add song to playlist
    console.log('\n7) Add song to playlist');
    r = await post(`/api/playlist-songs/${PLAYLIST_ID}/songs`, { song_id: SONG_ID }, USER2_TOKEN);
    console.log('status', r.status, 'body', r.body);

    // 8) Create playback log for USER2
    console.log('\n8) Create playback log');
    r = await post('/api/playback-logs', { song_id: SONG_ID, device_type: 'mobile', device_os: 'Android 13', device_model: 'Pixel 6', ip_address: '203.0.113.42' }, USER2_TOKEN);
    console.log('status', r.status, 'body', r.body);

    // 9) List playback logs for USER2
    console.log('\n9) List playback logs for user2');
    r = await get('/api/playback-logs', USER2_TOKEN);
    console.log('status', r.status, 'body', r.body);

    console.log('\nFlow finished successfully.');
  } catch (err) {
    console.error('Error during flow:', err);
    process.exit(1);
  }
})();
