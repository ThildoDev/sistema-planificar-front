<template>
  <div class="table-card">
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Área</th>
            <th>Tipo</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th class="text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(plan, index) in planificaciones" :key="plan.id">
            <td class="td-index">{{ index + 1 }}</td>
            <td class="td-area">{{ plan.area || plan.area_curricular }}</td>
            <td>{{ plan.tipo }}</td>
            <td class="td-date">{{ formatFecha(plan.fecha || plan.created_at) }}</td>
            <td>
              <StatusBadgeAnual :estado="plan.estados_anual" />
            </td>
            <td class="td-actions flex-end">
              <!-- Ver: Común para todos -->
              <button
                class="action-btn btn-view"
                title="Ver Planificación"
                @click="$emit('action', { type: 'ver', plan })"
              >
                <Eye :size="15" />
              </button>

              <!-- Editar/Eliminar: Solo si está Pendiente u Observado -->
              <button
                v-if="plan.estados_anual === 'Pendiente' || plan.estados_anual === 'Observado' || plan.estados_anual === 'A corregir'"
                class="action-btn btn-edit"
                title="Editar"
                @click="$emit('action', { type: 'editar', plan })"
              >
                <Edit3 :size="15" />
              </button>

              <button
                v-if="plan.estados_anual === 'Pendiente'"
                class="action-btn btn-delete"
                title="Eliminar"
                @click="$emit('action', { type: 'eliminar', plan })"
              >
                <Trash2 :size="15" />
              </button>

              <!-- Ver Obs: Solo si está Observado/A corregir -->
              <button
                v-if="plan.estados_anual === 'Observado' || plan.estados_anual === 'A corregir'"
                class="action-btn btn-obs"
                title="Ver Observaciones"
                @click="$emit('action', { type: 'ver-obs', plan })"
              >
                <MessageSquare :size="15" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { Eye, Edit3, Trash2, MessageSquare } from 'lucide-vue-next'
import StatusBadgeAnual from './StatusBadgeAnual.vue'

defineProps({
  planificaciones: { type: Array, required: true }
})

defineEmits(['action'])

const formatFecha = (fechaString) => {
  if (!fechaString) return '-'
  const date = new Date(fechaString)
  return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
</script>

<style scoped>
/* Acoplado al diseño de tu UsuariosTable.vue */
.table-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}
.table-wrapper { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
.data-table thead tr { background: #f8fafc; border-bottom: 2px solid #e2e8f0; }
.data-table th { padding: 0.75rem 1rem; text-align: left; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; }
.data-table td { padding: 0.875rem 1rem; border-bottom: 1px solid #f1f5f9; color: #374151; vertical-align: middle; }
.data-table tbody tr:hover { background: #fafafa; }
.td-index { color: #94a3b8; font-size: 0.8125rem; width: 48px; }
.td-area { font-weight: 600; color: #0f172a; }
.td-date { color: #64748b; font-size: 0.8125rem; }
.td-actions { display: flex; gap: 0.375rem; }
.flex-end { justify-content: flex-end; }

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: #64748b;
}
.btn-view:hover { background: #eff6ff; border-color: #bfdbfe; color: #1d4ed8; }
.btn-edit:hover { background: #ede9fe; border-color: #a78bfa; color: #5b21b6; }
.btn-delete:hover { background: #fef2f2; border-color: #fecaca; color: #dc2626; }
.btn-obs:hover { background: #fef3c7; border-color: #fcd34d; color: #92400e; }
</style>
