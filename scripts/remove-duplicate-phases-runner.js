/**
 * Script para eliminar fases duplicadas usando TypeORM
 * Usa la configuración de ormconfig.ts
 */

require('reflect-metadata');
const { DataSource } = require('typeorm');
const path = require('path');

// Configuración de la base de datos desde variables de entorno (igual que ormconfig.ts)
const dbConfig = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'demo',
  database: process.env.DATABASE_NAME || 'rp-releases',
};

async function removeDuplicates() {
  console.log('🔌 Conectando a la base de datos...');
  console.log(`   Host: ${dbConfig.host}`);
  console.log(`   Port: ${dbConfig.port}`);
  console.log(`   Database: ${dbConfig.database}`);
  console.log(`   Username: ${dbConfig.username}`);
  console.log('');

  const dataSource = new DataSource(dbConfig);

  try {
    await dataSource.initialize();
    console.log('✅ Conectado a la base de datos');
    console.log('');

    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      // Iniciar transacción
      await queryRunner.startTransaction();
      console.log('🔄 Transacción iniciada');
      console.log('');

      // 1. Contar duplicados
      console.log('🔍 Buscando fases duplicadas...');
      const duplicateGroups = await queryRunner.query(`
        SELECT 
          pp."planId",
          p.name as plan_name,
          pp.name as phase_name,
          COUNT(*) as duplicate_count
        FROM plan_phases pp
        JOIN plans p ON pp."planId" = p.id
        GROUP BY pp."planId", pp.name, p.name
        HAVING COUNT(*) > 1
        ORDER BY duplicate_count DESC, p.name, pp.name
      `);

      const duplicateCount = duplicateGroups.length;
      console.log(`📊 Se encontraron ${duplicateCount} grupos de fases duplicadas`);
      
      if (duplicateCount === 0) {
        console.log('✅ No hay fases duplicadas. No se requiere acción.');
        await queryRunner.rollbackTransaction();
        return;
      }

      console.log('');
      console.log('Detalles de duplicados:');
      for (const group of duplicateGroups) {
        console.log(`   • Plan: "${group.plan_name}" - Fase: "${group.phase_name}" (${group.duplicate_count} duplicados)`);
      }
      console.log('');

      // 2. Obtener IDs de fases duplicadas (excluyendo la más reciente de cada grupo)
      const duplicateIds = await queryRunner.query(`
        SELECT id FROM (
          SELECT 
            id,
            ROW_NUMBER() OVER (
              PARTITION BY "planId", name 
              ORDER BY "createdAt" DESC, "updatedAt" DESC
            ) as rn
          FROM plan_phases
        ) sub
        WHERE rn > 1
      `);

      const duplicateIdsArray = duplicateIds.map(row => row.id);
      console.log(`📋 Se eliminarán ${duplicateIdsArray.length} fases duplicadas`);
      console.log('');

      if (duplicateIdsArray.length === 0) {
        console.log('✅ No hay fases para eliminar.');
        await queryRunner.rollbackTransaction();
        return;
      }

      // 3. Contar reschedules asociados
      const rescheduleResult = await queryRunner.query(`
        SELECT COUNT(*) as count
        FROM plan_phase_reschedules
        WHERE "planPhaseId" = ANY($1)
      `, [duplicateIdsArray]);

      const rescheduleCount = parseInt(rescheduleResult[0]?.count || '0');
      console.log(`📋 Se eliminarán ${rescheduleCount} reschedules asociados a fases duplicadas`);
      console.log('');

      // 4. Eliminar reschedules asociados primero
      if (rescheduleCount > 0) {
        console.log('🗑️  Eliminando reschedules asociados...');
        const deleteReschedulesResult = await queryRunner.query(`
          DELETE FROM plan_phase_reschedules
          WHERE "planPhaseId" = ANY($1)
        `, [duplicateIdsArray]);
        console.log(`✅ ${rescheduleCount} reschedules eliminados`);
        console.log('');
      }

      // 5. Eliminar fases duplicadas
      console.log('🗑️  Eliminando fases duplicadas...');
      const deletePhasesResult = await queryRunner.query(`
        DELETE FROM plan_phases
        WHERE id = ANY($1)
      `, [duplicateIdsArray]);
      console.log(`✅ ${duplicateIdsArray.length} fases eliminadas`);
      console.log('');

      // 6. Verificar que no quedan duplicados
      const remainingResult = await queryRunner.query(`
        SELECT COUNT(*) as count
        FROM (
          SELECT 
            "planId",
            name,
            COUNT(*) as cnt
          FROM plan_phases
          GROUP BY "planId", name
          HAVING COUNT(*) > 1
        ) duplicates
      `);

      const remainingCount = parseInt(remainingResult[0]?.count || '0');
      if (remainingCount > 0) {
        console.log(`⚠️  Aún quedan ${remainingCount} grupos de duplicados`);
        console.log('🔄 Revirtiendo transacción...');
        await queryRunner.rollbackTransaction();
        console.log('❌ Transacción revertida');
        return;
      }

      // Confirmar transacción
      await queryRunner.commitTransaction();
      console.log('✅ Todas las fases duplicadas han sido eliminadas correctamente');
      console.log('✅ Transacción confirmada');
      console.log('');

    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('');
      console.error('❌ Error durante la eliminación:', error.message);
      console.error('🔄 Transacción revertida');
      throw error;
    } finally {
      await queryRunner.release();
    }

  } catch (error) {
    console.error('');
    console.error('❌ Error al conectar:', error.message);
    if (error.message.includes('password')) {
      console.error('');
      console.error('💡 Verifica las variables de entorno:');
      console.error('   DATABASE_HOST');
      console.error('   DATABASE_PORT');
      console.error('   DATABASE_USER');
      console.error('   DATABASE_PASSWORD');
      console.error('   DATABASE_NAME');
    }
    throw error;
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

// Ejecutar
console.log('🚀 Iniciando eliminación de fases duplicadas...');
console.log('');
removeDuplicates()
  .then(() => {
    console.log('✨ Script completado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('');
    console.error('❌ Error fatal:', error.message);
    if (error.stack) {
      console.error('');
      console.error('Stack trace:');
      console.error(error.stack);
    }
    process.exit(1);
  });

