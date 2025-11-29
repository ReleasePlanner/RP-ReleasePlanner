-- Script para eliminar fases duplicadas en la misma tabla plan_phases
-- Un duplicado se define como: mismo planId y mismo name

-- PASO 1: Ver duplicados antes de eliminar (ejecutar primero para revisar)
SELECT 
    pp."planId",
    p.name as plan_name,
    pp.name as phase_name,
    COUNT(*) as duplicate_count,
    STRING_AGG(pp.id::text, ', ' ORDER BY pp."createdAt" DESC) as phase_ids,
    STRING_AGG(pp."createdAt"::text, ', ' ORDER BY pp."createdAt" DESC) as created_dates
FROM plan_phases pp
JOIN plans p ON pp."planId" = p.id
GROUP BY pp."planId", pp.name, p.name
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC, p.name, pp.name;

-- PASO 2: Ver detalles de los duplicados (ejecutar para ver qué se va a eliminar)
WITH duplicates AS (
    SELECT 
        pp.id,
        pp."planId",
        pp.name,
        pp."startDate",
        pp."endDate",
        pp."createdAt",
        pp."updatedAt",
        ROW_NUMBER() OVER (
            PARTITION BY pp."planId", pp.name 
            ORDER BY pp."createdAt" DESC, pp."updatedAt" DESC
        ) as rn
    FROM plan_phases pp
)
SELECT 
    d.id,
    d."planId",
    p.name as plan_name,
    d.name as phase_name,
    d."startDate",
    d."endDate",
    d."createdAt",
    d."updatedAt",
    CASE 
        WHEN d.rn = 1 THEN 'KEEP (most recent)'
        ELSE 'DELETE (duplicate)'
    END as action
FROM duplicates d
JOIN plans p ON d."planId" = p.id
WHERE d.rn > 1 OR EXISTS (
    SELECT 1 FROM duplicates d2 
    WHERE d2."planId" = d."planId" 
    AND d2.name = d.name 
    AND d2.rn > 1
)
ORDER BY d."planId", d.name, d.rn;

-- PASO 3: Verificar si hay reschedules asociados a las fases duplicadas
SELECT 
    pr.id as reschedule_id,
    pr."planPhaseId",
    pp.name as phase_name,
    pp."planId",
    p.name as plan_name,
    pr."rescheduledAt"
FROM plan_phase_reschedules pr
JOIN plan_phases pp ON pr."planPhaseId" = pp.id
JOIN plans p ON pp."planId" = p.id
WHERE pp.id IN (
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
)
ORDER BY p.name, pp.name, pr."rescheduledAt" DESC;

-- PASO 4: ELIMINAR reschedules de fases duplicadas (ejecutar ANTES de eliminar fases)
-- Esto elimina los reschedules asociados a las fases que serán eliminadas
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

-- PASO 5: ELIMINAR fases duplicadas (mantener solo la más reciente de cada grupo)
-- ⚠️ IMPORTANTE: Ejecutar PASO 4 primero para eliminar reschedules asociados
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

-- PASO 6: Verificar resultado (ejecutar después de eliminar)
SELECT 
    pp."planId",
    p.name as plan_name,
    pp.name as phase_name,
    COUNT(*) as phase_count
FROM plan_phases pp
JOIN plans p ON pp."planId" = p.id
GROUP BY pp."planId", pp.name, p.name
HAVING COUNT(*) > 1
ORDER BY phase_count DESC, p.name, pp.name;

-- Si el PASO 6 no devuelve resultados, significa que se eliminaron todos los duplicados correctamente

