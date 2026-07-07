import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import planificacionService from '@/services/planificacionService'

export const usePlanificacionStore = defineStore('planificacion', () => {
  const planificaciones = ref([])
  const currentPlanificacion = ref(null)
  const loading = ref(false)
  const error = ref(null)

  //  KPIs Calculados Reactivamente (Insensibles a Mayúsculas/Minúsculas)
  const totalEntregadas = computed(() => planificaciones.value.length)

  const totalAprobadas = computed(() =>
    planificaciones.value.filter(p => {
      const state = p.estado?.toLowerCase() || ''
      return state.includes('aprob') || state === 'aprobada'
    }).length
  )

  const totalPendientes = computed(() =>
    planificaciones.value.filter(p => {
      const state = p.estado?.toLowerCase() || ''
      return state.includes('pend') || state.includes('revis') || state.includes('envi')
    }).length
  )

  const totalACorregir = computed(() =>
    planificaciones.value.filter(p => {
      const state = p.estado?.toLowerCase() || ''
      return state.includes('obs') || state.includes('rechaz') || state.includes('corregir')
    }).length
  )

  // TRAER TODAS LAS PLANIFICACIONES
  async function fetchPlanificaciones() {
    loading.value = true
    error.value = null
    try {
      const data = await planificacionService.getPlanificacionesAnuales()
      // Si el backend viene envuelto en un objeto { data: [...] } se desempaqueta correctamente
      planificaciones.value = Array.isArray(data) ? data : (data.data || [])
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Error al obtener planificaciones.'
    } finally {
      loading.value = false
    }
  }

  // TRAER PLANIFICACIÓN POR ID
  async function fetchById(id) {
    loading.value = true
    error.value = null
    try {
      // Usamos el servicio unificado
      const data = await planificacionService.getPlanificacionById?.(id) || await planificacionService.updatePlanificacion(id)
      currentPlanificacion.value = data
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Error al buscar la planificación.'
    } finally {
      loading.value = false
    }
  }

  // CREAR NUEVA PLANIFICACIÓN
async function createPlanificacion(payload) {
  loading.value = true
  error.value = null
  try {
    const data = await planificacionService.createPlanificacion(payload)

    // Desempaquetamos la respuesta del backend
    const nuevosRegistros = data.data || []

    if (Array.isArray(nuevosRegistros)) {
      // Si vienen múltiples áreas solapadas, las agregamos todas al listado
      nuevosRegistros.forEach(registro => {
        planificaciones.value.unshift(registro)
      })
    } else {
      planificaciones.value.unshift(nuevosRegistros)
    }

    return data
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'No se pudo crear la planificación.'
    throw err
  } finally {
    loading.value = false
  }
}

  // ACTUALIZAR PLANIFICACIÓN
  async function updatePlanificacion(id, payload) {
    loading.value = true
    error.value = null
    try {
      const data = await planificacionService.updatePlanificacion(id, payload)

      // Sincronización exacta en la lista local de memoria sin re-cargar de la red
      const idx = planificaciones.value.findIndex(p => p.id === Number(id))
      if (idx !== -1) planificaciones.value[idx] = data

      currentPlanificacion.value = data
      return data
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'No se pudo actualizar la planificación.'
      throw err
    } finally {
      loading.value = false
    }
  }

  // ELIMINAR PLANIFICACIÓN
  async function deletePlanificacion(id) {
    loading.value = true
    error.value = null
    try {
      if (planificacionService.deletePlanificacion) {
        await planificacionService.deletePlanificacion(id)
      }
      planificaciones.value = planificaciones.value.filter(p => p.id !== Number(id))
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'No se pudo eliminar la planificación.'
      throw err
    } finally {
      loading.value = false
    }
  }

  // LIMPIAR SELECCIÓN ACTUAL
  function clearCurrent() {
    currentPlanificacion.value = null
  }

// ACCIÓN: ENVIAR A REVISIÓN (DOCENTE)
  async function enviarARevision(id) {
    loading.value = true
    try {
      await planificacionService.enviarARevision(id)
      await fetchPlanificaciones()

      // Notificación Directa: Alerta al sistema de la campana
      const { useNotificacionesStore } = await import('@/stores/notificaciones')
      const notiStore = useNotificacionesStore()
      notiStore.agregarNotificacion(`Has enviado la Planificación #${id} al Director.`, 'success')

    } catch (err) {
      error.value = err.response?.data?.Mensaje || 'Error al enviar la planificación.'
      throw err
    } finally {
      loading.value = false
    }
  }

  // ACCIÓN: APROBAR PLANIFICACIÓN (DIRECTOR)
  async function aprobarPlanificacion(id) {
    loading.value = true
    try {
      await planificacionService.aprobarPlanificacion(id)
      await fetchPlanificaciones()

      // Notificación Directa al Docente
      const { useNotificacionesStore } = await import('@/stores/notificaciones')
      const notiStore = useNotificacionesStore()
      notiStore.agregarNotificacion(`La Planificación #${id} ha sido aprobada por el Director.`, 'success')

    } catch (err) {
      error.value = err.response?.data?.Mensaje || 'Error al aprobar.'
      throw err
    } finally {
      loading.value = false
    }
  }

  // ACCIÓN: RECHAZAR PLANIFICACIÓN (DIRECTOR)
 async function rechazarPlanificacion(id, payload) {
    loading.value = true
    try {
      // Pasamos las observaciones al servicio
      await planificacionService.rechazarPlanificacion(id, payload)
      await fetchPlanificaciones()

      // 🔔 Notificación Directa a la campana
      const { useNotificacionesStore } = await import('@/stores/notificaciones')
      const notiStore = useNotificacionesStore()
      notiStore.agregarNotificacion(`La Planificación #${id} requiere correcciones urgentes.`, 'warning')
    } catch (err) {
      error.value = err.response?.data?.Mensaje || 'Error al procesar la devolución.'
      throw err
    } finally {
      loading.value = false
    }
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
    fetchPlanificaciones,
    fetchById,
    createPlanificacion,
    updatePlanificacion,
    deletePlanificacion,
    clearCurrent,
    enviarARevision,
    aprobarPlanificacion,
    rechazarPlanificacion
  }
})
