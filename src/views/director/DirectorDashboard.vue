<template>
  <div class="dashboard-page">
    <div class="page-header">
      <h1 class="page-title">Panel de Dirección</h1>
      <p class="page-subtitle">Supervisión pedagógica — Ciclo {{ añoActual }}</p>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-grid">
      <div class="kpi-card kpi-yellow">
        <div class="kpi-icon"><Clock :size="24" /></div>
        <div class="kpi-info">
          <span class="kpi-value">{{ pendientesRevision }}</span>
          <span class="kpi-label">Pendientes de Revisión</span>
        </div>
      </div>
      <div class="kpi-card kpi-green">
        <div class="kpi-icon"><CheckCircle2 :size="24" /></div>
        <div class="kpi-info">
          <span class="kpi-value">{{ aprobadas }}</span>
          <span class="kpi-label">Aprobadas</span>
        </div>
      </div>
      <div class="kpi-card kpi-red">
        <div class="kpi-icon"><MessageSquareWarning :size="24" /></div>
        <div class="kpi-info">
          <span class="kpi-value">{{ conObservaciones }}</span>
          <span class="kpi-label">Con Observaciones</span>
        </div>
      </div>
    </div>

    <!-- Feedback -->
    <Transition name="fade">
      <div v-if="error" class="error-banner">
        <AlertCircle :size="18" /> <span>{{ error }}</span>
      </div>
    </Transition>

    <!-- Filtros + Tabla -->
    <div class="section-card">
      <div class="section-header">
        <h2 class="section-title"><FileText :size="18" /> Planificaciones Recibidas</h2>
        <button class="btn-refresh" @click="fetchPlanificaciones()" :disabled="loading">
          <RefreshCw :size="14" :class="{ spinning: loading }" />
          Actualizar
        </button>
      </div>

      <FiltrosPlanificacion />
      <PlanificacionesRecibidasTable />
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import {
  Clock,
  CheckCircle2,
  MessageSquareWarning,
  AlertCircle,
  FileText,
  RefreshCw,
} from 'lucide-vue-next'

import FiltrosPlanificacion from '@/components/director/FiltrosPlanificacion.vue'
import PlanificacionesRecibidasTable from '@/components/director/PlanificacionesRecibidasTable.vue'
import { useRevision } from '@/composables/useRevision'

const { loading, error, pendientesRevision, aprobadas, conObservaciones, fetchPlanificaciones } =
  useRevision()

const añoActual = computed(() => new Date().getFullYear())

onMounted(() => fetchPlanificaciones())
</script>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.page-header {
  margin-bottom: 0.25rem;
}
.page-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
}
.page-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 0.25rem;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.kpi-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-radius: 12px;
  border: 1px solid transparent;
}

.kpi-yellow {
  background: #fffbeb;
  border-color: #fde68a;
}
.kpi-green {
  background: #f0fdf4;
  border-color: #bbf7d0;
}
.kpi-red {
  background: #fff1f2;
  border-color: #fecdd3;
}

.kpi-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.kpi-yellow .kpi-icon {
  background: #fef3c7;
  color: #d97706;
}
.kpi-green .kpi-icon {
  background: #dcfce7;
  color: #15803d;
}
.kpi-red .kpi-icon {
  background: #ffe4e6;
  color: #e11d48;
}

.kpi-info {
  display: flex;
  flex-direction: column;
}
.kpi-value {
  font-size: 1.75rem;
  font-weight: 800;
  color: #0f172a;
  line-height: 1;
}
.kpi-label {
  font-size: 0.8125rem;
  color: #64748b;
  margin-top: 0.25rem;
}

.error-banner {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.875rem 1rem;
  border-radius: 10px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  font-size: 0.875rem;
}

.section-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.25rem 0;
  margin-bottom: 1rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
}

.btn-refresh {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.4rem 0.875rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  font-size: 0.8125rem;
  color: #475569;
  cursor: pointer;
}
.btn-refresh:hover {
  background: #e2e8f0;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
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
