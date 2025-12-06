/**
 * Script to verify that migrations were applied correctly
 */

const { Client } = require('pg');

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
    console.log('✅ Connected to database\n');
    
    // Check sequence column in plan_phases
    console.log('📊 Checking plan_phases table...');
    const planPhasesCheck = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'plan_phases' AND column_name = 'sequence'
    `);
    
    if (planPhasesCheck.rows.length > 0) {
      console.log('✅ Column "sequence" found in plan_phases:');
      console.log('   Type:', planPhasesCheck.rows[0].data_type);
      console.log('   Nullable:', planPhasesCheck.rows[0].is_nullable);
      console.log('   Default:', planPhasesCheck.rows[0].column_default || 'NULL');
    } else {
      console.log('❌ Column "sequence" NOT found in plan_phases');
    }
    
    // Check indexes for sequence
    const sequenceIndexes = await client.query(`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE tablename = 'plan_phases' AND indexname LIKE '%sequence%'
    `);
    
    if (sequenceIndexes.rows.length > 0) {
      console.log('\n✅ Indexes for sequence column:');
      sequenceIndexes.rows.forEach(idx => {
        console.log(`   - ${idx.indexname}`);
      });
    }
    
    // Check isDefault column in phases
    console.log('\n📊 Checking phases table...');
    const phasesCheck = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'phases' AND column_name = 'isDefault'
    `);
    
    if (phasesCheck.rows.length > 0) {
      console.log('✅ Column "isDefault" found in phases:');
      console.log('   Type:', phasesCheck.rows[0].data_type);
      console.log('   Nullable:', phasesCheck.rows[0].is_nullable);
      console.log('   Default:', phasesCheck.rows[0].column_default || 'NULL');
    } else {
      console.log('❌ Column "isDefault" NOT found in phases');
    }
    
    // Check indexes for isDefault
    const isDefaultIndexes = await client.query(`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE tablename = 'phases' AND indexname LIKE '%isDefault%'
    `);
    
    if (isDefaultIndexes.rows.length > 0) {
      console.log('\n✅ Indexes for isDefault column:');
      isDefaultIndexes.rows.forEach(idx => {
        console.log(`   - ${idx.indexname}`);
      });
    }
    
    // Count existing phases
    const phasesCount = await client.query('SELECT COUNT(*) as count FROM phases');
    console.log(`\n📈 Total phases in database: ${phasesCount.rows[0].count}`);
    
    // Count phases with isDefault = true
    const defaultPhasesCount = await client.query('SELECT COUNT(*) as count FROM phases WHERE "isDefault" = true');
    console.log(`📈 Phases marked as default: ${defaultPhasesCount.rows[0].count}`);
    
    // Count plan phases with sequence
    const planPhasesWithSequence = await client.query('SELECT COUNT(*) as count FROM plan_phases WHERE sequence IS NOT NULL');
    console.log(`📈 Plan phases with sequence set: ${planPhasesWithSequence.rows[0].count}`);
    
    console.log('\n✅ Verification completed!');
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    console.error('   Stack:', error.stack);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 Database connection closed');
  }
}

main();

