/**
 * Run the AddMetricValuesToPlanPhases migration directly using raw SQL
 * This bypasses TypeScript compilation issues with TypeORM CLI
 */
const { Client } = require('pg');

// Database configuration
const dbConfig = {
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  user: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'demo',
  database: process.env.DATABASE_NAME || 'rp-releases',
};

async function runMigration() {
  const client = new Client(dbConfig);
  
  try {
    await client.connect();
    console.log('✅ Connected to database');
    
    // Check if column already exists
    const checkResult = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'plan_phases' AND column_name = 'metricValues'
    `);
    
    if (checkResult.rows.length > 0) {
      console.log('⏭️  Column metricValues already exists in plan_phases table');
      return;
    }
    
    console.log('🔄 Adding metricValues column to plan_phases table...');
    
    // Add the column
    await client.query(`
      ALTER TABLE "plan_phases"
      ADD COLUMN "metricValues" jsonb NOT NULL DEFAULT '{}'
    `);
    
    console.log('✅ Migration completed successfully!');
    console.log('   Column metricValues added to plan_phases table');
    
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();

