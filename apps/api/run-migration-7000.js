/**
 * Run migration 1764000007000-UpdatePlanReferencesTable directly
 */
const { Client } = require('pg');

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
    console.log('Connected to database');
    
    await client.query('BEGIN');
    
    // Add new columns
    await client.query(`
      ALTER TABLE plan_references 
      ADD COLUMN IF NOT EXISTS "planReferenceTypeId" UUID,
      ADD COLUMN IF NOT EXISTS "periodDay" DATE,
      ADD COLUMN IF NOT EXISTS "calendarDayId" UUID;
    `);
    
    // Create foreign key to plan_reference_type (only if doesn't exist)
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'fk_plan_references_reference_type'
        ) THEN
          ALTER TABLE plan_references 
          ADD CONSTRAINT fk_plan_references_reference_type 
          FOREIGN KEY ("planReferenceTypeId") REFERENCES plan_reference_type(id) ON DELETE RESTRICT;
        END IF;
      END $$;
    `);
    
    // Create foreign key to calendar_days (only if doesn't exist)
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'fk_plan_references_calendar_day'
        ) THEN
          ALTER TABLE plan_references 
          ADD CONSTRAINT fk_plan_references_calendar_day 
          FOREIGN KEY ("calendarDayId") REFERENCES calendar_days(id) ON DELETE CASCADE;
        END IF;
      END $$;
    `);
    
    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_plan_references_reference_type_id 
      ON plan_references("planReferenceTypeId");
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_plan_references_period_day 
      ON plan_references("periodDay");
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_plan_references_calendar_day_id 
      ON plan_references("calendarDayId");
    `);
    
    // Migrate existing data: Set default reference type to 'plan' for existing records
    const planTypeResult = await client.query(`
      SELECT id FROM plan_reference_type WHERE name = 'plan' LIMIT 1;
    `);
    
    if (planTypeResult.rows && planTypeResult.rows.length > 0) {
      const planTypeId = planTypeResult.rows[0].id;
      
      await client.query(`
        UPDATE plan_references 
        SET "planReferenceTypeId" = $1 
        WHERE "planReferenceTypeId" IS NULL;
      `, [planTypeId]);
    }
    
    // Make planReferenceTypeId NOT NULL after migration (only if there are no NULL values)
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM plan_references WHERE "planReferenceTypeId" IS NULL) THEN
          ALTER TABLE plan_references 
          ALTER COLUMN "planReferenceTypeId" SET NOT NULL;
        END IF;
      END $$;
    `);
    
    // Record migration as executed
    await client.query(
      'INSERT INTO migrations (name, timestamp) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
      ['1764000007000-UpdatePlanReferencesTable', 1764000007000]
    );
    
    await client.query('COMMIT');
    console.log('✅ Migration 1764000007000-UpdatePlanReferencesTable completed successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration error:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

runMigration();

