<!-- src/components/director/HistorialEstados.vue -->
<template>
  <div class="historial-wrapper">
    <div class="historial-header">
      <Clock class="historial-icon" />
      <h3 class="historial-titulo">Historial de estados</h3>
    </div>

    <!-- Sin historial -->
    <div v-if="!estados.length" class="historial-vacio">
      <p>Sin historial registrado</p>
    </div>

    <!-- Timeline -->
    <ol v-else class="timeline">
      <li
        v-for="(estado, index) in estadosOrdenados"
        :key="estado.id"
        class="timeline-item"
        :class="{ 'timeline-item--activo': index === 0 }"
      >
        <!-- Punto del timeline -->
        <div class="timeline-punto" :class="`punto--${getClaseEstado(estado.estado)}`">
          <component :is="getIconoEstado(estado.estado)" class="punto-icon" />
        </div>

        <!-- Línea de conexión (excepto el último) -->
        <div v-if="index < estadosOrdenados.length - 1" class="timeline-linea" />

        <!-- Contenido -->
        <div class="timeline-contenido">
          <div class="timeline-estado">
            <span class="estado-texto" :class="`estado-texto--${getClaseEstado(estado.estado)}`">
              {{ estado.estado }}
            </span>
            <span v-if="index === 0" class="tag-actual">Actual</span>
          </div>
          <time class="timeline-fecha">
            {{ formatFechaDetallada(estado.fecha) }}
          </time>
        </div>
      </li>
    </ol>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Archive,
  Hourglass,
  RefreshCw,
  FileCheck,
  Ban,
} from 'lucide-vue-next'

const props = defineProps({
  estados: {
    type: Array,
    default: () => [],
  },
})

// Ordenar de más reciente a más antiguo
const estadosOrdenados = computed(() =>
  [...props.estados].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)),
)

function getClaseEstado(estado) {
  const mapa = {
    Pendiente: 'pendiente',
    'En Proceso': 'en-proceso',
    Revisado: 'revisado',
    Aprobado: 'aprobado',
    Rechazado: 'rechazado',
    Archivado: 'archivado',
    Cancelado: 'cancelado',
    'En Espera': 'en-espera',
    Finalizado: 'finalizado',
  }
  return mapa[estado] || 'default'
}

function getIconoEstado(estado) {
  const iconos = {
    Pendiente: Clock,
    'En Proceso': RefreshCw,
    Revisado: FileCheck,
    Aprobado: CheckCircle,
    Rechazado: XCircle,
    Archivado: Archive,
    Cancelado: Ban,
    'En Espera': Hourglass,
    Finalizado: CheckCircle,
  }
  return iconos[estado] || AlertCircle
}

function formatFechaDetallada(fecha) {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<style scoped>
.historial-wrapper {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.historial-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  padding-bottom: 0.875rem;
  border-bottom: 1px solid #f1f5f9;
}

.historial-icon {
  width: 1.1rem;
  height: 1.1rem;
  color: #6366f1;
}

.historial-titulo {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.historial-vacio {
  text-align: center;
  color: #94a3b8;
  font-size: 0.875rem;
  padding: 1.5rem 0;
}

/* Timeline */
.timeline {
  list-style: none;
  margin: 0;
  padding: 0;
  position: relative;
}

.timeline-item {
  display: flex;
  gap: 1rem;
  position: relative;
  padding-bottom: 1.25rem;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

/* Punto del estado */
.timeline-punto {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.punto-icon {
  width: 1rem;
  height: 1rem;
}

/* Colores de puntos */
.punto--pendiente {
  background: #fef9c3;
  color: #854d0e;
}
.punto--en-proceso {
  background: #dbeafe;
  color: #1e40af;
}
.punto--revisado {
  background: #e0e7ff;
  color: #3730a3;
}
.punto--aprobado {
  background: #dcfce7;
  color: #166534;
}
.punto--rechazado {
  background: #fee2e2;
  color: #991b1b;
}
.punto--archivado {
  background: #f1f5f9;
  color: #475569;
}
.punto--cancelado {
  background: #fce7f3;
  color: #9d174d;
}
.punto--en-espera {
  background: #fff7ed;
  color: #9a3412;
}
.punto--finalizado {
  background: #f0fdf4;
  color: #065f46;
}
.punto--default {
  background: #f1f5f9;
  color: #94a3b8;
}

/* Línea de conexión */
.timeline-linea {
  position: absolute;
  left: 1rem; /* centro del punto (2rem / 2) */
  top: 2rem;
  width: 2px;
  height: calc(100% - 2rem);
  background: #e2e8f0;
  transform: translateX(-50%);
}

/* Contenido del item */
.timeline-contenido {
  flex: 1;
  padding-top: 0.3rem;
}

.timeline-estado {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.estado-texto {
  font-size: 0.9rem;
  font-weight: 600;
}

/* Colores del texto de estado */
.estado-texto--pendiente {
  color: #854d0e;
}
.estado-texto--en-proceso {
  color: #1e40af;
}
.estado-texto--revisado {
  color: #3730a3;
}
.estado-texto--aprobado {
  color: #166534;
}
.estado-texto--rechazado {
  color: #991b1b;
}
.estado-texto--archivado {
  color: #475569;
}
.estado-texto--cancelado {
  color: #9d174d;
}
.estado-texto--en-espera {
  color: #9a3412;
}
.estado-texto--finalizado {
  color: #065f46;
}
.estado-texto--default {
  color: #64748b;
}

.tag-actual {
  font-size: 0.7rem;
  padding: 0.1rem 0.4rem;
  background: #6366f1;
  color: #fff;
  border-radius: 9999px;
  font-weight: 600;
}

.timeline-fecha {
  display: block;
  font-size: 0.75rem;
  color: #94a3b8;
  margin-top: 0.2rem;
}

/* Item activo (el más reciente) */
.timeline-item--activo .timeline-punto {
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15);
}
</style>
