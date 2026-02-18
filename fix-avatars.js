const express = require('express');
const { User } = require('./src/models');
const path = require('path');
const fs = require('fs');
const { uploadFile } = require('./src/utils/supabaseClient');

async function fixUserAvatars() {
    try {
        console.log('🔍 Buscando usuarios con avatares locales...');
        
        // Find users with local avatar URLs
        const usersWithLocalAvatars = await User.findAll({
            where: {
                avatar_url: {
                    [require('sequelize').Op.like]: '/uploads/%'
                }
            }
        });

        console.log(`📊 Found ${usersWithLocalAvatars.length} users with local avatars`);

        for (const user of usersWithLocalAvatars) {
            console.log(`👤 Processing user: ${user.username} (ID: ${user.id})`);
            
            // Check if file exists locally
            const filename = path.basename(user.avatar_url);
            const filePath = path.join(__dirname, 'src/uploads', filename);
            
            if (fs.existsSync(filePath)) {
                console.log(`✅ File exists: ${filename}`);
                
                // Upload to Supabase
                try {
                    const fileBuffer = fs.readFileSync(filePath);
                    const supabaseUrl = await uploadFile('avatars', filename, fileBuffer, 'image/jpeg');
                    
                    // Update user record
                    user.avatar_url = supabaseUrl;
                    await user.save();
                    
                    console.log(`☁️  Uploaded to Supabase: ${supabaseUrl}`);
                } catch (uploadError) {
                    console.error(`❌ Upload failed for ${user.username}:`, uploadError.message);
                    
                    // Set to null if upload fails
                    user.avatar_url = null;
                    await user.save();
                    console.log(`🔄 Set avatar to null for user ${user.username}`);
                }
            } else {
                console.log(`❌ File not found: ${filename}`);
                
                // Set to null since file doesn't exist
                user.avatar_url = null;
                await user.save();
                console.log(`🔄 Set avatar to null for user ${user.username}`);
            }
        }

        console.log('✅ Avatar fix completed!');
        
    } catch (error) {
        console.error('❌ Error fixing avatars:', error);
    }
}

// Run if called directly
if (require.main === module) {
    fixUserAvatars().then(() => process.exit(0));
}

module.exports = { fixUserAvatars };
