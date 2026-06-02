<template>
  <div class="dashboard-page">
    <!-- Header e Identidad -->
    <div class="dashboard-top flex-space">
      <div class="page-header">
        <h1 class="page-title">Mi Panel de Planificaciones</h1>
        <p class="page-subtitle">Gestioná y hacé el seguimiento de tus propuestas pedagógicas</p>
      </div>
      <IdentidadCard />
    </div>

    <!-- Barra de Acciones Globales -->
    <div class="action-bar">
      <button class="btn-create" @click="handleCrear">
        <Plus :size="16" /> Crear Nueva Planificación
      </button>
    </div>

    <!-- KPIs Dinámicos -->
    <div class="kpi-grid">
      <div class="kpi-card kpi-blue">
        <div class="kpi-icon"><BarChart3 :size="24" /></div>
        <div class="kpi-info">
          <span class="kpi-value">{{ totalPlanificaciones }}</span>
          <span class="kpi-label">Total Entregadas</span>
        </div>
      </div>
      <div class="kpi-card kpi-green">
        <div class="kpi-icon"><CheckCircle2 :size="24" /></div>
        <div class="kpi-info">
          <span class="kpi-value">{{ planificacionesAprobadas }}</span>
          <span class="kpi-label">Aprobadas</span>
        </div>
      </div>
      <div class="kpi-card kpi-purple">
        <div class="kpi-icon"><Clock :size="24" /></div>
        <div class="kpi-info">
          <span class="kpi-value">{{ planificacionesPendientes }}</span>
          <span class="kpi-label">Pendientes</span>
        </div>
      </div>
    </div>

    <!-- Gestión de Vistas según Estados de Carga / Datos -->
    <div class="content-section">
      <!-- 1. Skeleton Loader en Carga -->
      <div v-if="loading" class="skeleton-wrapper">
        <div class="skeleton-row header-skeleton"></div>
        <div class="skeleton-row" v-for="n in 3" :key="n"></div>
      </div>

      <!-- 2. Banner de Errores de API -->
      <div v-else-if="error" class="error-banner">
        <AlertCircle :size="18" />
        <span>{{ error }}</span>
        <button class="btn-retry" @click="fetchPlanificaciones">Reintentar</button>
      </div>

      <!-- 3. Empty State -->
      <div v-else-if="planificaciones.length === 0" class="empty-state">
        <FolderOpen :size="48" color="#cbd5e1" />
        <h3>Sin planificaciones registradas</h3>
        <p>No registrás documentos entregados para este periodo escolar. Presioná el botón superior para empezar.</p>
      </div>

      <!-- 4. Tabla de datos integrada -->
      <div v-else>
        <div class="section-header">
          <h2 class="section-title">Historial de Entregas</h2>
        </div>
        <PlanificacionesTable :planificaciones="planificaciones" @action="onTableAction" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { BarChart3, CheckCircle2, Clock, Plus, FolderOpen, AlertCircle } from 'lucide-vue-next'
import { usePlanificacion } from '@/composables/UsePlanificacion'

// Componentes del espacio de trabajo
import IdentidadCard from '@/components/docente/IdentidadCard.vue'
import PlanificacionesTable from '@/components/docente/PlanificacionesTable.vue'

const {
  planificaciones,
  loading,
  error,
  totalPlanificaciones,
  planificacionesAprobadas,
  planificacionesPendientes,
  fetchPlanificaciones
} = usePlanificacion()

onMounted(() => {
  fetchPlanificaciones()
})

function handleCrear() {
  console.log('Navegando a la pantalla de carga de planificaciones...')
}

function onTableAction({ type, plan }) {
  console.log(`Acción ejecutada: [${type.toUpperCase()}] sobre la planificación ID: ${plan.id}`)
}
</script>

<style scoped>
/* Sincronizado con la arquitectura CSS de AdminDashboard.vue */
.dashboard-page { display: flex; flex-direction: column; gap: 1.5rem; }
.page-header { margin-bottom: 0.5rem; }
.page-title { font-size: 1.5rem; font-weight: 800; color: #0f172a; }
.page-subtitle { font-size: 0.875rem; color: #64748b; margin-top: 0.25rem; }
.flex-space { display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; }

.action-bar { display: flex; justify-content: flex-end; margin-bottom: -0.5rem; }
.btn-create {
  display: flex; align-items: center; gap: 0.5rem; background: #2563eb; color: #fff;
  border: none; padding: 0.625rem 1.25rem; border-radius: 8px; font-size: 0.875rem;
  font-weight: 600; cursor: pointer; transition: background 0.2s;
}
.btn-create:hover { background: #1d4ed8; }

/* KPI Grid idéntico a Admin */
.kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
.kpi-card { display: flex; align-items: center; gap: 1rem; padding: 1.25rem 1.5rem; border-radius: 12px; border: 1px solid transparent; }
.kpi-blue { background: #eff6ff; border-color: #bfdbfe; }
.kpi-green { background: #f0fdf4; border-color: #bbf7d0; }
.kpi-purple { background: #faf5ff; border-color: #e9d5ff; }
.kpi-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.kpi-blue .kpi-icon { background: #dbeafe; color: #1d4ed8; }
.kpi-green .kpi-icon { background: #dcfce7; color: #15803d; }
.kpi-purple .kpi-icon { background: #ede9fe; color: #6d28d9; }
.kpi-info { display: flex; flex-direction: column; }
.kpi-value { font-size: 1.75rem; font-weight: 800; color: #0f172a; line-height: 1; }
.kpi-label { font-size: 0.8125rem; color: #64748b; margin-top: 0.25rem; }

.section-header { margin-bottom: 0.75rem; }
.section-title { font-size: 1rem; font-weight: 700; color: #0f172a; }

/* Empty y Error states */
.empty-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 0.5rem; padding: 4rem 2rem; background: #fff; border: 2px dashed #e2e8f0;
  border-radius: 12px; text-align: center; color: #64748b;
}
.empty-state h3 { font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0.5rem; }
.empty-state p { font-size: 0.875rem; max-w: 320px; color: #94a3b8; }

.error-banner {
  display: flex; align-items: center; gap: 0.625rem; padding: 0.875rem 1rem;
  border-radius: 10px; background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; font-size: 0.875rem;
}
.btn-retry { margin-left: auto; background: #fff; border: 1px solid #fecaca; padding: 0.25rem 0.75rem; border-radius: 6px; cursor: pointer; color: #dc2626; font-weight: 600; }
.btn-retry:hover { background: #fff5f5; }

/* Animación de esqueleto limpia */
.skeleton-wrapper { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem; display: flex; flex-direction: column; gap: 0.75rem; }
.skeleton-row { height: 40px; background: #f1f5f9; border-radius: 6px; position: relative; overflow: hidden; }
.header-skeleton { height: 32px; background: #f8fafc; width: 100%; }
.skeleton-row::after {
  position: absolute; inset: 0; transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
  animation: loading-shimmer 1.5s infinite; content: '';
}
@keyframes loading-shimmer { 100% { transform: translateX(100%); } }
</style>
