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

