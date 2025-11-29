/**
 * Script para verificar y renombrar la tabla phase_reschedules a plan_phase_reschedules
 */

require('reflect-metadata');
const { DataSource } = require('typeorm');
const fs = require('fs');
const path = require('path');

const dbConfig = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'demo',
  database: process.env.DATABASE_NAME || 'rp-releases',
};

async function checkAndRename() {
  console.log('🔌 Conectando a la base de datos...');
  console.log(`   Host: ${dbConfig.host}`);
  console.log(`   Database: ${dbConfig.database}`);
  console.log('');

  const dataSource = new DataSource(dbConfig);

  try {
    await dataSource.initialize();
    console.log('✅ Conectado a la base de datos');
    console.log('');

    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      // Verificar qué tabla existe
      const tables = await queryRunner.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND (table_name = 'phase_reschedules' OR table_name = 'plan_phase_reschedules')
        ORDER BY table_name
      `);

      console.log('📊 Tablas encontradas:', tables.map(t => t.table_name));
      console.log('');

      const hasOldTable = tables.some(t => t.table_name === 'phase_reschedules');
      const hasNewTable = tables.some(t => t.table_name === 'plan_phase_reschedules');

      if (hasOldTable && !hasNewTable) {
        console.log('⚠️  La tabla phase_reschedules existe pero plan_phase_reschedules no.');
        console.log('🔄 Ejecutando migración para renombrar la tabla...');
        console.log('');

        // Verificar qué constraints e índices existen antes de renombrar
        const constraints = await queryRunner.query(`
          SELECT constraint_name 
          FROM information_schema.table_constraints 
          WHERE table_name = 'phase_reschedules' 
          AND constraint_type IN ('PRIMARY KEY', 'FOREIGN KEY')
        `);
        
        const indexes = await queryRunner.query(`
          SELECT indexname 
          FROM pg_indexes 
          WHERE tablename = 'phase_reschedules'
        `);

        console.log('📋 Constraints encontrados:', constraints.map(c => c.constraint_name));
        console.log('📋 Índices encontrados:', indexes.map(i => i.indexname));
        console.log('');

        await queryRunner.startTransaction();

        try {
          // Renombrar tabla primero
          await queryRunner.query(`ALTER TABLE "phase_reschedules" RENAME TO "plan_phase_reschedules"`);
          console.log('✅ Tabla renombrada: phase_reschedules -> plan_phase_reschedules');

          // Renombrar primary key si existe
          const pkConstraint = constraints.find(c => c.constraint_name === 'PK_phase_reschedules');
          if (pkConstraint) {
            await queryRunner.query(`ALTER TABLE "plan_phase_reschedules" RENAME CONSTRAINT "PK_phase_reschedules" TO "PK_plan_phase_reschedules"`);
            console.log('✅ Primary key renombrado');
          }

          // Renombrar índices si existen
          const indexRenames = [
            ['IDX_phase_reschedules_planPhaseId', 'IDX_plan_phase_reschedules_planPhaseId'],
            ['IDX_phase_reschedules_rescheduledAt', 'IDX_plan_phase_reschedules_rescheduledAt'],
            ['IDX_phase_reschedules_rescheduleTypeId', 'IDX_plan_phase_reschedules_rescheduleTypeId'],
            ['IDX_phase_reschedules_ownerId', 'IDX_plan_phase_reschedules_ownerId'],
          ];

          for (const [oldName, newName] of indexRenames) {
            const indexExists = indexes.some(i => i.indexname === oldName);
            if (indexExists) {
              await queryRunner.query(`ALTER INDEX "${oldName}" RENAME TO "${newName}"`);
              console.log(`✅ Índice renombrado: ${oldName} -> ${newName}`);
            }
          }

          // Renombrar foreign keys si existen
          const fkRenames = [
            ['FK_phase_reschedules_planPhase', 'FK_plan_phase_reschedules_planPhase'],
            ['FK_phase_reschedules_reschedule_type', 'FK_plan_phase_reschedules_reschedule_type'],
            ['FK_phase_reschedules_owner', 'FK_plan_phase_reschedules_owner'],
          ];

          for (const [oldName, newName] of fkRenames) {
            const fkExists = constraints.some(c => c.constraint_name === oldName);
            if (fkExists) {
              await queryRunner.query(`ALTER TABLE "plan_phase_reschedules" RENAME CONSTRAINT "${oldName}" TO "${newName}"`);
              console.log(`✅ Foreign key renombrado: ${oldName} -> ${newName}`);
            }
          }

          await queryRunner.commitTransaction();
          console.log('');
          console.log('✅ Migración completada exitosamente');
        } catch (error) {
          await queryRunner.rollbackTransaction();
          console.error('❌ Error durante la migración:', error.message);
          throw error;
        }
      } else if (hasNewTable) {
        console.log('✅ La tabla plan_phase_reschedules ya existe. No se requiere migración.');
      } else {
        console.log('⚠️  Ninguna de las tablas existe. Puede que necesites ejecutar la migración inicial.');
      }

      // Verificar reschedules para la fase específica
      console.log('');
      console.log('🔍 Verificando reschedules para la fase: cfa5519d-d87a-4eeb-ba30-ee3eef7e985d');
      
      const reschedules = await queryRunner.query(`
        SELECT COUNT(*) as count 
        FROM plan_phase_reschedules 
        WHERE "planPhaseId" = $1
      `, ['cfa5519d-d87a-4eeb-ba30-ee3eef7e985d']);

      console.log(`📊 Reschedules encontrados: ${reschedules[0].count}`);

      if (parseInt(reschedules[0].count) > 0) {
        const details = await queryRunner.query(`
          SELECT id, "rescheduledAt", "originalStartDate", "originalEndDate", "newStartDate", "newEndDate"
          FROM plan_phase_reschedules 
          WHERE "planPhaseId" = $1
          ORDER BY "rescheduledAt" DESC
        `, ['cfa5519d-d87a-4eeb-ba30-ee3eef7e985d']);

        console.log('');
        console.log('Detalles de reschedules:');
        details.forEach((r, i) => {
          console.log(`  ${i + 1}. ID: ${r.id}`);
          console.log(`     Fecha: ${r.rescheduledAt}`);
          console.log(`     Original: ${r.originalStartDate} - ${r.originalEndDate}`);
          console.log(`     Nuevo: ${r.newStartDate} - ${r.newEndDate}`);
        });
      }

    } catch (error) {
      console.error('❌ Error:', error.message);
      throw error;
    } finally {
      await queryRunner.release();
    }

  } catch (error) {
    console.error('❌ Error al conectar:', error.message);
    throw error;
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

checkAndRename()
  .then(() => {
    console.log('');
    console.log('✨ Script completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('');
    console.error('❌ Error fatal:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  });

