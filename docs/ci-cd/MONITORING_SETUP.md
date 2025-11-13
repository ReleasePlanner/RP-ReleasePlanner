# Configuración de Monitoreo

Este documento describe la configuración completa de monitoreo implementada para el proyecto Release Planner.

## 📊 Stack de Monitoreo

### Componentes Implementados

1. **Prometheus** - Recolector y almacén de métricas
2. **Grafana** - Visualización de métricas y dashboards
3. **PostgreSQL Exporter** - Exporta métricas de PostgreSQL
4. **Redis Exporter** - Exporta métricas de Redis
5. **Node Exporter** - Métricas del sistema
6. **Prometheus Client (NestJS)** - Métricas de la API

## 🚀 Inicio Rápido

### Desarrollo Local

```bash
# Iniciar servicios principales + monitoreo
docker-compose -f docker-compose.yml -f docker-compose.monitoring.yml up -d

# Ver logs
docker-compose -f docker-compose.yml -f docker-compose.monitoring.yml logs -f
```

### Acceso a Herramientas

- **Grafana**: http://localhost:3001
  - Usuario: `admin` (por defecto)
  - Contraseña: `admin` (por defecto, cambiar en producción)
- **Prometheus**: http://localhost:9090
- **API Metrics**: http://localhost:3000/api/metrics
- **PostgreSQL Exporter**: http://localhost:9187/metrics
- **Redis Exporter**: http://localhost:9121/metrics
- **Node Exporter**: http://localhost:9100/metrics

## 📁 Estructura de Archivos

```
monitoring/
├── prometheus/
│   ├── prometheus.yml      # Configuración de Prometheus
│   └── alerts.yml          # Reglas de alertas
├── grafana/
│   ├── provisioning/
│   │   ├── datasources/    # Configuración de datasources
│   │   └── dashboards/     # Configuración de dashboards
│   └── dashboards/         # Dashboards JSON
│       ├── api-overview.json
│       ├── postgresql-overview.json
│       └── system-overview.json
└── README.md               # Documentación detallada
```

## 🔧 Configuración en Dockerfiles

### Docker Compose Labels

Todos los servicios incluyen labels para Prometheus service discovery:

```yaml
labels:
  - "prometheus.scrape=true"
  - "prometheus.port=3000"
  - "prometheus.path=/api/metrics"
```

### Health Checks

Todos los servicios incluyen health checks para monitoreo:

```yaml
healthcheck:
  test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/api/metrics"]
  interval: 30s
  timeout: 10s
  retries: 3
```

## 📈 Métricas Implementadas

### API Metrics (NestJS)

- `http_requests_total`: Total de requests HTTP
- `http_request_duration_seconds`: Duración de requests
- `nodejs_heap_size_total_bytes`: Tamaño del heap
- `nodejs_heap_size_used_bytes`: Memoria usada del heap
- `nodejs_eventloop_lag_seconds`: Lag del event loop

**Endpoint**: `/api/metrics`

### PostgreSQL Metrics

- `pg_stat_database_numbackends`: Conexiones activas
- `pg_database_size_bytes`: Tamaño de la base de datos
- `pg_stat_database_xact_commit`: Transacciones commit
- `pg_stat_database_xact_rollback`: Transacciones rollback
- `pg_stat_database_tup_*`: Operaciones de tuplas

**Exporter**: `postgres-exporter:9187`

### Redis Metrics

- `redis_memory_used_bytes`: Memoria usada
- `redis_memory_max_bytes`: Memoria máxima
- `redis_commands_processed_total`: Comandos procesados
- `redis_connected_clients`: Clientes conectados
- `redis_keyspace_hits_total`: Cache hits
- `redis_keyspace_misses_total`: Cache misses

**Exporter**: `redis-exporter:9121`

### System Metrics

- `node_cpu_seconds_total`: Uso de CPU
- `node_memory_*`: Uso de memoria
- `node_filesystem_*`: Uso de disco
- `node_network_*`: Tráfico de red

**Exporter**: `node-exporter:9100`

## 📊 Dashboards Disponibles

### 1. API Overview
- Request rate por método y ruta
- Tiempo de respuesta (percentiles)
- Tasa de errores (4xx, 5xx)
- Estado de la API

### 2. PostgreSQL Overview
- Conexiones activas
- Tamaño de base de datos
- Transacciones por segundo
- Performance de queries

### 3. System Overview
- CPU usage
- Memory usage
- Disk usage
- Network traffic

## 🚨 Alertas Configuradas

Las alertas están definidas en `monitoring/prometheus/alerts.yml`:

### API Alerts
- **APIDown**: API no responde por más de 1 minuto
- **APIHighResponseTime**: Tiempo de respuesta > 2s por más de 5 minutos
- **APIHighErrorRate**: Tasa de errores > 10% por más de 5 minutos

### PostgreSQL Alerts
- **PostgreSQLDown**: PostgreSQL no responde por más de 1 minuto
- **PostgreSQLHighConnections**: > 80 conexiones por más de 5 minutos
- **PostgreSQLHighDiskUsage**: Base de datos > 50GB por más de 5 minutos

### Redis Alerts
- **RedisDown**: Redis no responde por más de 1 minuto
- **RedisHighMemoryUsage**: Uso de memoria > 90% por más de 5 minutos

### System Alerts
- **HighCPUUsage**: Uso de CPU > 80% por más de 5 minutos
- **HighMemoryUsage**: Uso de memoria > 85% por más de 5 minutos
- **HighDiskUsage**: Uso de disco > 85% por más de 5 minutos

## 🔍 Integración en la API

### Módulo Prometheus

```typescript
// apps/api/src/common/metrics/prometheus.module.ts
@Module({
  imports: [
    NestPrometheusModule.register({
      defaultMetrics: {
        enabled: true,
        config: {
          prefix: 'release_planner_',
        },
      },
    }),
  ],
  controllers: [MetricsController],
})
export class PrometheusMetricsModule {}
```

### Controller de Métricas

```typescript
// apps/api/src/common/metrics/metrics.controller.ts
@Controller('metrics')
export class MetricsController {
  @Get()
  @Public()
  async getMetrics(): Promise<string> {
    return register.metrics();
  }
}
```

### Registro en AppModule

```typescript
// apps/api/src/app/app.module.ts
imports: [
  // ...
  PrometheusMetricsModule,
  // ...
]
```

## 🐳 Docker Compose

### Servicios de Monitoreo

```yaml
services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - ./monitoring/prometheus/alerts.yml:/etc/prometheus/alerts.yml:ro
      - prometheus_data:/prometheus

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana/provisioning:/etc/grafana/provisioning:ro
      - ./monitoring/grafana/dashboards:/var/lib/grafana/dashboards:ro

  postgres-exporter:
    image: prometheuscommunity/postgres-exporter:latest
    ports:
      - "9187:9187"

  redis-exporter:
    image: oliver006/redis_exporter:latest
    ports:
      - "9121:9121"

  node-exporter:
    image: prom/node-exporter:latest
    ports:
      - "9100:9100"
```

## 📚 Variables de Entorno

```env
# Grafana
GRAFANA_USER=admin
GRAFANA_PASSWORD=admin
GRAFANA_SECRET_KEY=changeme

# PostgreSQL (para exporter)
POSTGRES_USER=releaseplanner
POSTGRES_PASSWORD=releaseplanner123
POSTGRES_DB=releaseplanner
```

## ✅ Verificación

### Verificar que Prometheus está recolectando métricas

```bash
# Verificar targets
curl http://localhost:9090/api/v1/targets

# Verificar métricas de la API
curl http://localhost:3000/api/metrics

# Verificar métricas de PostgreSQL
curl http://localhost:9187/metrics
```

### Verificar que Grafana está funcionando

```bash
# Verificar salud de Grafana
curl http://localhost:3001/api/health

# Verificar datasources
curl -u admin:admin http://localhost:3001/api/datasources
```

## 🛠️ Troubleshooting

### Prometheus no recolecta métricas

1. Verificar que los servicios estén corriendo:
   ```bash
   docker-compose ps
   ```

2. Verificar conectividad:
   ```bash
   curl http://localhost:3000/api/metrics
   curl http://localhost:9187/metrics
   ```

3. Verificar logs de Prometheus:
   ```bash
   docker-compose logs prometheus
   ```

### Grafana no muestra datos

1. Verificar que Prometheus esté configurado como datasource
2. Verificar que los dashboards estén cargados
3. Verificar la configuración de time range en Grafana

### PostgreSQL Exporter no funciona

1. Verificar credenciales de PostgreSQL
2. Verificar conectividad desde el exporter:
   ```bash
   docker exec release-planner-postgres-exporter wget -qO- http://localhost:9187/metrics
   ```

## 📖 Recursos Adicionales

- [Documentación completa de monitoreo](./monitoring/README.md)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [PostgreSQL Exporter](https://github.com/prometheus-community/postgres_exporter)
- [Redis Exporter](https://github.com/oliver006/redis_exporter)

