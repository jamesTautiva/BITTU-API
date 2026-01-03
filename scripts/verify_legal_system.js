const { Sequelize, DataTypes } = require('sequelize');
const db = require('../src/models');
const { ensureContractAccepted } = require('../src/middleware/legalCheck');

async function verify() {
  try {
    console.log('🔄 Connecting to database...');
    await db.sequelize.authenticate();
    console.log('✅ Database connected.');

    // Sync specific models for testing (be careful not to drop existing data if possible, but for verification we might need to)
    // In a real env we rely on migrations. Let's assume migrations are run. 
    // But here I can't run migrations easily without 'sequelize-cli'.
    // I'll assume the user will run migrations. 
    // For this script to work, tables must exist.
    // I will try to sync just to be sure for this test session, or better, just rely on models.
    
    // 1. Create a Test User
    console.log('👤 Creating test user...');
    const testUser = await db.User.create({
      username: 'legal_test_user_' + Date.now(),
      email: 'legal_test_' + Date.now() + '@example.com',
      password: 'password123',
      role: 'artist'
    });
    console.log('✅ Test user created:', testUser.id);

    // 2. Create a Legal Document
    console.log('📜 Creating legal document...');
    const doc = await db.LegalDocument.create({
      type: 'artist_contract',
      version: '1.0',
      title: 'Standard Artist Contract',
      content: 'This is the contract content.',
      is_active: true
    });
    console.log('✅ Legal document created:', doc.id);

    // 3. Test Middleware Logic (Mocking req/res)
    console.log('🧪 Testing Middleware (Should Fail)...');
    const req = { user: { id: testUser.id } };
    const res = {
      status: (code) => ({
        json: (data) => {
          console.log(`   Response: ${code}`, data);
          return { code, data };
        }
      })
    };
    const next = () => console.log('   ✅ Next called (Unexpected!)');

    // Should fail because not accepted
    await ensureContractAccepted(req, res, next);

    // 4. Create Acceptance
    console.log('✍️ Creating acceptance...');
    await db.LegalAcceptance.create({
      userId: testUser.id,
      legalDocumentId: doc.id,
      ipAddress: '127.0.0.1',
      userAgent: 'TestScript/1.0'
    });
    console.log('✅ Acceptance created.');

    // 5. Test Middleware Logic (Should Succeed)
    console.log('🧪 Testing Middleware (Should Succeed)...');
    const nextSuccess = () => console.log('   ✅ Next called (Expected!)');
    await ensureContractAccepted(req, res, nextSuccess);

    // Cleanup
    console.log('🧹 Cleaning up...');
    await testUser.destroy(); // Should cascade delete acceptance
    await doc.destroy();
    console.log('✅ Cleanup complete.');

  } catch (error) {
    console.error('❌ Verification failed:', error);
  } finally {
    await db.sequelize.close();
  }
}

verify();
