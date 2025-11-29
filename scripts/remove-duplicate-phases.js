/**
 * Script para eliminar fases duplicadas de la base de datos
 * 
 * Uso:
 *   node scripts/remove-duplicate-phases.js
 * 
 * O con confirmación:
 *   node scripts/remove-duplicate-phases.js --confirm
 */

const { DataSource } = require('typeorm');
const path = require('path');

// Configuración de conexión a la base de datos
// Ajusta estos valores según tu configuración
const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'release_planner',
  entities: [path.join(__dirname, '../apps/api/src/**/*.entity.ts')],
  synchronize: false,
  logging: false,
});

async function findDuplicates() {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();

  try {
    const duplicates = await queryRunner.query(`
      SELECT 
        pp."planId",
        p.name as plan_name,
        pp.name as phase_name,
        COUNT(*) as duplicate_count,
        ARRAY_AGG(pp.id ORDER BY pp."createdAt" DESC) as phase_ids,
        ARRAY_AGG(pp."createdAt" ORDER BY pp."createdAt" DESC) as created_dates
      FROM plan_phases pp
      JOIN plans p ON pp."planId" = p.id
      GROUP BY pp."planId", pp.name, p.name
      HAVING COUNT(*) > 1
      ORDER BY duplicate_count DESC, p.name, pp.name
    `);

    return duplicates;
  } finally {
    await queryRunner.release();
  }
}

async function getDuplicatePhaseIds() {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();

  try {
    const result = await queryRunner.query(`
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

    return result.map(row => row.id);
  } finally {
    await queryRunner.release();
  }
}

async function removeDuplicates(confirm = false) {
  if (!confirm) {
    console.log('⚠️  Modo de vista previa. Usa --confirm para eliminar duplicados.');
    console.log('');
  }

  await dataSource.initialize();
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();

  try {
    // Iniciar transacción
    await queryRunner.startTransaction();

    // 1. Encontrar duplicados
    console.log('🔍 Buscando fases duplicadas...');
    const duplicates = await findDuplicates();
    
    if (duplicates.length === 0) {
      console.log('✅ No se encontraron fases duplicadas.');
      await queryRunner.rollbackTransaction();
      return;
    }

    console.log(`📊 Se encontraron ${duplicates.length} grupos de fases duplicadas:`);
    duplicates.forEach((dup, index) => {
      console.log(`  ${index + 1}. Plan: "${dup.plan_name}" - Fase: "${dup.phase_name}" (${dup.duplicate_count} duplicados)`);
    });
    console.log('');

    // 2. Obtener IDs de fases duplicadas (excluyendo la más reciente de cada grupo)
    const duplicateIds = await getDuplicatePhaseIds();
    console.log(`📋 Se eliminarán ${duplicateIds.length} fases duplicadas.`);
    console.log('');

    // 3. Contar reschedules asociados
    const rescheduleCount = await queryRunner.query(`
      SELECT COUNT(*) as count
      FROM plan_phase_reschedules
      WHERE "planPhaseId" = ANY($1)
    `, [duplicateIds]);

    const rescheduleCountNum = parseInt(rescheduleCount[0].count);
    console.log(`📋 Se eliminarán ${rescheduleCountNum} reschedules asociados a fases duplicadas.`);
    console.log('');

    if (!confirm) {
      console.log('💡 Para eliminar estos duplicados, ejecuta:');
      console.log('   node scripts/remove-duplicate-phases.js --confirm');
      await queryRunner.rollbackTransaction();
      return;
    }

    // 4. Eliminar reschedules asociados
    if (rescheduleCountNum > 0) {
      console.log('🗑️  Eliminando reschedules asociados...');
      await queryRunner.query(`
        DELETE FROM plan_phase_reschedules
        WHERE "planPhaseId" = ANY($1)
      `, [duplicateIds]);
      console.log(`✅ ${rescheduleCountNum} reschedules eliminados.`);
    }

    // 5. Eliminar fases duplicadas
    console.log('🗑️  Eliminando fases duplicadas...');
    const deleteResult = await queryRunner.query(`
      DELETE FROM plan_phases
      WHERE id = ANY($1)
    `, [duplicateIds]);
    console.log(`✅ ${duplicateIds.length} fases eliminadas.`);

    // 6. Verificar que no quedan duplicados
    const remainingDuplicates = await findDuplicates();
    if (remainingDuplicates.length > 0) {
      console.log(`⚠️  Aún quedan ${remainingDuplicates.length} grupos de duplicados.`);
      await queryRunner.rollbackTransaction();
      return;
    }

    // Confirmar transacción
    await queryRunner.commitTransaction();
    console.log('');
    console.log('✅ Todas las fases duplicadas han sido eliminadas correctamente.');
    console.log('✅ Transacción confirmada.');

  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('❌ Error al eliminar duplicados:', error.message);
    throw error;
  } finally {
    await queryRunner.release();
    await dataSource.destroy();
  }
}

// Ejecutar script
const confirm = process.argv.includes('--confirm');
removeDuplicates(confirm)
  .then(() => {
    console.log('');
    console.log('✨ Script completado.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });

