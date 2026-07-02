import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import planificacionService from '@/services/planificacionService'

export const usePlanificacionStore = defineStore('planificacion', () => {
  const planificaciones = ref([])
  const currentPlanificacion = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // 📊 KPIs Calculados Reactivamente (Insensibles a Mayúsculas/Minúsculas)
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

  // 🔄 TRAER TODAS LAS PLANIFICACIONES
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

  // 🔍 TRAER PLANIFICACIÓN POR ID
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

  // ➕ CREAR NUEVA PLANIFICACIÓN
  async function createPlanificacion(payload) {
    loading.value = true
    error.value = null
    try {
      const data = await planificacionService.createPlanificacion(payload)
      // Agrega al inicio de la lista reactiva para que se renderice al instante en la tabla
      planificaciones.value.unshift(data)
      return data
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'No se pudo crear la planificación.'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 📝 ACTUALIZAR PLANIFICACIÓN
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

  // ❌ ELIMINAR PLANIFICACIÓN
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

  // 🧹 LIMPIAR SELECCIÓN ACTUAL
  function clearCurrent() {
    currentPlanificacion.value = null
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
    clearCurrent
  }
})
