#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🦕 Setting up Dino Nutrition App...\n');

// Check if .env already exists
if (fs.existsSync('.env')) {
  console.log('✅ .env file already exists');
} else {
  // Copy .env.example to .env
  try {
    fs.copyFileSync('.env.example', '.env');
    console.log('✅ Created .env file from template');
  } catch (error) {
    console.error('❌ Error creating .env file:', error.message);
    process.exit(1);
  }
}

console.log('\n📝 Next steps:');
console.log('1. Open .env file and add your API keys:');
console.log('   - Supabase URL and ANON_KEY (from https://supabase.com/dashboard)');
console.log('   - Calorie Mama API key (from https://dev.caloriemama.ai/)');
console.log('\n2. Install dependencies:');
console.log('   npm install --legacy-peer-deps');
console.log('\n3. For iOS:');
console.log('   cd ios && pod install && cd ..');
console.log('\n4. Run the app:');
console.log('   npx react-native run-ios (or run-android)');
console.log('\n🎉 Happy coding!');