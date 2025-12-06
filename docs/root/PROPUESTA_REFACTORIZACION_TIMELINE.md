# Propuesta de Refactorización del Timeline - Implementación Práctica

## 🎯 Objetivos Principales

1. **Reducir tiempo de carga inicial**: De ~2-3s a <500ms
2. **Mejorar rendimiento**: Virtualización de días y componentes
3. **Arquitectura compuesta**: Componentes reutilizables y mantenibles
4. **Control completo del proyecto**: API clara para manejar fases y fechas

## 📊 Análisis de Problemas Actuales

### Problemas Críticos Identificados

1. **Array de días completo en memoria**:

   ```typescript
   // Línea 133-135: Crea array de TODOS los días (puede ser 1000+)
   const days = useMemo(
     () => Array.from({ length: totalDays }, (_, i) => addDays(start, i)),
     [start, totalDays]
   );
   ```

   - **Impacto**: Para un proyecto de 2 años = ~730 días en memoria
   - **Solución**: Virtualización - solo renderizar días visibles

2. **Múltiples queries de calendarios**:

   ```typescript
   // Línea 211-218: N queries para N calendarios
   const calendarQueries = useQueries({
     queries: calendarIds.map((id) => ({...}))
   });
   ```

   - **Impacto**: Si hay 5 calendarios = 5 queries simultáneas
   - **Solución**: Lazy load solo calendarios visibles + prefetch

3. **Re-renders innecesarios**:

   - Cambiar una fase re-renderiza TODO el timeline
   - No hay memoización por fase individual
   - **Solución**: Componentes memoizados por fase

4. **Cálculos pesados en cada render**:
   ```typescript
   // Línea 250-312: Cálculo de calendarDaysMap en cada cambio
   const calendarDaysMap = useMemo(() => {
     // Procesa TODOS los días y calendarios
   }, [plalexaanCalendars, start, end]);
   ```
   - **Solución**: Web Workers o cálculos incrementales

## 🏗️ Arquitectura Propuesta - Detallada

### 1. TimelineProvider (Context API)

```typescript
// timeline/context/TimelineContext.tsx
interface TimelineState {
  phases: PlanPhase[];
  tasks: PlanTask[];
  milestones: PlanMilestone[];
  selectedPhaseId: string | null;
  viewportRange: { start: Date; end: Date };
  config: TimelineConfig;
}

interface TimelineActions {
  // CRUD de fases
  addPhase: (phase: PlanPhase) => void;
  updatePhase: (id: string, updates: Partial<PlanPhase>) => void;
  deletePhase: (id: string) => void;

  // Drag & Drop
  movePhase: (id: string, startDate: string, endDate: string) => void;
  resizePhase: (id: string, startDate: string, endDate: string) => void;

  // Selección
  selectPhase: (id: string | null) => void;

  // Navegación
  scrollToDate: (date: string) => void;
  zoomIn: () => void;
  zoomOut: () => void;
}

interface TimelineContextValue {
  state: TimelineState;
  actions: TimelineActions;
  calendars: Calendar[];
  isLoading: boolean;
}
```

### 2. TimelineViewport (Virtualización)

```typescript
// timeline/components/TimelineViewport.tsx
import { useVirtualizer } from "@tanstack/react-virtual";

function TimelineViewport({ startDate, endDate, pxPerDay }) {
  const parentRef = useRef<HTMLDivElement>(null);

  // Solo calcula días visibles en viewport
  const visibleRange = useViewportDateRange(parentRef, pxPerDay);

  const virtualizer = useVirtualizer({
    count: visibleRange.totalDays,
    getScrollElement: () => parentRef.current,
    estimateSize: () => pxPerDay,
    overscan: 10, // Render 10 días extra fuera del viewport
  });

  return (
    <div ref={parentRef} style={{ height: "100%", overflow: "auto" }}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <TimelineDay
            key={virtualItem.index}
            date={addDays(startDate, virtualItem.index)}
            style={{
              position: "absolute",
              top: 0,
              left: `${virtualItem.start}px`,
              width: `${virtualItem.size}px`,
              height: "100%",
            }}
          />
        ))}
      </div>
    </div>
  );
}
```

### 3. PhaseTrack (Componente Individual Memoizado)

```typescript
// timeline/components/PhaseTrack/PhaseTrack.tsx
const PhaseTrack = memo(
  function PhaseTrack({
    phase,
    index,
    startDate,
    endDate,
    pxPerDay,
    onMove,
    onResize,
  }: PhaseTrackProps) {
    const { startIdx, length } = usePhasePosition(phase, startDate, pxPerDay);

    return (
      <div style={{ position: "relative", height: TRACK_HEIGHT }}>
        <PhaseBar
          phase={phase}
          left={startIdx * pxPerDay}
          width={length * pxPerDay}
          onMove={onMove}
          onResize={onResize}
        />
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Comparación personalizada - solo re-renderiza si cambia esta fase
    return (
      prevProps.phase.id === nextProps.phase.id &&
      prevProps.phase.startDate === nextProps.phase.startDate &&
      prevProps.phase.endDate === nextProps.phase.endDate &&
      prevProps.phase.color === nextProps.phase.color &&
      prevProps.index === nextProps.index
    );
  }
);
```

### 4. Hook de Calendarios Optimizado

```typescript
// timeline/hooks/useTimelineCalendars.ts
function useTimelineCalendars(
  calendarIds: string[],
  viewportRange: { start: Date; end: Date }
) {
  // Solo carga calendarios que intersectan con el viewport
  const visibleCalendarIds = useMemo(() => {
    return calendarIds.filter((id) => {
      // Lógica para determinar si el calendario es visible
      return true; // Simplificado
    });
  }, [calendarIds, viewportRange]);

  // Prefetch calendarios adyacentes
  const prefetchIds = useMemo(() => {
    // Calendarios que estarán visibles pronto
    return [];
  }, [viewportRange]);

  const queries = useQueries({
    queries: [
      ...visibleCalendarIds.map((id) => ({
        queryKey: ["calendars", id],
        queryFn: () => calendarsService.getById(id),
        staleTime: 5 * 60 * 1000,
      })),
      ...prefetchIds.map((id) => ({
        queryKey: ["calendars", id],
        queryFn: () => calendarsService.getById(id),
        enabled: false, // Prefetch only
      })),
    ],
  });

  return {
    calendars: queries.filter((q) => q.isSuccess).map((q) => q.data),
    isLoading: queries.some((q) => q.isLoading),
  };
}
```

### 5. TimelineProject (Componente Principal)

```typescript
// timeline/TimelineProject.tsx
export function TimelineProject({
  startDate,
  endDate,
  phases = [],
  tasks = [],
  milestones = [],
  calendarIds = [],
  onPhaseChange,
  onPhaseMove,
  config = defaultConfig,
}: TimelineProjectProps) {
  return (
    <TimelineProvider
      initialPhases={phases}
      initialTasks={tasks}
      initialMilestones={milestones}
      startDate={startDate}
      endDate={endDate}
      calendarIds={calendarIds}
    >
      <TimelineContainer>
        <TimelineHeader />
        <TimelineBody>
          <PhaseList />
          <TimelineViewport>
            <TimelineGrid />
            <PhaseTracks />
            <TaskTracks />
            <MilestoneMarkers />
          </TimelineViewport>
        </TimelineBody>
        <TimelineOverlay />
      </TimelineContainer>
    </TimelineProvider>
  );
}
```

## ⚡ Optimizaciones Específicas

### 1. Virtualización de Días

**Antes**:

```typescript
// Carga TODOS los días
const days = Array.from({ length: totalDays }, (_, i) => addDays(start, i));
// Renderiza TODOS los días
{
  days.map((day, i) => <DayCell key={i} day={day} />);
}
```

**Después**:

```typescript
// Solo calcula días visibles
const visibleDays = useViewportDays(viewportRef, startDate, pxPerDay);
// Solo renderiza días visibles
{
  virtualizer
    .getVirtualItems()
    .map((item) => <DayCell key={item.index} day={visibleDays[item.index]} />);
}
```

**Beneficio**: Reducción de 80-90% en memoria y tiempo de render

### 2. Lazy Loading de Calendarios

**Antes**:

```typescript
// Carga TODOS los calendarios inmediatamente
const calendarQueries = useQueries({
  queries: calendarIds.map(id => ({...}))
});
```

**Después**:

```typescript
// Solo carga calendarios visibles
const { calendars } = useTimelineCalendars(calendarIds, viewportRange);
// Prefetch calendarios adyacentes en background
usePrefetchAdjacentCalendars(calendarIds, viewportRange);
```

**Beneficio**: Reducción de 60-70% en queries iniciales

### 3. Memoización por Fase

**Antes**:

```typescript
// Re-renderiza TODAS las fases cuando cambia una
{
  phases.map((phase) => <PhaseBar key={phase.id} phase={phase} />);
}
```

**Después**:

```typescript
// Solo re-renderiza la fase que cambió
{
  phases.map((phase) => <PhaseTrack key={phase.id} phase={phase} />);
}
// Con memoización personalizada en PhaseTrack
```

**Beneficio**: Reducción de 80-90% en re-renders

### 4. Web Workers para Cálculos Pesados

```typescript
// timeline/workers/calendarWorker.ts
self.onmessage = (e) => {
  const { calendars, startDate, endDate } = e.data;

  // Procesar calendarios en background
  const calendarDaysMap = processCalendars(calendars, startDate, endDate);

  self.postMessage({ calendarDaysMap });
};

// timeline/hooks/useTimelineCalendars.ts
function useTimelineCalendars(calendars, startDate, endDate) {
  const [calendarDaysMap, setCalendarDaysMap] = useState(new Map());

  useEffect(() => {
    const worker = new Worker("/workers/calendarWorker.ts");
    worker.postMessage({ calendars, startDate, endDate });
    worker.onmessage = (e) => {
      setCalendarDaysMap(e.data.calendarDaysMap);
    };
    return () => worker.terminate();
  }, [calendars, startDate, endDate]);

  return calendarDaysMap;
}
```

## 📦 Estructura de Implementación

### Fase 1: Setup (Día 1)

```
timeline/
├── context/
│   ├── TimelineContext.tsx
│   └── TimelineProvider.tsx
├── hooks/
│   ├── useTimeline.ts
│   └── useTimelineState.ts
└── types/
    └── timeline.types.ts
```

### Fase 2: Virtualización (Días 2-3)

```
timeline/
├── components/
│   ├── TimelineViewport.tsx
│   ├── TimelineDay.tsx
│   └── useViewportDateRange.ts
```

### Fase 3: Componentes de Fases (Días 4-5)

```
timeline/
├── components/
│   ├── PhaseTrack/
│   │   ├── PhaseTrack.tsx
│   │   ├── PhaseBar.tsx
│   │   └── usePhasePosition.ts
│   └── PhaseTracks.tsx
```

### Fase 4: Optimización de Calendarios (Día 6)

```
timeline/
├── hooks/
│   └── useTimelineCalendars.ts
└── workers/
    └── calendarWorker.ts
```

### Fase 5: Integración (Días 7-8)

```
timeline/
├── TimelineProject.tsx
└── TimelineContainer.tsx
```

## 🎨 API Final Propuesta

```typescript
<TimelineProject
  // Configuración básica
  startDate="2024-01-01"
  endDate="2024-12-31"
  // Datos
  phases={phases}
  tasks={tasks}
  milestones={milestones}
  calendarIds={calendarIds}
  // Callbacks
  onPhaseChange={(phaseId, updates) => {
    // Actualizar fase
  }}
  onPhaseMove={(phaseId, startDate, endDate) => {
    // Mover fase
  }}
  onPhaseResize={(phaseId, startDate, endDate) => {
    // Redimensionar fase
  }}
  // Configuración avanzada
  config={{
    pxPerDay: 2,
    trackHeight: 40,
    showTodayMarker: true,
    enableDragDrop: true,
    enableVirtualization: true,
    calendarCacheTime: 5 * 60 * 1000,
  }}
/>
```

## 📈 Métricas Esperadas

| Métrica                  | Antes           | Después      | Mejora  |
| ------------------------ | --------------- | ------------ | ------- |
| Tiempo carga inicial     | 2-3s            | <500ms       | **80%** |
| Memoria (días)           | ~730 días       | ~50 días     | **93%** |
| Re-renders (cambio fase) | Todas las fases | 1 fase       | **90%** |
| Queries calendarios      | N queries       | ~2-3 queries | **70%** |
| Tiempo interacción       | 200-300ms       | <50ms        | **75%** |

## 🔄 Plan de Migración Gradual

### Opción 1: Refactorización Completa (Recomendado)

1. Crear nueva estructura en paralelo
2. Migrar componente por componente
3. Mantener compatibilidad con API antigua
4. Deprecar gradualmente

### Opción 2: Refactorización Incremental

1. Extraer hooks primero
2. Virtualizar días gradualmente
3. Memoizar componentes existentes
4. Optimizar calendarios

## 🚀 Próximos Pasos

1. **Crear TimelineProvider** - Context API básico
2. **Implementar TimelineViewport** - Virtualización de días
3. **Refactorizar PhaseTrack** - Componente memoizado
4. **Optimizar calendarios** - Lazy loading
5. **Integrar todo** - TimelineProject final

## 📝 Notas de Implementación

- Usar `@tanstack/react-virtual` para virtualización
- Usar `React.memo` con comparación personalizada
- Implementar Web Workers solo si los cálculos son muy pesados
- Mantener compatibilidad con API actual durante migración
- Tests unitarios para cada componente nuevo
