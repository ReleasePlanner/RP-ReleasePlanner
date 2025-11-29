-- Script SEGURO para eliminar fases duplicadas
-- Este script usa CTE y transacciones para mayor seguridad

BEGIN;

-- Ver duplicados antes de eliminar
DO $$
DECLARE
    duplicate_count INTEGER;
    reschedule_count INTEGER;
BEGIN
    -- Contar duplicados
    SELECT COUNT(*) INTO duplicate_count
    FROM (
        SELECT 
            "planId",
            name,
            COUNT(*) as cnt
        FROM plan_phases
        GROUP BY "planId", name
        HAVING COUNT(*) > 1
    ) duplicates;
    
    RAISE NOTICE 'Fases duplicadas encontradas: %', duplicate_count;
    
    -- Contar reschedules asociados
    SELECT COUNT(*) INTO reschedule_count
    FROM plan_phase_reschedules pr
    WHERE pr."planPhaseId" IN (
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
    );
    
    RAISE NOTICE 'Reschedules asociados a fases duplicadas: %', reschedule_count;
END $$;

-- PASO 1: Eliminar reschedules de fases duplicadas
DELETE FROM plan_phase_reschedules
WHERE "planPhaseId" IN (
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
);

-- PASO 2: Eliminar fases duplicadas (mantener solo la más reciente)
DELETE FROM plan_phases
WHERE id IN (
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
);

-- Verificar resultado
DO $$
DECLARE
    remaining_duplicates INTEGER;
BEGIN
    SELECT COUNT(*) INTO remaining_duplicates
    FROM (
        SELECT 
            "planId",
            name,
            COUNT(*) as cnt
        FROM plan_phases
        GROUP BY "planId", name
        HAVING COUNT(*) > 1
    ) duplicates;
    
    IF remaining_duplicates > 0 THEN
        RAISE WARNING 'Aún quedan % grupos de fases duplicadas', remaining_duplicates;
    ELSE
        RAISE NOTICE '✅ Todas las fases duplicadas han sido eliminadas correctamente';
    END IF;
END $$;

-- ⚠️ IMPORTANTE: Revisar los resultados antes de hacer COMMIT
-- Si todo está bien, ejecutar: COMMIT;
-- Si hay problemas, ejecutar: ROLLBACK;

-- COMMIT; -- Descomentar esta línea para confirmar los cambios
-- ROLLBACK; -- Descomentar esta línea para revertir los cambios

