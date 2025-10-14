#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('\n🚀 DS Audit App - Environment Setup\n');

const envPath = path.join(__dirname, '.env.local');
const envContent = 'NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1';

// Check if .env.local already exists
if (fs.existsSync(envPath)) {
  console.log('✅ .env.local file already exists');
  
  // Read and display current content
  const currentContent = fs.readFileSync(envPath, 'utf8');
  console.log('\n📄 Current configuration:');
  console.log(currentContent);
  console.log('');
  
  process.exit(0);
}

// Create .env.local file
try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file successfully!');
  console.log('\n📄 Configuration:');
  console.log(envContent);
  console.log('\n✨ You can now start the development server:');
  console.log('   pnpm dev\n');
} catch (error) {
  console.error('❌ Failed to create .env.local file:', error.message);
  console.log('\n📝 Please create .env.local manually with this content:');
  console.log(envContent);
  process.exit(1);
}
