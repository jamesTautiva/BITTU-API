require('dotenv').config();
console.log('SUPABASE_URL set:', !!process.env.SUPABASE_URL);
console.log('SUPABASE_KEY set:', !!process.env.SUPABASE_KEY);
console.log('SUPABASE_SERVICE_KEY set:', !!process.env.SUPABASE_SERVICE_KEY);
if (process.env.SUPABASE_SERVICE_KEY) {
  console.log('Service key looks ok (starts with eyJ):', process.env.SUPABASE_SERVICE_KEY.startsWith('eyJ'));
}
