const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

const publicKey = SUPABASE_KEY || SUPABASE_SERVICE_KEY;
if (!SUPABASE_URL || !publicKey) {
	console.warn('Supabase not configured. Set SUPABASE_URL and SUPABASE_KEY (or SUPABASE_SERVICE_KEY).');
}

const supabase = createClient(SUPABASE_URL, publicKey);
const supabaseAdmin = SUPABASE_SERVICE_KEY ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY) : supabase;

async function listBuckets() {
	if (!supabaseAdmin || !supabaseAdmin.storage) throw new Error('Supabase storage client not available');
	const { data, error } = await supabaseAdmin.storage.listBuckets();
	if (error) throw error;
	return data;
}

async function ensureBucket(bucketName, options = { public: true }) {
	if (!supabaseAdmin || !supabaseAdmin.storage) throw new Error('Supabase storage client not available');
	if (typeof bucketName === 'string') bucketName = bucketName.toLowerCase();
	const { data, error } = await supabaseAdmin.storage.createBucket(bucketName, options);
	if (error && !/already exists/i.test(error.message || '')) {
		throw error;
	}
	return data;
}

async function uploadFile(bucket, filePath, bufferOrStream, contentType) {
	if (!supabaseAdmin || !supabaseAdmin.storage) throw new Error('Supabase storage client not available');
	if (typeof bucket === 'string') bucket = bucket.toLowerCase();

	// ensure bucket exists (best-effort)
	try {
		await ensureBucket(bucket);
	} catch (err) {
		// proceed - upload will likely fail if bucket doesn't exist
		console.warn('ensureBucket warning:', err.message || err);
	}

	const { data, error } = await supabaseAdmin.storage.from(bucket).upload(filePath, bufferOrStream, {
		contentType,
		upsert: true,
	});
	if (error) throw error;

	const { data: urlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(filePath);
	return urlData.publicUrl;
}

module.exports = { supabase, supabaseAdmin, listBuckets, ensureBucket, uploadFile };