<template>
  <div class="table-wrapper">
    <table class="planif-table">
      <thead>
        <tr>
          <th class="col-num">#</th>
          <th>Área Curricular</th>
          <th>Tipo</th>
          <th>Fecha</th>
          <th>Estado</th>
          <th class="col-actions">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(plan, index) in planificaciones" :key="plan.id" class="table-row">
          <td class="col-num text-muted">{{ index + 1 }}</td>
          <td>
            <div class="area-cell">
              <BookOpen :size="14" class="area-icon" />
              <span>{{ plan.area_curricular }}</span>
            </div>
          </td>
          <td>
            <span class="tipo-tag" :class="plan.tipo_planificacion === 'Anual' ? 'tipo-anual' : 'tipo-trimestral'">
              {{ plan.tipo_planificacion }}
            </span>
          </td>
          <td class="text-muted">
            <div class="date-cell">
              <Calendar :size="13" />
              <span>{{ formatDate(plan.fecha_presentacion) }}</span>
            </div>
          </td>
          <td>
            <StatusBadgeAnual :estado="plan.estado" />
          </td>
          <td class="col-actions">
            <div class="actions-group">
              <!-- Ver: siempre visible -->
              <button
                class="action-btn action-btn--view"
                title="Ver planificación"
                @click="handleAction('ver', plan)"
              >
                <Eye :size="14" />
              </button>

              <!-- Editar: solo si estado permite edición -->
              <button
                v-if="plan.estado === 'Pendiente' || plan.estado === 'A Corregir' || plan.estado === 'Rechazado'"
                class="action-btn action-btn--edit"
                title="Editar planificación"
                @click="handleAction('editar', plan)"
              >
                <Pencil :size="14" />
              </button>

              <!-- Eliminar: solo si Pendiente -->
              <button
                v-if="plan.estado === 'Pendiente'"
                class="action-btn action-btn--delete"
                title="Eliminar planificación"
                @click="handleAction('eliminar', plan)"
              >
                <Trash2 :size="14" />
              </button>

              <!-- Ver Observaciones: si A Corregir o Rechazado -->
              <button
                v-if="plan.estado === 'A Corregir' || plan.estado === 'Rechazado'"
                class="action-btn action-btn--obs"
                title="Ver observaciones del directivo"
                @click="handleAction('observaciones', plan)"
              >
                <MessageSquare :size="14" />
                <span class="obs-label">Ver Obs.</span>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { Eye, Pencil, Trash2, MessageSquare, BookOpen, Calendar } from 'lucide-vue-next'
import StatusBadgeAnual from './StatusBadgeAnual.vue'

defineProps({
  planificaciones: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['action'])

function handleAction(tipo, plan) {
  console.log(`[Acción] ${tipo} - ID: ${plan.id}`, plan)
  emit('action', { tipo, plan })
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.table-wrapper {
  overflow-x: auto;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.planif-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  background: #ffffff;
}

.planif-table thead {
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
}

.planif-table th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: #64748b;
  white-space: nowrap;
}

.planif-table td {
  padding: 0.85rem 1rem;
  color: #1a202c;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.table-row:last-child td {
  border-bottom: none;
}

.table-row:hover td {
  background: #f8fafc;
}

.col-num {
  width: 48px;
  text-align: center;
}

.col-actions {
  width: 160px;
  text-align: right;
}

.text-muted {
  color: #64748b;
}

.area-cell {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 500;
}

.area-icon {
  color: #94a3b8;
  flex-shrink: 0;
}

.date-cell {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.82rem;
}

.tipo-tag {
  display: inline-block;
  padding: 0.2rem 0.55rem;
  border-radius: 5px;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.03em;
}

.tipo-anual {
  background: #dbeafe;
  color: #1d4ed8;
}

.tipo-trimestral {
  background: #f3e8ff;
  color: #7c3aed;
}

/* Action buttons */
.actions-group {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.35rem;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.35rem 0.55rem;
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 500;
  transition: background 0.15s, color 0.15s, border-color 0.15s, transform 0.1s;
  background: transparent;
}

.action-btn:hover {
  transform: translateY(-1px);
}

.action-btn--view {
  color: #3b82f6;
  border-color: #bfdbfe;
  background: #eff6ff;
}

.action-btn--view:hover {
  background: #dbeafe;
}

.action-btn--edit {
  color: #d97706;
  border-color: #fde68a;
  background: #fffbeb;
}

.action-btn--edit:hover {
  background: #fef3c7;
}

.action-btn--delete {
  color: #dc2626;
  border-color: #fecaca;
  background: #fff1f2;
}

.action-btn--delete:hover {
  background: #fee2e2;
}

.action-btn--obs {
  color: #7c3aed;
  border-color: #ddd6fe;
  background: #f5f3ff;
}

.action-btn--obs:hover {
  background: #ede9fe;
}

.obs-label {
  font-size: 0.72rem;
}
</style>
