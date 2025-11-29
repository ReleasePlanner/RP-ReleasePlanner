# Scripts para Eliminar Fases Duplicadas

## Problema
Las fases se están duplicando en la base de datos cuando se actualiza un plan. Esto ocurre porque se está usando `addPhase()` antes de guardar, lo que puede causar que TypeORM guarde las fases múltiples veces.

## Solución Temporal: Limpiar Duplicados Existentes

### Opción 1: Script Seguro (Recomendado)

1. **Ejecutar el script seguro** que usa transacciones:
   ```bash
   psql -U tu_usuario -d tu_base_de_datos -f scripts/remove-duplicate-phases-safe.sql
   ```

2. **Revisar los mensajes** que muestran:
   - Cuántas fases duplicadas se encontraron
   - Cuántos reschedules se eliminarán
   - Si quedan duplicados después de la limpieza

3. **Confirmar o revertir**:
   - Si todo está bien, descomentar `COMMIT;` al final del script
   - Si hay problemas, descomentar `ROLLBACK;` para revertir

### Opción 2: Script Manual (Más Control)

1. **Ejecutar PASO 1** para ver qué duplicados existen:
   ```sql
   -- Ver duplicados
   SELECT ... FROM plan_phases ...;
   ```

2. **Ejecutar PASO 2** para ver detalles de lo que se eliminará:
   ```sql
   -- Ver detalles
   WITH duplicates AS ...;
   ```

3. **Ejecutar PASO 3** para verificar reschedules asociados:
   ```sql
   -- Ver reschedules
   SELECT ... FROM plan_phase_reschedules ...;
   ```

4. **Ejecutar PASO 4** para eliminar reschedules:
   ```sql
   DELETE FROM plan_phase_reschedules ...;
   ```

5. **Ejecutar PASO 5** para eliminar fases duplicadas:
   ```sql
   DELETE FROM plan_phases ...;
   ```

6. **Ejecutar PASO 6** para verificar que no quedan duplicados:
   ```sql
   -- Verificar resultado
   SELECT ... FROM plan_phases ...;
   ```

## Criterio de Duplicado

Un duplicado se define como:
- **Mismo `planId`** Y **mismo `name`**

Se mantiene:
- La fase con **`createdAt` más reciente**
- Si hay empate, la que tiene **`updatedAt` más reciente**

## Precauciones

⚠️ **IMPORTANTE**: 
- Los reschedules asociados a fases duplicadas también se eliminarán
- Hacer backup de la base de datos antes de ejecutar
- Revisar los resultados antes de confirmar con COMMIT

## Solución Permanente

El código ya fue corregido en `plan.service.ts`:
- Se eliminó el uso de `addPhase()` antes de guardar
- Se recarga el plan después de guardar para obtener la lista correcta
- Esto previene futuras duplicaciones

## Verificación Post-Limpieza

Después de ejecutar los scripts, verificar:

```sql
-- Verificar que no hay duplicados
SELECT 
    "planId",
    name,
    COUNT(*) as count
FROM plan_phases
GROUP BY "planId", name
HAVING COUNT(*) > 1;

-- Debe devolver 0 filas si la limpieza fue exitosa
```

## Contacto

Si encuentras problemas con estos scripts, revisa:
1. Los logs del script
2. La estructura de la base de datos
3. Las relaciones entre tablas

