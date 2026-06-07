<!-- src/components/director/PlanificacionesRecibidasTable.vue -->
<template>
  <div class="tabla-wrapper">
    <!-- Estado de carga -->
    <div v-if="loading" class="estado-loading">
      <div class="spinner" />
      <span>Cargando planificaciones...</span>
    </div>

    <!-- Sin resultados -->
    <div v-else-if="!planificaciones.length" class="estado-vacio">
      <ClipboardList class="vacio-icon" />
      <p class="vacio-texto">No hay planificaciones para mostrar</p>
      <p class="vacio-sub">Ajusta los filtros o espera nuevas presentaciones</p>
    </div>

    <!-- Tabla -->
    <div v-else class="tabla-scroll">
      <table class="tabla">
        <thead>
          <tr>
            <th>#</th>
            <th>Docente</th>
            <th v-if="!compact">Curso</th>
            <th>Área</th>
            <th>Tipo</th>
            <th>Presentación</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="plan in planificaciones" :key="plan.id" class="tabla-fila">
            <!-- ID -->
            <td class="celda-id">{{ plan.id }}</td>

            <!-- Docente -->
            <td class="celda-docente">
              <div class="docente-info">
                <span class="docente-nombre">{{ getNombreDocente(plan) }}</span>
                <span v-if="!compact" class="docente-cargo">
                  {{ getCargoDocente(plan) }}
                </span>
              </div>
            </td>

            <!-- Curso (solo en modo completo) -->
            <td v-if="!compact" class="celda-curso">
              {{ getCurso(plan) }}
            </td>

            <!-- Área -->
            <td class="celda-area">
              <span class="badge-area">{{ plan.area?.area || '—' }}</span>
            </td>

            <!-- Tipo -->
            <td class="celda-tipo">
              <span
                class="badge-tipo"
                :class="`badge-tipo--${plan.tipo_planificacion?.toLowerCase()}`"
              >
                {{ plan.tipo_planificacion || '—' }}
              </span>
            </td>

            <!-- Fecha presentación -->
            <td class="celda-fecha">
              {{ formatFecha(plan.fecha_presentacion) }}
            </td>

            <!-- Estado -->
            <td class="celda-estado">
              <EstadoBadge :estado="getUltimoEstado(plan)" />
            </td>

            <!-- Acciones -->
            <td class="celda-acciones">
              <button
                class="btn-revisar"
                title="Revisar planificación"
                @click="$emit('revisar', plan.id)"
              >
                <Eye class="btn-icon" />
                <span v-if="!compact">Revisar</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ClipboardList, Eye } from 'lucide-vue-next'
import EstadoBadge from '@/components/shared/EstadoBadge.vue'

const props = defineProps({
  planificaciones: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  /** Modo compacto: oculta columnas secundarias */
  compact: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['revisar'])

// ── Helpers de datos ──

function getNombreDocente(plan) {
  const persona = plan.persona_cargo_cursado?.persona_cargo?.persona
  if (!persona) return '—'
  return `${persona.apellidos || ''}, ${persona.nombres || ''}`.trim()
}

function getCargoDocente(plan) {
  return plan.persona_cargo_cursado?.persona_cargo?.cargo?.cargo || '—'
}

function getCurso(plan) {
  const cursado = plan.persona_cargo_cursado?.cursado
  if (!cursado?.curso) return '—'
  const { grado, seccion, turno } = cursado.curso
  return `${grado || ''} ${seccion || ''} — ${turno || ''}`.trim()
}

function getUltimoEstado(plan) {
  const estados = plan.estados_anual || []
  if (!estados.length) return null
  return [...estados].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0]?.estado
}

function formatFecha(fecha) {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
</script>

<style scoped>
.tabla-wrapper {
  width: 100%;
}

/* Estados de UI */
.estado-loading,
.estado-vacio {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 3rem;
  color: #94a3b8;
}

.spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid #e2e8f0;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.vacio-icon {
  width: 3rem;
  height: 3rem;
  color: #cbd5e1;
}

.vacio-texto {
  font-size: 1rem;
  font-weight: 500;
  color: #475569;
  margin: 0;
}

.vacio-sub {
  font-size: 0.875rem;
  color: #94a3b8;
  margin: 0;
}

/* Tabla */
.tabla-scroll {
  overflow-x: auto;
}

.tabla {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.tabla thead tr {
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
}

.tabla th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  color: #475569;
  white-space: nowrap;
}

.tabla-fila {
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.1s;
}

.tabla-fila:hover {
  background: #f8fafc;
}

.tabla td {
  padding: 0.75rem 1rem;
  color: #1e293b;
  vertical-align: middle;
}

/* Celdas específicas */
.celda-id {
  font-variant-numeric: tabular-nums;
  color: #94a3b8;
  font-size: 0.8125rem;
}

.docente-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.docente-nombre {
  font-weight: 500;
}

.docente-cargo {
  font-size: 0.75rem;
  color: #94a3b8;
}

.badge-area {
  background: #ede9fe;
  color: #7c3aed;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge-tipo {
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge-tipo--anual {
  background: #dbeafe;
  color: #1d4ed8;
}

.badge-tipo--trimestral {
  background: #fef3c7;
  color: #b45309;
}

.celda-fecha {
  white-space: nowrap;
  color: #64748b;
  font-size: 0.8125rem;
}

/* Botón revisar */
.btn-revisar {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
}

.btn-revisar:hover {
  background: #4f46e5;
}

.btn-icon {
  width: 0.875rem;
  height: 0.875rem;
}
</style>
