/**
 * Script para ejecutar la eliminación de fases duplicadas
 * Usa la configuración de TypeORM del proyecto
 */

require('ts-node/register');
const path = require('path');
const { DataSource } = require('typeorm');

// Cargar configuración de la base de datos
const databaseConfig = require('../apps/api/src/config/database.config.ts').default;

async function removeDuplicates() {
  console.log('🔌 Conectando a la base de datos...');
  console.log(`   Host: ${databaseConfig.host}`);
  console.log(`   Database: ${databaseConfig.database}`);
  console.log(`   Username: ${databaseConfig.username}`);
  console.log('');

  const dataSource = new DataSource({
    type: 'postgres',
    host: databaseConfig.host,
    port: databaseConfig.port,
    username: databaseConfig.username,
    password: databaseConfig.password,
    database: databaseConfig.database,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Conectado a la base de datos');
    console.log('');

    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      // Iniciar transacción
      await queryRunner.startTransaction();

      // 1. Contar duplicados
      console.log('🔍 Buscando fases duplicadas...');
      const duplicateGroups = await queryRunner.query(`
        SELECT 
          "planId",
          name,
          COUNT(*) as cnt
        FROM plan_phases
        GROUP BY "planId", name
        HAVING COUNT(*) > 1
      `);

      const duplicateCount = duplicateGroups.length;
      console.log(`📊 Se encontraron ${duplicateCount} grupos de fases duplicadas`);
      
      if (duplicateCount === 0) {
        console.log('✅ No hay fases duplicadas. No se requiere acción.');
        await queryRunner.rollbackTransaction();
        return;
      }

      // Mostrar detalles
      for (const group of duplicateGroups) {
        const phases = await queryRunner.query(`
          SELECT id, name, "createdAt", "updatedAt"
          FROM plan_phases
          WHERE "planId" = $1 AND name = $2
          ORDER BY "createdAt" DESC, "updatedAt" DESC
        `, [group.planId, group.name]);

        const plan = await queryRunner.query(`
          SELECT name FROM plans WHERE id = $1
        `, [group.planId]);

        console.log(`   Plan: "${plan[0]?.name || group.planId}" - Fase: "${group.name}" (${group.cnt} duplicados)`);
        phases.forEach((p, i) => {
          console.log(`     ${i + 1}. ID: ${p.id} - Creado: ${p.createdAt} ${i === 0 ? '(MANTENER)' : '(ELIMINAR)'}`);
        });
      }
      console.log('');

      // 2. Obtener IDs de fases duplicadas (excluyendo la más reciente)
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

      // 3. Contar reschedules asociados
      const rescheduleCount = await queryRunner.query(`
        SELECT COUNT(*) as count
        FROM plan_phase_reschedules
        WHERE "planPhaseId" = ANY($1)
      `, [duplicateIdsArray]);

      const rescheduleCountNum = parseInt(rescheduleCount[0].count);
      console.log(`📋 Se eliminarán ${rescheduleCountNum} reschedules asociados`);
      console.log('');

      // 4. Eliminar reschedules
      if (rescheduleCountNum > 0) {
        console.log('🗑️  Eliminando reschedules asociados...');
        await queryRunner.query(`
          DELETE FROM plan_phase_reschedules
          WHERE "planPhaseId" = ANY($1)
        `, [duplicateIdsArray]);
        console.log(`✅ ${rescheduleCountNum} reschedules eliminados`);
      }

      // 5. Eliminar fases duplicadas
      console.log('🗑️  Eliminando fases duplicadas...');
      await queryRunner.query(`
        DELETE FROM plan_phases
        WHERE id = ANY($1)
      `, [duplicateIdsArray]);
      console.log(`✅ ${duplicateIdsArray.length} fases eliminadas`);
      console.log('');

      // 6. Verificar resultado
      const remainingDuplicates = await queryRunner.query(`
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

      const remainingCount = parseInt(remainingDuplicates[0].count);
      if (remainingCount > 0) {
        console.log(`⚠️  Aún quedan ${remainingCount} grupos de duplicados`);
        await queryRunner.rollbackTransaction();
        return;
      }

      // Confirmar transacción
      await queryRunner.commitTransaction();
      console.log('✅ Todas las fases duplicadas han sido eliminadas correctamente');
      console.log('✅ Transacción confirmada');

    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('❌ Error durante la eliminación:', error.message);
      throw error;
    } finally {
      await queryRunner.release();
    }

  } catch (error) {
    console.error('❌ Error al conectar:', error.message);
    throw error;
  } finally {
    await dataSource.destroy();
  }
}

// Ejecutar
removeDuplicates()
  .then(() => {
    console.log('');
    console.log('✨ Script completado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('');
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });

