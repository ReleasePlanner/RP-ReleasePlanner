# Análisis y Propuesta de Refactorización del Timeline (GanttChart)

## 📊 Estado Actual

### Problemas Identificados

1. **Componente Monolítico**: `GanttChart.tsx` tiene ~1464 líneas - demasiado grande
2. **Carga Pesada**: 
   - Carga todos los días del timeline en memoria (`days` array)
   - Múltiples `useQueries` para calendarios (N queries para N calendarIds)
   - Cálculos pesados en cada render
3. **Rendimiento**:
   - Re-renders innecesarios de todo el timeline cuando cambia una fase
   - No hay virtualización de días/celdas
   - Drag & Drop con manipulación directa del DOM pero aún causa re-renders
4. **Arquitectura**:
   - Lógica de negocio mezclada con presentación
   - Múltiples responsabilidades en un solo componente
   - Difícil de testear y mantener

### Estructura Actual

```
GanttChart.tsx (1464 líneas)
├── Cálculos de timeline (días, rangos)
├── Lógica de calendarios (useQueries)
├── Drag & Drop (useGanttDragAndDrop)
├── Renderizado de fases
├── Renderizado de tareas
├── Renderizado de milestones
├── Renderizado de referencias
└── Lógica de scroll y navegación
```

## 🎯 Objetivo

Crear un **componente compuesto sólido** que:
- Maneje fases y fechas eficientemente
- Permita control completo del proyecto
- Sea performante y escalable
- Sea fácil de mantener y extender

## 🏗️ Arquitectura Propuesta

### Estructura de Componentes Compuestos

```
TimelineProject (Container Principal)
├── TimelineProvider (Context para estado compartido)
│   ├── TimelineState (fases, fechas, selección)
│   ├── TimelineActions (CRUD de fases, drag & drop)
│   └── TimelineConfig (configuración, calendarios)
│
├── TimelineHeader (Barra superior)
│   ├── TimelineToolbar (controles)
│   ├── TimelineScale (escala de tiempo)
│   └── TimelineNavigation (navegación)
│
├── TimelineBody (Cuerpo principal)
│   ├── TimelineViewport (viewport virtualizado)
│   │   ├── PhaseList (lista de fases - sticky)
│   │   └── TimelineGrid (grid virtualizado)
│   │       ├── PhaseTracks (tracks de fases)
│   │       ├── TaskTracks (tracks de tareas)
│   │       └── MilestoneMarkers (marcadores)
│   └── TimelineScrollbar (scrollbar personalizado)
│
└── TimelineOverlay (Overlays)
    ├── DragPreview (preview de drag)
    ├── SelectionOverlay (selección)
    └── ContextMenu (menú contextual)
```

### Componentes Clave

#### 1. **TimelineProvider** (Context API)
```typescript
interface TimelineContextValue {
  // Estado
  phases: PlanPhase[];
  tasks: PlanTask[];
  milestones: PlanMilestone[];
  selectedPhaseId: string | null;
  viewportRange: { start: Date; end: Date };
  
  // Acciones
  addPhase: (phase: PlanPhase) => void;
  updatePhase: (id: string, updates: Partial<PlanPhase>) => void;
  deletePhase: (id: string) => void;
  movePhase: (id: string, startDate: string, endDate: string) => void;
  resizePhase: (id: string, startDate: string, endDate: string) => void;
  
  // Configuración
  config: TimelineConfig;
  calendars: Calendar[];
}
```

#### 2. **TimelineViewport** (Virtualización)
- Usa `react-window` o `react-virtual` para virtualizar días
- Solo renderiza días visibles en viewport
- Reduce memoria y mejora rendimiento

#### 3. **PhaseTrack** (Componente Individual)
- Componente memoizado por fase
- Solo se re-renderiza cuando cambia esa fase específica
- Maneja su propio drag & drop

#### 4. **TimelineDateRange** (Hook de Rango)
```typescript
function useTimelineDateRange(startDate: string, endDate: string) {
  // Calcula solo el rango visible
  // Lazy loading de días fuera del viewport
  // Cache de cálculos
}
```

## ⚡ Optimizaciones Propuestas

### 1. Virtualización de Días
- **Problema**: Carga todos los días en memoria (puede ser 1000+ días)
- **Solución**: Virtualizar con `react-window`
- **Beneficio**: Reducción de 80-90% en memoria y tiempo de render

### 2. Lazy Loading de Calendarios
- **Problema**: N queries para N calendarios
- **Solución**: 
  - Cargar solo calendarios visibles en viewport
  - Prefetch de calendarios adyacentes
  - Cache compartido con React Query

### 3. Memoización Agresiva
- **PhaseTrack**: `React.memo` con comparación personalizada
- **TaskBar**: Memo por tarea
- **GanttCell**: Memo por celda
- **Hooks**: `useMemo` y `useCallback` estratégicos

### 4. Separación de Concerns
- **TimelineState**: Hook para estado
- **TimelineActions**: Hook para acciones
- **TimelineCalculations**: Hook para cálculos
- **TimelineRendering**: Componentes de presentación

### 5. Web Workers para Cálculos Pesados
- Cálculo de días fuera del main thread
- Procesamiento de calendarios en background
- No bloquea la UI

### 6. Code Splitting por Funcionalidad
```typescript
// Lazy load componentes pesados
const TimelineDragDrop = lazy(() => import('./TimelineDragDrop'));
const TimelineContextMenu = lazy(() => import('./TimelineContextMenu'));
const TimelineExport = lazy(() => import('./TimelineExport'));
```

## 📦 Estructura de Archivos Propuesta

```
timeline/
├── TimelineProject.tsx (Container principal)
├── context/
│   ├── TimelineContext.tsx
│   ├── TimelineProvider.tsx
│   └── useTimeline.ts (hook para consumir context)
├── hooks/
│   ├── useTimelineDateRange.ts
│   ├── useTimelinePhases.ts
│   ├── useTimelineDragDrop.ts
│   ├── useTimelineCalendars.ts
│   └── useTimelineVirtualization.ts
├── components/
│   ├── TimelineHeader/
│   │   ├── TimelineToolbar.tsx
│   │   ├── TimelineScale.tsx
│   │   └── TimelineNavigation.tsx
│   ├── TimelineBody/
│   │   ├── TimelineViewport.tsx
│   │   ├── PhaseList.tsx
│   │   └── TimelineGrid.tsx
│   ├── PhaseTrack/
│   │   ├── PhaseTrack.tsx
│   │   ├── PhaseBar.tsx
│   │   └── PhaseResizeHandles.tsx
│   ├── TaskTrack/
│   │   ├── TaskTrack.tsx
│   │   └── TaskBar.tsx
│   └── TimelineOverlay/
│       ├── DragPreview.tsx
│       ├── SelectionOverlay.tsx
│       └── ContextMenu.tsx
├── utils/
│   ├── dateCalculations.ts
│   ├── phaseCalculations.ts
│   └── virtualization.ts
└── types/
    └── timeline.types.ts
```

## 🔄 Plan de Migración

### Fase 1: Preparación (1-2 días)
1. Crear estructura de carpetas
2. Extraer tipos e interfaces
3. Crear TimelineContext y Provider básico

### Fase 2: Refactorización Core (3-5 días)
1. Extraer hooks de estado y acciones
2. Crear TimelineViewport con virtualización
3. Refactorizar PhaseTrack como componente independiente

### Fase 3: Optimización (2-3 días)
1. Implementar virtualización de días
2. Optimizar carga de calendarios
3. Agregar memoización estratégica

### Fase 4: Testing y Ajustes (2-3 días)
1. Tests unitarios de componentes
2. Tests de integración
3. Ajustes de rendimiento

## 📈 Métricas Esperadas

- **Tiempo de carga inicial**: Reducción del 60-70%
- **Memoria**: Reducción del 70-80%
- **Re-renders**: Reducción del 80-90%
- **Tiempo de interacción**: Mejora del 50-60%

## 🎨 API Propuesta

```typescript
<TimelineProject
  startDate="2024-01-01"
  endDate="2024-12-31"
  phases={phases}
  tasks={tasks}
  onPhaseChange={(phaseId, updates) => {
    // Manejo de cambios
  }}
  onPhaseMove={(phaseId, startDate, endDate) => {
    // Manejo de movimiento
  }}
  config={{
    pxPerDay: 2,
    trackHeight: 40,
    showTodayMarker: true,
    enableDragDrop: true,
  }}
/>
```

## 🔍 Consideraciones Adicionales

1. **Accesibilidad**: ARIA labels, navegación por teclado
2. **Responsive**: Adaptación a diferentes tamaños de pantalla
3. **Exportación**: PDF, Excel, imagen
4. **Undo/Redo**: Historial de cambios
5. **Colaboración**: Sincronización en tiempo real (futuro)

