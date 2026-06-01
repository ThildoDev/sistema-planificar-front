import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRevisionStore } from '@/stores/revision'

export function useRevision() {
  const store = useRevisionStore()

  const {
    planificaciones,
    planificacionActual,
    loading,
    loadingAction,
    error,
    successMsg,
    totalPlanificaciones,
    pendientesRevision,
    aprobadas,
    conObservaciones,
  } = storeToRefs(store)

  // ─── Filtros locales ─────────────────────────────────────────────────────
  const filtroEstado = ref('todos')
  const filtroSearch = ref('')

  const estadosMap = {
    Pendiente: { label: 'Pendiente', color: 'gray', emoji: '📝' },
    'En Proceso': { label: 'En Proceso', color: 'blue', emoji: '🔄' },
    Revisado: { label: 'En Revisión', color: 'yellow', emoji: '🟡' },
    Aprobado: { label: 'Aprobada', color: 'green', emoji: '✅' },
    Rechazado: { label: 'Con Obs.', color: 'red', emoji: '🔴' },
    Archivado: { label: 'Archivada', color: 'gray', emoji: '📦' },
    Cancelado: { label: 'Cancelada', color: 'red', emoji: '❌' },
    'En Espera': { label: 'En Espera', color: 'orange', emoji: '⏳' },
    Finalizado: { label: 'Finalizada', color: 'teal', emoji: '🏁' },
  }

  const getUltimoEstado = (p) => store.getUltimoEstado(p)

  const getEstadoInfo = (estadoStr) =>
    estadosMap[estadoStr] || { label: estadoStr, color: 'gray', emoji: '❓' }

  const planificacionesFiltradas = computed(() => {
    return planificaciones.value.filter((p) => {
      const ult = getUltimoEstado(p)
      const estadoActual = ult?.estado || 'Pendiente'

      const matchEstado = filtroEstado.value === 'todos' || estadoActual === filtroEstado.value

      const matchSearch =
        !filtroSearch.value ||
        p.persona?.apellidos?.toLowerCase().includes(filtroSearch.value.toLowerCase()) ||
        p.persona?.nombres?.toLowerCase().includes(filtroSearch.value.toLowerCase()) ||
        p.area?.area?.toLowerCase().includes(filtroSearch.value.toLowerCase())

      return matchEstado && matchSearch
    })
  })

  return {
    planificaciones,
    planificacionesFiltradas,
    planificacionActual,
    loading,
    loadingAction,
    error,
    successMsg,
    totalPlanificaciones,
    pendientesRevision,
    aprobadas,
    conObservaciones,
    filtroEstado,
    filtroSearch,
    estadosMap,
    getUltimoEstado,
    getEstadoInfo,
    fetchPlanificaciones: store.fetchPlanificaciones,
    fetchPlanificacion: store.fetchPlanificacion,
    aprobar: store.aprobar,
    observar: store.observar,
    clearMessages: store.clearMessages,
  }
}
