<template>
  <div class="ver-view">
    <div class="page-header">
      <button class="back-btn" @click="goBack">
        <ArrowLeft :size="16" />
      </button>
      <div class="header-info">
        <h2 class="page-title">Ver Planificación</h2>
        <p class="page-subtitle">Vista de solo lectura — podés consultar todos los detalles e historial.</p>
      </div>
    </div>

    <!-- Skeleton -->
    <template v-if="loading">
      <div class="detail-card">
        <div class="skeleton-header">
          <div class="skeleton sk-title"></div>
          <div class="skeleton sk-badge"></div>
        </div>
        <div class="skeleton-body">
          <div v-for="i in 5" :key="i" class="skeleton-section">
            <div class="skeleton sk-section-title"></div>
            <div class="skeleton sk-section-content"></div>
            <div class="skeleton sk-section-content sk-short"></div>
          </div>
        </div>
      </div>
    </template>

    <!-- Error -->
    <div v-else-if="error" class="error-state">
      <AlertCircle :size="40" />
      <p>{{ error }}</p>
      <button class="btn-secondary" @click="goBack">Volver</button>
    </div>

    <!-- Content -->
    <template v-else-if="currentPlanificacion">
      <div class="layout-two-col">
        <!-- Main detail card -->
        <div class="detail-card">
          <div class="detail-header">
            <div class="detail-header-left">
              <h3 class="detail-area">{{ currentPlanificacion.area_curricular }}</h3>
              <div class="detail-meta-row">
                <span class="detail-meta-item">
                  <CalendarDays :size="13" />
                  {{ formatDate(currentPlanificacion.fecha_presentacion) }}
                </span>
                <span class="detail-meta-item">
                  <Tag :size="13" />
                  {{ currentPlanificacion.tipo_planificacion }}
                </span>
              </div>
            </div>
            <div class="detail-header-right">
              <StatusBadgeAnual :estado="currentPlanificacion.estado" />
              <RouterLink
                v-if="canEdit(currentPlanificacion)"
                :to="`/docente/editar/${currentPlanificacion.id}`"
                class="btn-edit"
              >
                <Pencil :size="14" />
                Editar
              </RouterLink>
            </div>
          </div>

          <!-- Observaciones del directivo -->
          <div v-if="currentPlanificacion.observaciones_directivo" class="obs-block">
            <div class="obs-block-header">
              <MessageSquare :size="15" />
              <strong>Observaciones del Directivo</strong>
            </div>
            <p>{{ currentPlanificacion.observaciones_directivo }}</p>
          </div>

          <!-- Content fields -->
          <div class="detail-sections">
            <div v-for="field in contentFields" :key="field.key" class="detail-section">
              <div class="section-label">
                <component :is="field.icon" :size="14" />
                {{ field.label }}
              </div>
              <div class="section-content">
                {{ currentPlanificacion[field.key] || '—' }}
              </div>
            </div>
          </div>

          <!-- Footer info -->
          <div class="detail-footer">
            <span class="footer-item">
              <User :size="12" />
              Docente ID: {{ currentPlanificacion.persona_cargo_cursado_id }}
            </span>
            <span class="footer-item">
              <Clock :size="12" />
              Creado: {{ formatDatetime(currentPlanificacion.created_at) }}
            </span>
            <span class="footer-item">
              <RefreshCw :size="12" />
              Modificado: {{ formatDatetime(currentPlanificacion.updated_at) }}
            </span>
          </div>
        </div>

        <!-- Timeline card -->
        <div class="timeline-card">
          <div class="timeline-card-header">
            <History :size="16" />
            <h4>Historial de Auditoría</h4>
          </div>
          <div class="timeline">
            <div
              v-for="(event, i) in currentPlanificacion.historial"
              :key="i"
              class="timeline-item"
              :class="`timeline-item--${getStatusClass(event.estado)}`"
            >
              <div class="timeline-dot">
                <component :is="getStatusIcon(event.estado)" :size="12" />
              </div>
              <div class="timeline-connector" v-if="i < currentPlanificacion.historial.length - 1"></div>
              <div class="timeline-content">
                <div class="timeline-state">
                  <StatusBadgeAnual :estado="event.estado" />
                </div>
                <p class="timeline-nota">{{ event.nota }}</p>
                <div class="timeline-meta">
                  <span>{{ event.usuario }}</span>
                  <span>{{ formatDatetime(event.fecha) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  ArrowLeft, CalendarDays, Tag, MessageSquare, User, Clock,
  RefreshCw, History, AlertCircle, Pencil, CheckCircle2,
  XCircle, AlertTriangle, FileEdit, FilePlus
} from 'lucide-vue-next'
import StatusBadgeAnual from '@/components/docente/StatusBadgeAnual.vue'
import { usePlanificacion } from '@/composables/usePlanificacion'

const router = useRouter()
const route = useRoute()
const { currentPlanificacion, loading, error, fetchById, canEdit } = usePlanificacion(false)

const planId = route.params.id

onMounted(() => fetchById(planId))

function goBack() {
  router.push('/docente/dashboard')
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })
}

function formatDatetime(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

function getStatusClass(estado) {
  const map = { 'Aprobado': 'green', 'Pendiente': 'yellow', 'A Corregir': 'red', 'Rechazado': 'purple' }
  return map[estado] || 'gray'
}

function getStatusIcon(estado) {
  const map = {
    'Aprobado': CheckCircle2,
    'Pendiente': FilePlus,
    'A Corregir': AlertTriangle,
    'Rechazado': XCircle
  }
  return map[estado] || FileEdit
}

const contentFields = [
  { key: 'diagnostico_grupo', label: 'Diagnóstico del Grupo', icon: User },
  { key: 'aprendizajes_esperados', label: 'Aprendizajes Esperados', icon: CheckCircle2 },
  { key: 'saberes_contenidos', label: 'Saberes / Contenidos', icon: FilePlus },
  { key: 'criterios_evaluacion', label: 'Criterios de Evaluación', icon: AlertTriangle },
  { key: 'bibliografia', label: 'Bibliografía', icon: History }
]
</script>

<style scoped>
.ver-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 1100px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
}

.back-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition: background 0.15s, color 0.15s;
  margin-top: 3px;
  flex-shrink: 0;
}

.back-btn:hover { background: #f1f5f9; color: #1a202c; }

.page-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0.2rem;
}

.page-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

/* Two column layout */
.layout-two-col {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 1.25rem;
  align-items: start;
}

/* Detail card */
.detail-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  overflow: hidden;
}

.detail-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.detail-area {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0.4rem;
}

.detail-meta-row {
  display: flex;
  gap: 1rem;
}

.detail-meta-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8rem;
  color: #64748b;
}

.detail-header-right {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-shrink: 0;
}

.btn-edit {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.75rem;
  background: #fffbeb;
  color: #d97706;
  border: 1px solid #fde68a;
  border-radius: 7px;
  font-size: 0.78rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.15s;
}

.btn-edit:hover { background: #fef3c7; }

/* Observaciones block */
.obs-block {
  margin: 1rem 1.5rem;
  background: #fef9ec;
  border: 1px solid #fde68a;
  border-left: 4px solid #f59e0b;
  border-radius: 8px;
  padding: 0.85rem 1rem;
}

.obs-block-header {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.82rem;
  color: #92400e;
  margin-bottom: 0.4rem;
}

.obs-block p {
  font-size: 0.875rem;
  color: #78350f;
  margin: 0;
  line-height: 1.6;
}

/* Content sections */
.detail-sections {
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #64748b;
}

.section-content {
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
  padding: 0.85rem 1rem;
  font-size: 0.875rem;
  color: #1a202c;
  line-height: 1.7;
  white-space: pre-wrap;
}

/* Footer */
.detail-footer {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  padding: 0.85rem 1.5rem;
  border-top: 1px solid #f1f5f9;
  background: #f8fafc;
}

.footer-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  color: #94a3b8;
}

/* Timeline card */
.timeline-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  overflow: hidden;
  position: sticky;
  top: 80px;
}

.timeline-card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.1rem;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.875rem;
  font-weight: 700;
  color: #1a202c;
}

.timeline-card-header h4 { margin: 0; font-size: 0.875rem; }

.timeline {
  padding: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.timeline-item {
  display: flex;
  gap: 0.85rem;
  position: relative;
}

.timeline-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  z-index: 1;
}

.timeline-item--green .timeline-dot { background: #dcfce7; color: #16a34a; }
.timeline-item--yellow .timeline-dot { background: #fef3c7; color: #d97706; }
.timeline-item--red .timeline-dot { background: #fee2e2; color: #dc2626; }
.timeline-item--purple .timeline-dot { background: #ede9fe; color: #7c3aed; }
.timeline-item--gray .timeline-dot { background: #f1f5f9; color: #64748b; }

.timeline-connector {
  position: absolute;
  left: 13px;
  top: 28px;
  bottom: -4px;
  width: 2px;
  background: #e2e8f0;
}

.timeline-content {
  padding-bottom: 1.25rem;
  flex: 1;
  min-width: 0;
}

.timeline-state {
  margin-bottom: 0.3rem;
}

.timeline-nota {
  font-size: 0.8rem;
  color: #475569;
  margin: 0 0 0.3rem;
  line-height: 1.5;
}

.timeline-meta {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  font-size: 0.72rem;
  color: #94a3b8;
}

/* Skeleton */
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

.skeleton-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  gap: 1rem;
}

.sk-title { height: 22px; width: 200px; }
.sk-badge { height: 24px; width: 100px; border-radius: 999px; }

.skeleton-body {
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.skeleton-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sk-section-title { height: 12px; width: 140px; }
.sk-section-content { height: 68px; }
.sk-short { width: 65%; height: 48px; }

/* Error state */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem;
  color: #ef4444;
  text-align: center;
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.6rem 1rem;
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

@media (max-width: 900px) {
  .layout-two-col {
    grid-template-columns: 1fr;
  }
  .timeline-card {
    position: static;
  }
}
</style>
