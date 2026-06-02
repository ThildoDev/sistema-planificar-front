import { usePlanificacionStore } from '@/stores/planificacion'
import { storeToRefs } from 'pinia'

/**
 * usePlanificacion
 * Composable para conectar las vistas del Docente con el Store
 */
export function usePlanificacion() {
  const store = usePlanificacionStore()

  const {
    planificaciones,
    loading,
    error,
    totalPlanificaciones,
    planificacionesAprobadas,
    planificacionesPendientes
  } = storeToRefs(store)

  return {
    // Estado
    planificaciones,
    loading,
    error,
    // Getters
    totalPlanificaciones,
    planificacionesAprobadas,
    planificacionesPendientes,
    // Acciones
    fetchPlanificaciones: store.fetchPlanificaciones,
    clearErrors: store.clearErrors
  }
}
