/**
 * Script to create a new admin user in the database
 * Usage: node scripts/create-admin-user.js
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log('\n🔐 Create New Admin User\n');
  
  try {
    const email = await question('Email: ');
    const password = await question('Password: ');
    const name = await question('Name (optional): ');
    
    if (!email || !password) {
      console.error('❌ Email and password are required!');
      process.exit(1);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('❌ Invalid email format!');
      process.exit(1);
    }

    console.log('\n📝 SQL to run in Supabase SQL Editor:\n');
    console.log('----------------------------------------');
    console.log(`INSERT INTO admin_users (email, password, name, role, is_active)`);
    console.log(`VALUES ('${email}', '${password}', ${name ? `'${name}'` : 'NULL'}, 'admin', true);`);
    console.log('----------------------------------------\n');

    console.log('⚠️  IMPORTANT:');
    console.log('1. Copy the SQL above');
    console.log('2. Go to Supabase Dashboard → SQL Editor');
    console.log('3. Paste and run the SQL');
    console.log('4. For production, implement password hashing!\n');

    console.log('✅ User details prepared successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

main();
