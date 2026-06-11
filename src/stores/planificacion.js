import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { DocenteRepository } from '@/repositories/DocenteRepository'

export const usePlanificacionStore = defineStore('planificacion', () => {
  const planificaciones = ref([])
  const currentPlanificacion = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // KPIs calculados reactivamente
  const totalEntregadas = computed(() => planificaciones.value.length)
  const totalAprobadas = computed(() =>
    planificaciones.value.filter(p => p.estado === 'Aprobado').length
  )
  const totalPendientes = computed(() =>
    planificaciones.value.filter(p => p.estado === 'Pendiente').length
  )
  const totalACorregir = computed(() =>
    planificaciones.value.filter(p => p.estado === 'A Corregir' || p.estado === 'Rechazado').length
  )

  async function fetchPlanificaciones(docenteId) {
    loading.value = true
    error.value = null
    try {
      const data = await DocenteRepository.getPlanificaciones(docenteId)
      planificaciones.value = data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id) {
    loading.value = true
    error.value = null
    try {
      const data = await DocenteRepository.getPlanificacionById(id)
      currentPlanificacion.value = data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function createPlanificacion(payload) {
    loading.value = true
    error.value = null
    try {
      const data = await DocenteRepository.createPlanificacion(payload)
      planificaciones.value.unshift(data)
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updatePlanificacion(id, payload) {
    loading.value = true
    error.value = null
    try {
      const data = await DocenteRepository.updatePlanificacion(id, payload)
      const idx = planificaciones.value.findIndex(p => p.id === Number(id))
      if (idx !== -1) planificaciones.value[idx] = data
      currentPlanificacion.value = data
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deletePlanificacion(id) {
    loading.value = true
    error.value = null
    try {
      await DocenteRepository.deletePlanificacion(id)
      planificaciones.value = planificaciones.value.filter(p => p.id !== Number(id))
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

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
