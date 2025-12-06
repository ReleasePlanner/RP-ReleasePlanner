# Resumen de Archivos Markdown Movidos

Este documento resume la reorganización de todos los archivos `.md` del proyecto hacia la carpeta `docs`.

## Estructura de Organización

### 📁 docs/root/

Archivos de análisis y documentación general del proyecto:

- `AGENTS.md`
- `ANALISIS_OPTIMIZACION_RELEASE_PLANNER.md`
- `ANALISIS_REFACTORIZACION_RELEASE_PLAN.md`
- `ANALISIS_REFACTORIZACION_TIMELINE.md`
- `DEBUG_RESCHEDULE.md`
- `IMPLEMENTACION_TIMELINE_OPTIMIZADO.md`
- `OPTIMIZACIONES_ADICIONALES_PROPUESTAS.md`
- `OPTIMIZACIONES_APLICADAS_GANTTCHART.md`
- `OPTIMIZACIONES_AVANZADAS_IMPLEMENTADAS.md`
- `OPTIMIZACIONES_FINALES_IMPLEMENTADAS.md`
- `PROGRESS_BAR_IMPLEMENTACION.md`
- `PROPUESTA_REFACTORIZACION_TIMELINE.md`
- `RESCHEDULE_ATOMICO_IMPLEMENTACION.md`
- `RESUMEN_COMPLETO_OPTIMIZACIONES.md`
- `RESUMEN_OPTIMIZACIONES_FINALES.md`
- `VERIFICACION_RESCHEDULES.md`

### 📁 docs/apps/api/

Documentación de la API:

- `constants-README.md` (desde `apps/api/src/common/constants/README.md`)
- `migrations-README.md` (desde `apps/api/src/migrations/README.md`)

### 📁 docs/apps/portal/

Documentación del Portal:

- `builders-README.md` (desde `apps/portal/src/builders/README.md`)
- `constants-README.md` (desde `apps/portal/src/constants/README.md`)
- `gantt-chart-README.md` (desde `apps/portal/src/features/releasePlans/components/GanttChart/README.md`)
- `gantt-timeline-README.md` (desde `apps/portal/src/features/releasePlans/components/Gantt/GanttTimeline/README.md`)
- `logging-implementation-summary.md` (desde `apps/portal/src/utils/logging/IMPLEMENTATION_SUMMARY.md`)
- `logging-README.md` (desde `apps/portal/src/utils/logging/README.md`)
- `logging-usage.md` (desde `apps/portal/src/utils/logging/USAGE.md`)
- `phase-README.md` (desde `apps/portal/src/features/releasePlans/components/Phase/README.md`)
- `release-plans-refactoring-summary.md` (desde `apps/portal/src/features/releasePlans/REFACTORING_SUMMARY.md`)
- `timeline-README.md` (desde `apps/portal/src/features/releasePlans/components/timeline/README.md`)

### 📁 docs/libs/

Documentación de librerías compartidas:

- `api-common-README.md` (desde `libs/api/common/README.md`)
- `rp-shared-CHANGELOG.md` (desde `libs/rp-shared/CHANGELOG.md`)
- `rp-shared-MIGRATION.md` (desde `libs/rp-shared/MIGRATION.md`)
- `rp-shared-README.md` (desde `libs/rp-shared/README.md`)
- `shared-types-README.md` (desde `libs/shared/types/README.md`)
- `shared-utils-README.md` (desde `libs/shared/utils/README.md`)

### 📁 docs/scripts/

Documentación de scripts:

- `README-remove-duplicates.md` (desde `scripts/README-remove-duplicates.md`)

## Archivos que NO se movieron

- `README.md` en la raíz del proyecto (README principal del proyecto)
- Archivos `.md` en `.github/` (templates de GitHub)
- Archivos `.md` en carpetas `node_modules/`, `dist/`, `coverage/`, `.nx/` (archivos generados o de dependencias)
- Archivos `.md` en `libs/rp-shared/dist/` (archivos generados)

## Notas

- Todos los archivos mantienen su contenido original
- Los nombres se ajustaron ligeramente para evitar conflictos y mejorar la organización
- La estructura existente en `docs/` se mantuvo intacta
- Los archivos de documentación técnica ahora están centralizados en `docs/`
