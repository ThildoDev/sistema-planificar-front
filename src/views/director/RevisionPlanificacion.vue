<!-- src/views/director/RevisionPlanificacion.vue -->
<template>
  <div class="revision-wrapper">
    <!-- Barra de navegación superior -->
    <div class="revision-nav">
      <button class="btn-volver" @click="$router.back()">
        <ChevronLeft class="nav-icon" />
        Volver
      </button>
      <nav class="breadcrumb">
        <router-link to="/director/dashboard">Panel</router-link>
        <ChevronRight class="breadcrumb-sep" />
        <router-link to="/director/planificaciones">Planificaciones</router-link>
        <ChevronRight class="breadcrumb-sep" />
        <span>Revisión #{{ route.params.id }}</span>
      </nav>
    </div>

    <!-- Loading inicial -->
    <div v-if="loading" class="page-loading">
      <div class="spinner-lg" />
      <p>Cargando planificación...</p>
    </div>

    <!-- Error de carga -->
    <div v-else-if="error && !planificacion" class="page-error">
      <AlertTriangle class="error-icon" />
      <p class="error-msg">{{ error }}</p>
      <button class="btn-retry" @click="cargarPlanificacion(route.params.id)">Reintentar</button>
    </div>

    <!-- Contenido principal -->
    <div v-else-if="planificacion" class="revision-layout">
      <!-- ── COLUMNA PRINCIPAL ── -->
      <div class="revision-main">
        <!-- Header de la planificación -->
        <div class="plan-header">
          <div class="plan-header-left">
            <h1 class="plan-titulo">
              Planificación
              <span
                class="plan-tipo-badge"
                :class="`plan-tipo--${planificacion.tipo_planificacion?.toLowerCase()}`"
              >
                {{ planificacion.tipo_planificacion }}
              </span>
            </h1>
            <p class="plan-meta">
              Presentada el {{ fechaPresentacionFormateada }}
              <span v-if="areaCompleta"> · Área: {{ areaCompleta }}</span>
            </p>
          </div>
          <EstadoBadge :estado="estadoActual?.estado" class="estado-badge-grande" />
        </div>

        <!-- Datos del docente / curso -->
        <div v-if="datosDocente" class="docente-panel">
          <div class="docente-item">
            <User class="docente-icon" />
            <div>
              <span class="docente-label">Docente</span>
              <span class="docente-valor">{{ datosDocente.nombre }}</span>
            </div>
          </div>
          <div class="docente-item">
            <Briefcase class="docente-icon" />
            <div>
              <span class="docente-label">Cargo</span>
              <span class="docente-valor">{{ datosDocente.cargo }}</span>
            </div>
          </div>
          <div class="docente-item">
            <BookOpen class="docente-icon" />
            <div>
              <span class="docente-label">Curso</span>
              <span class="docente-valor">
                {{ datosDocente.grado }} {{ datosDocente.seccion }} — {{ datosDocente.turno }}
              </span>
            </div>
          </div>
          <div class="docente-item">
            <Calendar class="docente-icon" />
            <div>
              <span class="docente-label">Año lectivo</span>
              <span class="docente-valor">{{ datosDocente.anioLectivo }}</span>
            </div>
          </div>
        </div>

        <!-- ── PLANIFICACIÓN EN MODO LECTURA ── -->
        <PlanificacionReadOnly :planificacion="planificacion" />

        <!-- ── PANEL DE DECISIÓN (Issue #8 completar) ── -->
        <DecisionPanel
          v-if="puedeRevisar"
          :loading="loadingAccion"
          @aprobar="manejarAprobar"
          @rechazar="abrirFormRechazo"
        />

        <!-- ── FORMULARIO DE OBSERVACIÓN / RECHAZO ── -->
        <ObservacionForm
          v-if="mostrarFormObservacion"
          :loading="loadingAccion"
          :modo="modoObservacion"
          @enviar="manejarObservacion"
          @cancelar="cerrarFormObservacion"
        />
      </div>

      <!-- ── COLUMNA LATERAL ── -->
      <aside class="revision-sidebar">
        <!-- Historial de estados -->
        <HistorialEstados :estados="historialEstados" />
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  User,
  Briefcase,
  BookOpen,
  Calendar,
} from 'lucide-vue-next'
import { useRevision } from '@/composables/useRevision'
import PlanificacionReadOnly from '@/components/director/PlanificacionReadOnly.vue'
import HistorialEstados from '@/components/director/HistorialEstados.vue'
import DecisionPanel from '@/components/director/DecisionPanel.vue'
import ObservacionForm from '@/components/director/ObservacionForm.vue'
import EstadoBadge from '@/components/shared/EstadoBadge.vue'

const route = useRoute()
const {
  planificacion,
  historialEstados,
  estadoActual,
  puedeRevisar,
  loading,
  loadingAccion,
  error,
  areaCompleta,
  datosDocente,
  fechaPresentacionFormateada,
  cargarPlanificacion,
  aprobar,
  rechazar,
  enviarObservacion,
} = useRevision()

// Control del formulario de observación/rechazo
const mostrarFormObservacion = ref(false)
const modoObservacion = ref('observacion') // 'observacion' | 'rechazo'

async function manejarAprobar() {
  await aprobar()
}

function abrirFormRechazo() {
  modoObservacion.value = 'rechazo'
  mostrarFormObservacion.value = true
  // Scroll suave al form
  setTimeout(() => {
    document.querySelector('.observacion-form')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }, 100)
}

function cerrarFormObservacion() {
  mostrarFormObservacion.value = false
}

async function manejarObservacion(payload) {
  let ok = false
  if (modoObservacion.value === 'rechazo') {
    ok = await rechazar(payload)
  } else {
    ok = await enviarObservacion(payload)
  }
  if (ok) {
    cerrarFormObservacion()
  }
}

onMounted(() => {
  cargarPlanificacion(route.params.id)
})
</script>

<style scoped>
.revision-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  max-width: 1300px;
  margin: 0 auto;
}

/* Nav */
.revision-nav {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-volver {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background: #fff;
  color: #475569;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-volver:hover {
  border-color: #6366f1;
  color: #6366f1;
}

.nav-icon {
  width: 1rem;
  height: 1rem;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8125rem;
  color: #94a3b8;
}

.breadcrumb a {
  color: #6366f1;
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.breadcrumb-sep {
  width: 0.875rem;
  height: 0.875rem;
}

/* Loading / Error */
.page-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 5rem;
  color: #64748b;
}

.spinner-lg {
  width: 3rem;
  height: 3rem;
  border: 4px solid #e2e8f0;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.page-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 4rem;
}

.error-icon {
  width: 3rem;
  height: 3rem;
  color: #ef4444;
}

.error-msg {
  font-size: 1rem;
  color: #475569;
}

.btn-retry {
  padding: 0.5rem 1.25rem;
  background: #6366f1;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.9375rem;
}

/* Layout principal */
.revision-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 1.5rem;
  align-items: flex-start;
}

@media (max-width: 960px) {
  .revision-layout {
    grid-template-columns: 1fr;
  }

  .revision-sidebar {
    order: -1;
  }
}

/* Header del plan */
.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.plan-titulo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.375rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.plan-tipo-badge {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
}

.plan-tipo--anual {
  background: #dbeafe;
  color: #1d4ed8;
}

.plan-tipo--trimestral {
  background: #fef3c7;
  color: #b45309;
}

.plan-meta {
  margin: 0.375rem 0 0;
  font-size: 0.875rem;
  color: #64748b;
}

.estado-badge-grande {
  font-size: 0.875rem !important;
  padding: 0.375rem 0.875rem !important;
}

/* Panel docente */
.docente-panel {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.docente-item {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
}

.docente-icon {
  width: 1.125rem;
  height: 1.125rem;
  color: #6366f1;
  margin-top: 0.125rem;
  flex-shrink: 0;
}

.docente-label {
  display: block;
  font-size: 0.75rem;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-weight: 500;
}

.docente-valor {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  color: #1e293b;
  margin-top: 0.125rem;
}

/* Columna main */
.revision-main {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
</style>
