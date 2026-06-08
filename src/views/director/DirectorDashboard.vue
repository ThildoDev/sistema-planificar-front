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
const loadingStats = computed(() => loading.value)

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

<style scoped>
.director-dashboard {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* Header */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
}

.dashboard-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.title-icon {
  width: 1.75rem;
  height: 1.75rem;
  color: #6366f1;
}

.dashboard-subtitle {
  margin: 0.25rem 0 0;
  color: #64748b;
  font-size: 0.95rem;
  text-transform: capitalize;
}

/* KPI Grid */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.25rem;
}

/* Sección card */
.section-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.section-icon {
  width: 1.1rem;
  height: 1.1rem;
  color: #6366f1;
}

.link-ver-todas {
  font-size: 0.875rem;
  color: #6366f1;
  text-decoration: none;
  font-weight: 500;
}

.link-ver-todas:hover {
  text-decoration: underline;
}

/* Filtros rápidos */
.filtros-rapidos {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.chip-filtro {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all 0.15s;
  color: #475569;
}

.chip-filtro:hover {
  border-color: #6366f1;
  color: #6366f1;
}

.chip-activo {
  background: #6366f1;
  border-color: #6366f1;
  color: #ffffff;
}

/* Accesos rápidos */
.accesos-rapidos {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.accesos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.acceso-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  text-decoration: none;
  color: #1e293b;
  font-weight: 500;
  font-size: 0.9375rem;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.acceso-card:hover {
  border-color: #6366f1;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
  transform: translateY(-2px);
}

.acceso-icon {
  width: 2rem;
  height: 2rem;
}

/* Botones */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #4f46e5;
}

.btn-icon {
  width: 1rem;
  height: 1rem;
}

@media (max-width: 640px) {
  .dashboard-header {
    flex-direction: column;
  }

  .btn-primary {
    width: 100%;
    justify-content: center;
  }
}
</style>
