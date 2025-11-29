# Implementación de Progress Bar Real

## ✅ Cambios Implementados

### 1. Hook de Progreso Real (`usePlanLoadingProgress.ts`)
- **Ubicación**: `apps/portal/src/pages/components/PlanListItem/hooks/usePlanLoadingProgress.ts`
- **Funcionalidad**:
  - Rastrea el progreso real de carga basado en datos reales
  - Monitorea múltiples etapas:
    1. **Cargando módulo** (15%): Módulo lazy de PlanCard
    2. **Cargando calendarios** (25%): Calendarios del plan
    3. **Cargando productos** (20%): Productos necesarios
    4. **Cargando equipos** (15%): Equipos asignados
    5. **Preparando datos** (15%): Datos adicionales
    6. **Renderizando** (10%): Renderizado final
  - Usa `queryClient.getQueryState()` para verificar estado real de queries
  - Actualiza progreso cada 150ms para feedback fluido
  - Timeout de seguridad de 5 segundos para evitar bloqueos

### 2. Componente de Loading Actualizado (`PlanCardLoadingFallback.tsx`)
- **Cambios**:
  - Ahora recibe `plan` como prop para rastrear progreso real
  - Muestra etapa actual de carga en lugar de texto genérico
  - Progress bar cambia a verde cuando está completo
  - Oculta dots animados cuando está completo
  - Usa `variant="determinate"` para mostrar progreso real

### 3. Integración (`PlanListItemExpandedContent.tsx`)
- **Cambios**:
  - Pasa `plan` prop a `PlanCardLoadingFallback`
  - Mantiene lazy loading con Suspense

## 📊 Etapas de Carga Monitoreadas

| Etapa | Peso | Descripción |
|-------|------|-------------|
| Módulo | 15% | Carga del módulo lazy de PlanCard |
| Calendarios | 25% | Carga de calendarios asignados al plan |
| Productos | 20% | Carga de productos necesarios |
| Equipos | 15% | Carga de equipos asignados |
| Preparando | 15% | Preparación de datos adicionales |
| Renderizando | 10% | Renderizado final del componente |

## 🎯 Características

### Progreso Real
- ✅ Basado en estado real de React Query
- ✅ Verifica queries individuales para cada recurso
- ✅ Actualiza progreso según datos realmente cargados

### Feedback Visual
- ✅ Muestra etapa actual de carga
- ✅ Porcentaje preciso basado en etapas completadas
- ✅ Cambio de color cuando está completo (verde)
- ✅ Animación suave de transición

### Robustez
- ✅ Timeout de seguridad (5 segundos)
- ✅ Maneja casos sin calendarios/equipos
- ✅ No bloquea si alguna query falla
- ✅ Limpia intervalos correctamente

## 🔍 Detalles Técnicos

### Verificación de Queries
```typescript
const queryState = queryClient.getQueryState(["calendars", "detail", id]);
// Verifica si está "success" o "pending" para considerar cargando
```

### Cálculo de Progreso
```typescript
const completedWeight = completedStages.reduce(
  (sum, idx) => sum + stages[idx].weight,
  0
);
const progress = (completedWeight / totalWeight) * 100;
```

### Actualización
- Intervalo: 150ms para feedback fluido
- Verificación inmediata al montar
- Limpieza automática al desmontar

## 💡 Mejoras Futuras (Opcionales)

1. **Detección de PlanCard montado**: Usar ref callback para detectar cuando PlanCard realmente se monta
2. **Progreso más granular**: Monitorear sub-etapas dentro de cada etapa principal
3. **Estimación de tiempo**: Calcular tiempo estimado basado en velocidad de carga
4. **Cache de progreso**: Recordar progreso para planes ya cargados anteriormente

## 🎉 Resultado

El progress bar ahora muestra:
- ✅ **Progreso real** basado en datos cargados
- ✅ **Etapa actual** de carga visible
- ✅ **Porcentaje preciso** calculado dinámicamente
- ✅ **Feedback visual** mejorado con cambio de color
- ✅ **Robustez** con timeout de seguridad

¡El usuario ahora puede ver exactamente qué está cargando y cuánto falta! 🚀

