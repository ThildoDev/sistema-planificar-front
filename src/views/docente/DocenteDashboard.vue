<template>
  <div class="dashboard">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h2 class="page-title">Mis Planificaciones</h2>
        <p class="page-subtitle">Gestioná y hacé seguimiento de tus planificaciones pedagógicas.</p>
      </div>
      <RouterLink to="/docente/crear" class="btn-primary">
        <PlusCircle :size="16" />
        Crear Nueva Planificación
      </RouterLink>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-grid">
      <!-- Skeleton KPIs -->
      <template v-if="loading">
        <div v-for="i in 3" :key="i" class="kpi-card skeleton-card">
          <div class="skeleton skeleton-icon"></div>
          <div class="skeleton-content">
            <div class="skeleton skeleton-num"></div>
            <div class="skeleton skeleton-label"></div>
          </div>
        </div>
      </template>
      <!-- Real KPIs -->
      <template v-else>
        <div class="kpi-card kpi-card--total">
          <div class="kpi-icon-wrap kpi-icon--blue">
            <FileText :size="20" />
          </div>
          <div class="kpi-content">
            <span class="kpi-num">{{ totalEntregadas }}</span>
            <span class="kpi-label">Total Entregadas</span>
          </div>
        </div>
        <div class="kpi-card kpi-card--approved">
          <div class="kpi-icon-wrap kpi-icon--green">
            <CheckCircle2 :size="20" />
          </div>
          <div class="kpi-content">
            <span class="kpi-num">{{ totalAprobadas }}</span>
            <span class="kpi-label">Aprobadas</span>
          </div>
        </div>
        <div class="kpi-card kpi-card--pending">
          <div class="kpi-icon-wrap kpi-icon--yellow">
            <Clock :size="20" />
          </div>
          <div class="kpi-content">
            <span class="kpi-num">{{ totalPendientes }}</span>
            <span class="kpi-label">Pendientes de Revisión</span>
          </div>
        </div>
      </template>
    </div>

    <!-- Main Table Section -->
    <div class="section-card">
      <div class="section-header">
        <h3 class="section-title">
          <ClipboardList :size="16" />
          Historial de Planificaciones
        </h3>
        <span v-if="!loading" class="record-count">{{ planificaciones.length }} registros</span>
      </div>

      <!-- Skeleton Table -->
      <template v-if="loading">
        <div class="skeleton-table">
          <div class="skeleton-thead">
            <div v-for="i in 6" :key="i" class="skeleton skeleton-th"></div>
          </div>
          <div v-for="r in 4" :key="r" class="skeleton-row">
            <div v-for="c in 6" :key="c" class="skeleton skeleton-td" :style="{ width: colWidths[c-1] }"></div>
          </div>
        </div>
      </template>

      <!-- Empty State -->
      <template v-else-if="planificaciones.length === 0">
        <div class="empty-state">
          <div class="empty-icon-wrap">
            <FolderOpen :size="48" />
          </div>
          <h4 class="empty-title">Todavía no tenés planificaciones</h4>
          <p class="empty-desc">
            Creá tu primera planificación pedagógica y comenzá a gestionar tus contenidos curriculares.
          </p>
          <RouterLink to="/docente/crear" class="btn-primary">
            <PlusCircle :size="15" />
            Crear mi primera planificación
          </RouterLink>
        </div>
      </template>

      <!-- Table with data -->
      <PlanificacionesTable
        v-else
        :planificaciones="planificaciones"
        @action="handleTableAction"
      />
    </div>

    <!-- Observaciones Modal (inline) -->
    <div v-if="obsModal.visible" class="modal-backdrop" @click.self="closeObs">
      <div class="modal-box">
        <div class="modal-header">
          <div class="modal-title-group">
            <MessageSquare :size="18" />
            <h3>Observaciones del Directivo</h3>
          </div>
          <button class="modal-close" @click="closeObs"><X :size="18" /></button>
        </div>
        <div class="modal-body">
          <div class="obs-meta">
            <span>Plan ID #{{ obsModal.plan?.id }}</span>
            <StatusBadgeAnual :estado="obsModal.plan?.estado" />
          </div>
          <div class="obs-text">
            {{ obsModal.plan?.observaciones_directivo }}
          </div>
        </div>
        <div class="modal-footer">
          <RouterLink :to="`/docente/editar/${obsModal.plan?.id}`" class="btn-primary btn-sm">
            <Pencil :size="14" />
            Ir a Editar
          </RouterLink>
          <button class="btn-secondary" @click="closeObs">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import {
  PlusCircle, FileText, CheckCircle2, Clock, ClipboardList,
  FolderOpen, MessageSquare, X, Pencil
} from 'lucide-vue-next'
import PlanificacionesTable from '@/components/docente/PlanificacionesTable.vue'
import StatusBadgeAnual from '@/components/docente/StatusBadgeAnual.vue'
import { usePlanificacion } from '@/composables/usePlanificacion'

const router = useRouter()
const {
  planificaciones, loading, totalEntregadas, totalAprobadas,
  totalPendientes, deletePlanificacion
} = usePlanificacion(true)

const colWidths = ['40px', '180px', '90px', '110px', '120px', '130px']

const obsModal = reactive({ visible: false, plan: null })

function handleTableAction({ tipo, plan }) {
  if (tipo === 'ver') router.push(`/docente/ver/${plan.id}`)
  else if (tipo === 'editar') router.push(`/docente/editar/${plan.id}`)
  else if (tipo === 'eliminar') confirmDelete(plan)
  else if (tipo === 'observaciones') openObs(plan)
}

async function confirmDelete(plan) {
  if (confirm(`¿Estás seguro de eliminar la planificación de ${plan.area_curricular}?`)) {
    await deletePlanificacion(plan.id)
  }
}

function openObs(plan) {
  obsModal.plan = plan
  obsModal.visible = true
}

function closeObs() {
  obsModal.visible = false
  obsModal.plan = null
}
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Page Header */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0.2rem;
}

.page-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.6rem 1.1rem;
  background: #1e3a5f;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
  box-shadow: 0 2px 8px rgba(30,58,95,0.25);
  white-space: nowrap;
}

.btn-primary:hover {
  background: #2d5282;
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(30,58,95,0.3);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.6rem 1.1rem;
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-secondary:hover { background: #e2e8f0; }

.btn-sm {
  padding: 0.45rem 0.85rem;
  font-size: 0.8rem;
}

/* KPI Grid */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.kpi-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  transition: box-shadow 0.2s, transform 0.2s;
}

.kpi-card:hover {
  box-shadow: 0 4px 14px rgba(0,0,0,0.08);
  transform: translateY(-2px);
}

.kpi-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.kpi-icon--blue { background: #dbeafe; color: #1d4ed8; }
.kpi-icon--green { background: #dcfce7; color: #16a34a; }
.kpi-icon--yellow { background: #fef3c7; color: #d97706; }

.kpi-content {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.kpi-num {
  font-size: 1.75rem;
  font-weight: 800;
  color: #1a202c;
  line-height: 1;
}

.kpi-label {
  font-size: 0.78rem;
  color: #64748b;
  font-weight: 500;
}

/* Section Card */
.section-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  overflow: hidden;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f1f5f9;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}

.record-count {
  font-size: 0.78rem;
  color: #94a3b8;
  font-weight: 500;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3.5rem 2rem;
  gap: 0.75rem;
  text-align: center;
}

.empty-icon-wrap {
  width: 72px;
  height: 72px;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  margin-bottom: 0.5rem;
}

.empty-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}

.empty-desc {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 0.5rem;
  max-width: 360px;
  line-height: 1.5;
}

/* Skeleton Loaders */
@keyframes shimmer {
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}

.skeleton {
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 800px 100%;
  animation: shimmer 1.4s infinite linear;
  border-radius: 6px;
}

.skeleton-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.skeleton-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  flex-shrink: 0;
}

.skeleton-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.skeleton-num {
  height: 28px;
  width: 50px;
}

.skeleton-label {
  height: 14px;
  width: 120px;
}

.skeleton-table {
  padding: 0.75rem 1rem;
}

.skeleton-thead {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f1f5f9;
}

.skeleton-th {
  height: 12px;
  flex: 1;
  border-radius: 4px;
}

.skeleton-row {
  display: flex;
  gap: 0.5rem;
  padding: 0.7rem 0;
  border-bottom: 1px solid #f8fafc;
}

.skeleton-td {
  height: 16px;
  flex: 1;
  border-radius: 4px;
}

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 1rem;
}

.modal-box {
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.15);
  width: 100%;
  max-width: 480px;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.1rem 1.25rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-title-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  color: #1a202c;
}

.modal-title-group h3 { margin: 0; font-size: 1rem; }

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  padding: 0.2rem;
  border-radius: 5px;
  transition: color 0.15s, background 0.15s;
}

.modal-close:hover { background: #f1f5f9; color: #64748b; }

.modal-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.obs-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #94a3b8;
}

.obs-text {
  background: #fef9ec;
  border: 1px solid #fde68a;
  border-left: 4px solid #f59e0b;
  border-radius: 8px;
  padding: 1rem;
  font-size: 0.875rem;
  color: #1a202c;
  line-height: 1.6;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-top: 1px solid #f1f5f9;
}
</style>
