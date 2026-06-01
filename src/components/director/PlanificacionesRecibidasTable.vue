<template>
  <div class="table-card">
    <div v-if="loading" class="table-loading">
      <Loader2 :size="28" class="spinning" />
      <span>Cargando planificaciones...</span>
    </div>

    <div v-else-if="planificacionesFiltradas.length === 0" class="empty-state">
      <FileText :size="40" color="#cbd5e1" />
      <p>No se encontraron planificaciones con los filtros aplicados.</p>
    </div>

    <div v-else class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Docente</th>
            <th>Área / Curso</th>
            <th>Tipo</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(plan, idx) in planificacionesFiltradas" :key="plan.id">
            <td class="td-index">{{ idx + 1 }}</td>

            <td class="td-docente">
              <div class="docente-avatar">
                {{ getInitials(plan.persona?.apellidos) }}
              </div>
              <div>
                <p class="docente-name">
                  {{ plan.persona?.apellidos }}, {{ plan.persona?.nombres }}
                </p>
                <p class="docente-cargo">{{ plan.cargo?.cargo }}</p>
              </div>
            </td>

            <td class="td-area">
              <p class="area-name">{{ plan.area?.area }}</p>
              <p class="area-tipo">{{ plan.area?.tipo }}</p>
            </td>

            <td>
              <span class="tipo-badge">{{ plan.tipo_planificacion }}</span>
            </td>

            <td class="td-fecha">
              {{ formatFecha(plan.fecha_presentacion) }}
            </td>

            <td>
              <EstadoBadge :estado="getUltimoEstado(plan)?.estado" />
            </td>

            <td class="td-accion">
              <router-link
                v-if="getUltimoEstado(plan)?.estado === 'Revisado'"
                :to="{ name: 'RevisionPlanificacion', params: { id: plan.id } }"
                class="btn-revisar"
              >
                <ClipboardCheck :size="14" /> Revisar
              </router-link>
              <router-link
                v-else
                :to="{ name: 'RevisionPlanificacion', params: { id: plan.id } }"
                class="btn-ver"
              >
                <Eye :size="14" /> Ver
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="!loading && planificacionesFiltradas.length > 0" class="table-footer">
      Mostrando {{ planificacionesFiltradas.length }} de {{ totalPlanificaciones }} planificaciones
    </div>
  </div>
</template>

<script setup>
import { Loader2, FileText, Eye, ClipboardCheck } from 'lucide-vue-next'
import { useRevision } from '@/composables/useRevision'
import EstadoBadge from '@/components/director/EstadoBadge.vue'

const { planificacionesFiltradas, totalPlanificaciones, loading, getUltimoEstado } = useRevision()

const getInitials = (str = '') =>
  str
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

const formatFecha = (fecha) => {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
</script>

<style scoped>
.table-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.table-loading,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 3rem;
  color: #94a3b8;
  font-size: 0.875rem;
}

.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.data-table thead tr {
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
}

.data-table th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
  white-space: nowrap;
}

.data-table td {
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.data-table tbody tr:hover {
  background: #fafafa;
}
.data-table tbody tr:last-child td {
  border-bottom: none;
}

.td-index {
  color: #94a3b8;
  width: 40px;
}

.td-docente {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  min-width: 180px;
}
.docente-avatar {
  width: 34px;
  height: 34px;
  background: #ede9fe;
  color: #5b21b6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
}
.docente-name {
  font-weight: 600;
  color: #0f172a;
  font-size: 0.875rem;
}
.docente-cargo {
  font-size: 0.75rem;
  color: #94a3b8;
}

.area-name {
  font-weight: 600;
  color: #0f172a;
  font-size: 0.875rem;
}
.area-tipo {
  font-size: 0.75rem;
  color: #64748b;
}

.tipo-badge {
  display: inline-flex;
  padding: 0.25rem 0.625rem;
  background: #f1f5f9;
  color: #475569;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.td-fecha {
  color: #64748b;
  white-space: nowrap;
  font-size: 0.8125rem;
}

.btn-revisar,
.btn-ver {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.4rem 0.875rem;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-revisar {
  background: #2563eb;
  color: #fff;
}
.btn-revisar:hover {
  background: #1d4ed8;
}

.btn-ver {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
}
.btn-ver:hover {
  background: #e2e8f0;
}

.table-footer {
  padding: 0.75rem 1.25rem;
  font-size: 0.8125rem;
  color: #94a3b8;
  border-top: 1px solid #f1f5f9;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.spinning {
  animation: spin 0.8s linear infinite;
}
</style>
