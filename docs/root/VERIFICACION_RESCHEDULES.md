# Verificación de Re-schedules

## ✅ Cambios Implementados

### 1. Logs de Depuración en Backend
- **`getPhaseReschedules`**: Agregados logs para verificar cuántos reschedules se encuentran
- **`getPlanReschedules`**: Agregados logs para verificar:
  - Si el plan se encuentra
  - Cuántas fases tiene el plan
  - Qué phase IDs se están buscando
  - Cuántos reschedules se encuentran

### 2. Carga de Fases en `getPlanReschedules`
- **Problema identificado**: `repository.findById()` podría no cargar las fases automáticamente
- **Solución**: Cambiado a usar `manager.findOne(Plan, { relations: ["phases"] })` para asegurar que las fases se carguen

### 3. Invalidación de Queries en Frontend
- **`usePlanCardSave.ts`**: Agregada invalidación de queries de reschedules después de guardar:
  - Invalida `["plans", "reschedules", plan.id]` para el tab de plan
  - Invalida `["plans", "reschedules", plan.id, "phases", phase.id]` para cada fase

### 4. Logs de Depuración en Frontend
- **`PlanReschedulesTab`**: Agregados logs para verificar props y resultados del hook
- **`PhaseReschedulesTab`**: Ya tenía logs de depuración

## 🔍 Cómo Verificar

### 1. Verificar en Logs del Servidor

Después de modificar una fase y guardar, buscar en los logs:

```
[PlanService.update] 🔍 PHASE MATCH CHECK
[PlanService.update] 🔍 Phase ... DETAILED date check
[PlanService.update] ⚠️ DATE CHANGE DETECTED
[PlanService.update] ✅ Phase reschedule INSERTED SUCCESSFULLY
[PlanService.getPlanReschedules] Fetching reschedules for plan: ...
[PlanService.getPlanReschedules] Plan found: ..., phases count: ...
[PlanService.getPlanReschedules] Phase IDs: [...]
[PlanService.getPlanReschedules] Found X reschedules for plan ...
```

### 2. Verificar en Logs del Navegador

En la consola del navegador, buscar:

```
[PlanReschedulesTab] Props: { planId: "..." }
[PlanReschedulesTab] Hook result: { reschedules: [...], isLoading: false, error: null }
[PhaseReschedulesTab] Props: { planId: "...", phaseId: "..." }
[PhaseReschedulesTab] Hook result: { reschedules: [...], isLoading: false, error: null }
```

### 3. Verificar en Base de Datos

```sql
-- Ver todos los reschedules
SELECT * FROM phase_reschedules ORDER BY "rescheduledAt" DESC;

-- Ver reschedules de un plan específico
SELECT pr.*, pp.name as phase_name 
FROM phase_reschedules pr
JOIN plan_phases pp ON pr."planPhaseId" = pp.id
JOIN plans p ON pp."planId" = p.id
WHERE p.id = '<plan-id>'
ORDER BY pr."rescheduledAt" DESC;

-- Ver reschedules de una fase específica
SELECT * FROM phase_reschedules 
WHERE "planPhaseId" = '<phase-id>'
ORDER BY "rescheduledAt" DESC;
```

### 4. Verificar Endpoints API

```bash
# Obtener reschedules del plan
curl http://localhost:3000/api/plans/<plan-id>/reschedules

# Obtener reschedules de una fase
curl http://localhost:3000/api/plans/<plan-id>/phases/<phase-id>/reschedules
```

## 🐛 Posibles Problemas

### Problema 1: Plan no tiene fases cargadas
- **Síntoma**: `phases count: 0` en los logs
- **Causa**: `repository.findById()` no carga relaciones por defecto
- **Solución**: Ya corregido - ahora usa `manager.findOne()` con `relations: ["phases"]`

### Problema 2: Reschedules no se crean
- **Síntoma**: No aparece `✅ Phase reschedule INSERTED SUCCESSFULLY` en logs
- **Causa**: Las fechas no cambian realmente, o hay un error silencioso
- **Solución**: Revisar logs de comparación de fechas

### Problema 3: Queries no se invalidan
- **Síntoma**: Los reschedules no aparecen hasta refrescar manualmente
- **Causa**: Las queries de React Query no se invalidan después de guardar
- **Solución**: Ya corregido - se invalidan las queries de reschedules

### Problema 4: Fases no se encuentran
- **Síntoma**: `existsInMap=false` en los logs
- **Causa**: El `planPhaseId` del DTO no coincide con el ID en BD
- **Solución**: Revisar logs de `PHASE MATCH CHECK`

## 📝 Próximos Pasos

1. **Modificar período de fase** (arrastrar o editar)
2. **Presionar "Guardar todo"**
3. **Revisar logs del servidor** para verificar creación
4. **Abrir tab de Re-schedules** en plan o fase
5. **Revisar logs del navegador** para verificar carga
6. **Verificar en BD** que los registros existen

Si después de estos pasos los reschedules siguen sin aparecer, los logs mostrarán exactamente dónde está el problema.

