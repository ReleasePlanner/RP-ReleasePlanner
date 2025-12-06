/**
 * Script to run sequence to phases migration
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const dbConfig = {
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  user: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'demo',
  database: process.env.DATABASE_NAME || 'rp-releases',
};

async function main() {
  const client = new Client(dbConfig);
  
  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected to database');
    
    console.log('\n📄 Executing migration: AddSequenceToPhases');
    const sqlFile = path.join(__dirname, 'add-sequence-to-phases-migration.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');
    await client.query(sql);
    console.log('✅ Sequence migration completed successfully!');
    
    console.log('\n🎉 Migration completed successfully!');
    
  } catch (error) {
    if (error.message.includes('already exists') || error.message.includes('duplicate')) {
      console.log('⚠️  Column or index already exists - migration may have been applied already');
      console.log('   Error details:', error.message);
    } else {
      console.error('❌ Migration failed:', error.message);
      console.error('   Stack:', error.stack);
      process.exit(1);
    }
  } finally {
    await client.end();
    console.log('\n🔌 Database connection closed');
  }
}

main();

