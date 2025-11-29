# Implementación de Reschedule Atómico

## ✅ Cambios Implementados

### 1. Uso de Owner por Defecto del Plan
- **Ubicación**: `apps/api/src/release-plans/application/plan.service.ts` (línea ~927)
- **Cambio**: 
  ```typescript
  // Antes:
  p.rescheduleOwnerId || undefined
  
  // Ahora:
  const ownerId = p.rescheduleOwnerId || plan.itOwner || undefined;
  ```
- **Funcionalidad**: 
  - Si no se proporciona `rescheduleOwnerId` en el DTO, usa el `itOwner` del plan
  - Si el plan no tiene `itOwner`, queda como `undefined`
  - Esto asegura que siempre se registre quién aprobó el cambio

### 2. Tipo de Reschedule por Defecto
- **Ubicación**: `apps/api/src/release-plans/application/plan.service.ts` (línea ~918)
- **Funcionalidad**: 
  - Ya estaba implementado: usa tipo "Default" si no se proporciona `rescheduleTypeId`
  - Se obtiene o crea dentro de la transacción para garantizar atomicidad

### 3. Proceso Atómico
- **Ubicación**: `apps/api/src/release-plans/application/plan.service.ts` (línea ~766)
- **Funcionalidad**: 
  - Todo el proceso está dentro de `manager.transaction()`
  - Si falla la creación del reschedule, toda la transacción se revierte
  - Garantiza consistencia: fase actualizada + reschedule creado juntos

### 4. Registro de Fecha y Hora
- **Ubicación**: `apps/api/src/release-plans/domain/phase-reschedule.entity.ts` (línea ~77)
- **Funcionalidad**: 
  - `rescheduledAt` se establece automáticamente en el constructor: `new Date()`
  - Se registra la fecha y hora exacta del cambio

## 📋 Campos Registrados en `phase_reschedules`

| Campo | Valor | Fuente |
|-------|-------|--------|
| `planPhaseId` | ID de la fase | `existingPhase.id` |
| `originalStartDate` | Fecha inicio original | `existingPhase.startDate` |
| `originalEndDate` | Fecha fin original | `existingPhase.endDate` |
| `newStartDate` | Nueva fecha inicio | `p.startDate` |
| `newEndDate` | Nueva fecha fin | `p.endDate` |
| `rescheduleTypeId` | Tipo de reschedule | `p.rescheduleTypeId` o "Default" |
| `ownerId` | Owner que aprobó | `p.rescheduleOwnerId` o `plan.itOwner` |
| `rescheduledAt` | Fecha/hora del cambio | `new Date()` (automático) |

## 🔄 Flujo de Ejecución

1. **Usuario modifica período de fase** (arrastrando o editando)
2. **Usuario presiona "Guardar todo"**
3. **Frontend llama a `handleSaveTimeline`**
4. **Backend recibe `UpdatePlanDto` con fases actualizadas**
5. **Backend inicia transacción atómica**:
   - Obtiene o crea tipo "Default"
   - Recarga plan con fases actuales
   - Compara fechas originales vs nuevas
   - Si hay cambio:
     - Crea registro en `phase_reschedules` con:
       - Tipo: "Default" (si no se proporciona)
       - Owner: `plan.itOwner` (si no se proporciona)
       - Fechas originales y nuevas
       - Fecha/hora del cambio
     - Actualiza fase con nuevas fechas
   - Commit de transacción (todo o nada)

## ✅ Verificaciones Implementadas

1. **Validación de fase existente**: Verifica que la fase existe antes de crear reschedule
2. **Verificación post-insert**: Consulta el registro creado para confirmar persistencia
3. **Logging detallado**: Logs en cada paso para debugging
4. **Manejo de errores**: Re-lanza errores para asegurar rollback de transacción

## 🧪 Cómo Verificar

1. **Modificar período de fase**:
   - Arrastrar fase en timeline, o
   - Editar fase y cambiar fechas

2. **Presionar "Guardar todo"**

3. **Verificar en BD**:
   ```sql
   SELECT * FROM phase_reschedules 
   WHERE "planPhaseId" = '<phase-id>' 
   ORDER BY "rescheduledAt" DESC;
   ```

4. **Verificar logs del servidor**:
   - Buscar: `✅ Phase reschedule INSERTED SUCCESSFULLY`
   - Debe mostrar: `ownerId` y fuente (provided/plan.itOwner/none)

## 📝 Notas

- El proceso es **completamente atómico**: si falla cualquier parte, todo se revierte
- El owner por defecto es el `itOwner` del plan (definido en Common Data)
- El tipo por defecto es "Default" (se crea automáticamente si no existe)
- La fecha/hora se registra automáticamente al momento del cambio

