import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import DirectorRepository from '@/repositories/DirectorRepository'

export const useRevisionStore = defineStore('revision', () => {
  // ─── Estado ───────────────────────────────────────────────────────────────
  const planificaciones = ref([])
  const planificacionActual = ref(null)
  const loading = ref(false)
  const loadingAction = ref(false)
  const error = ref(null)
  const successMsg = ref(null)

  // ─── Getters ──────────────────────────────────────────────────────────────
  const totalPlanificaciones = computed(() => planificaciones.value.length)

  const getUltimoEstado = (planificacion) => {
    const estados = planificacion?.estados_anual
    if (!estados?.length) return null
    return [...estados].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0]
  }

  const pendientesRevision = computed(
    () =>
      planificaciones.value.filter((p) => {
        const ult = getUltimoEstado(p)
        return ult?.estado === 'Revisado'
      }).length,
  )

  const aprobadas = computed(
    () =>
      planificaciones.value.filter((p) => {
        const ult = getUltimoEstado(p)
        return ult?.estado === 'Aprobado'
      }).length,
  )

  const conObservaciones = computed(
    () =>
      planificaciones.value.filter((p) => {
        const ult = getUltimoEstado(p)
        return ult?.estado === 'Rechazado'
      }).length,
  )

  // ─── Helpers ──────────────────────────────────────────────────────────────
  function clearMessages() {
    error.value = null
    successMsg.value = null
  }

  // ─── Acciones ─────────────────────────────────────────────────────────────

  async function fetchPlanificaciones(params = {}) {
    loading.value = true
    clearMessages()
    try {
      const data = await DirectorRepository.getPlanificaciones(params)
      planificaciones.value = Array.isArray(data) ? data : (data.data ?? [])
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al cargar planificaciones.'
    } finally {
      loading.value = false
    }
  }

  async function fetchPlanificacion(id) {
    loading.value = true
    clearMessages()
    try {
      const data = await DirectorRepository.getPlanificacion(id)
      planificacionActual.value = data
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al cargar la planificación.'
    } finally {
      loading.value = false
    }
  }

  async function aprobar(id) {
    loadingAction.value = true
    clearMessages()
    try {
      await DirectorRepository.aprobarPlanificacion(id)
      successMsg.value = 'Planificación aprobada exitosamente.'
      return { ok: true }
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al aprobar la planificación.'
      return { ok: false }
    } finally {
      loadingAction.value = false
    }
  }

  async function observar(id, data) {
    loadingAction.value = true
    clearMessages()
    try {
      await DirectorRepository.observarPlanificacion(id, data)
      successMsg.value = 'Observaciones enviadas. El docente será notificado.'
      return { ok: true }
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al enviar observaciones.'
      return { ok: false }
    } finally {
      loadingAction.value = false
    }
  }

  return {
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
    getUltimoEstado,
    fetchPlanificaciones,
    fetchPlanificacion,
    aprobar,
    observar,
    clearMessages,
  }
})
