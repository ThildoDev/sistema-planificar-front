<!-- src/views/director/DirectorDashboard.vue -->
<template>
  <div class="director-dashboard">
    <!-- ── CABECERA ── -->
    <div class="dashboard-header">
      <div class="header-content">
        <h1 class="dashboard-title">
          <ClipboardList class="title-icon" />
          Panel de Dirección
        </h1>
        <p class="dashboard-subtitle">
          Bienvenido, <strong>{{ nombreDirector }}</strong> —
          {{ fechaHoy }}
        </p>
      </div>

      <button class="btn-primary" @click="irAPlanificaciones">
        <Eye class="btn-icon" />
        Ver todas las planificaciones
      </button>
    </div>

    <!-- ── KPI CARDS ── -->
    <section class="kpi-grid">
      <KpiCard
        title="Pendientes de revisión"
        :value="stats.pendientes"
        :loading="loadingStats"
        color="yellow"
        icon="clock"
        subtitle="Esperan tu revisión"
      />
      <KpiCard
        title="Aprobadas"
        :value="stats.aprobadas"
        :loading="loadingStats"
        color="green"
        icon="check-circle"
        subtitle="Este período"
      />
      <KpiCard
        title="Rechazadas"
        :value="stats.rechazadas"
        :loading="loadingStats"
        color="red"
        icon="x-circle"
        subtitle="Con observaciones"
      />
      <KpiCard
        title="Total docentes"
        :value="stats.docentes"
        :loading="loadingStats"
        color="blue"
        icon="users"
        subtitle="Activos en el sistema"
      />
    </section>

    <!-- ── PLANIFICACIONES RECIENTES ── -->
    <section class="section-card">
      <div class="section-header">
        <h2 class="section-title">
          <FileText class="section-icon" />
          Planificaciones recientes
        </h2>
        <router-link to="/director/planificaciones" class="link-ver-todas">
          Ver todas →
        </router-link>
      </div>

      <!-- Filtros rápidos de estado -->
      <div class="filtros-rapidos">
        <button
          v-for="estado in estadosFiltro"
          :key="estado.value"
          class="chip-filtro"
          :class="{ 'chip-activo': filtroActivo === estado.value }"
          @click="cambiarFiltro(estado.value)"
        >
          {{ estado.label }}
        </button>
      </div>

      <!-- Tabla de planificaciones -->
      <PlanificacionesRecibidasTable
        :planificaciones="planificacionesFiltradas"
        :loading="loading"
        compact
        @revisar="irARevision"
      />
    </section>

    <!-- ── ACCESOS RÁPIDOS ── -->
    <section class="accesos-rapidos">
      <h2 class="section-title">Accesos rápidos</h2>
      <div class="accesos-grid">
        <router-link to="/director/planificaciones" class="acceso-card">
          <ClipboardList class="acceso-icon text-blue-500" />
          <span>Revisar Planificaciones</span>
        </router-link>
        <router-link to="/director/usuarios" class="acceso-card">
          <Users class="acceso-icon text-purple-500" />
          <span>Gestionar Docentes</span>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ClipboardList, FileText, Eye, Users } from 'lucide-vue-next'
import { useRevision } from '@/composables/useRevision'
import { useAuthStore } from '@/stores/auth'
import KpiCard from '@/components/shared/KpiCard.vue'
import PlanificacionesRecibidasTable from '@/components/director/PlanificacionesRecibidasTable.vue'

const router = useRouter()
const authStore = useAuthStore()
const { planificaciones, loading, cargarPlanificaciones, irARevision } = useRevision()

// ── Datos del director logueado ──
const nombreDirector = computed(() => authStore.user?.name || 'Director')
const fechaHoy = computed(() =>
  new Date().toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }),
)

// ── Stats calculados desde las planificaciones cargadas ──
const loadingStats = computed(() => loading)

const stats = computed(() => {
  const lista = planificaciones.value
  const getUltimoEstado = (p) => {
    const estados = p.estados_anual || []
    if (!estados.length) return null
    return [...estados].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0]?.estado
  }

  return {
    pendientes: lista.filter((p) => ['Pendiente', 'En Proceso'].includes(getUltimoEstado(p)))
      .length,
    aprobadas: lista.filter((p) => getUltimoEstado(p) === 'Aprobado').length,
    rechazadas: lista.filter((p) => getUltimoEstado(p) === 'Rechazado').length,
    docentes: new Set(lista.map((p) => p.persona_cargo_cursado?.persona_cargo?.persona?.id)).size,
  }
})

// ── Filtro rápido por estado ──
const filtroActivo = ref('')
const estadosFiltro = [
  { value: '', label: 'Todas' },
  { value: 'Pendiente', label: 'Pendientes' },
  { value: 'En Proceso', label: 'En Proceso' },
  { value: 'Aprobado', label: 'Aprobadas' },
  { value: 'Rechazado', label: 'Rechazadas' },
]

const planificacionesFiltradas = computed(() => {
  if (!filtroActivo.value) return planificaciones.value.slice(0, 10)
  return planificaciones.value
    .filter((p) => {
      const estados = p.estados_anual || []
      const ultimo = [...estados].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0]?.estado
      return ultimo === filtroActivo.value
    })
    .slice(0, 10)
})

function cambiarFiltro(estado) {
  filtroActivo.value = estado
}

function irAPlanificaciones() {
  router.push('/director/planificaciones')
}

// ── Init ──
onMounted(async () => {
  await cargarPlanificaciones()
})
</script>


