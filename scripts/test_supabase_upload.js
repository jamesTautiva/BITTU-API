require('dotenv').config();
const { uploadFile } = require('../src/utils/supabaseClient');

(async function test() {
  try {
    const base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=';
    const buffer = Buffer.from(base64, 'base64');
    // Use the bucket name the user provided
    const bucket = 'BITU';
    const filename = `${bucket.toLowerCase()}/test_upload_node_${Date.now()}.png`;
    console.log('Uploading to Supabase to bucket', bucket, 'as', filename);
    const url = await uploadFile(bucket, filename, buffer, 'image/png');
    console.log('Upload succeeded. Public URL:', url);
  } catch (err) {
    console.error('Upload failed:', err.message || err);
    process.exitCode = 2;
  }
})();