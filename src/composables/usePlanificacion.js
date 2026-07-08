// src/composables/usePlanificacion.js
import { usePlanificacionStore } from '@/stores/planificacion'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

export function usePlanificacion(autoFetch = true) {
  const store = usePlanificacionStore()
  const authStore = useAuthStore()

  const {
    planificaciones,
    currentPlanificacion,
    loading,
    error,
    totalEntregadas,
    totalAprobadas,
    totalPendientes,
    totalACorregir
  } = storeToRefs(store)

  if (autoFetch) {
    onMounted(() => {
      if (authStore.user?.id) {
        store.fetchPlanificaciones(authStore.user.id)
      }
    })
  }

const canEdit = (planificacion) => {
    // Si no tiene estados registrados, significa que es un Borrador nuevo local, se permite editar
    if (!planificacion?.estados || planificacion.estados.length === 0) {
      return true
    }

    // Tomamos el último estado real
    const ultimoEstadoObj = planificacion.estados[planificacion.estados.length - 1];
    const state = ultimoEstadoObj?.estado ? ultimoEstadoObj.estado.toLowerCase().trim() : '';

    // Lista de estados donde se expone el botón de modificar en el Dashboard
    const editableStates = ['pendiente', 'a corregir', 'corregir', 'rechazado', 'rechazada', 'borrador']
    return editableStates.includes(state) || state.includes('borr')
  }

  const statusConfig = {
    'Aprobado':   { color: '#16a34a', bg: '#dcfce7', label: 'Aprobado' },
    'Pendiente':  { color: '#d97706', bg: '#fef3c7', label: 'Pendiente' },
    'A Corregir': { color: '#dc2626', bg: '#fee2e2', label: 'A Corregir' },
    'Rechazado':  { color: '#7c3aed', bg: '#ede9fe', label: 'Rechazado' }
  }

  return {
    planificaciones,
    currentPlanificacion,
    loading,
    error,
    totalEntregadas,
    totalAprobadas,
    totalPendientes,
    totalACorregir,
    fetchPlanificaciones: store.fetchPlanificaciones,
    fetchById: store.fetchById,
    createPlanificacion: store.createPlanificacion,
    updatePlanificacion: store.updatePlanificacion,
    deletePlanificacion: store.deletePlanificacion,
    clearCurrent: store.clearCurrent,
    canEdit,
    statusConfig
  }
}
