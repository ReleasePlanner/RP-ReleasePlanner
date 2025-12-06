/**
 * Script to run sequence and isDefault migrations
 * - Adds sequence column to plan_phases table
 * - Adds isDefault column to phases table
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
    
    // Migration 1: Add sequence to plan_phases
    console.log('\n📄 Executing migration: AddSequenceToPlanPhases');
    const sequenceSqlFile = path.join(__dirname, 'add-sequence-to-plan-phases-migration.sql');
    const sequenceSql = fs.readFileSync(sequenceSqlFile, 'utf8');
    await client.query(sequenceSql);
    console.log('✅ Sequence migration completed successfully!');
    
    // Migration 2: Add isDefault to phases
    console.log('\n📄 Executing migration: AddIsDefaultToPhases');
    const isDefaultSqlFile = path.join(__dirname, 'add-isDefault-to-phases-migration.sql');
    const isDefaultSql = fs.readFileSync(isDefaultSqlFile, 'utf8');
    await client.query(isDefaultSql);
    console.log('✅ isDefault migration completed successfully!');
    
    console.log('\n🎉 All migrations completed successfully!');
    
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

