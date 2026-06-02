// import { defineStore } from 'pinia'
// import { ref, computed } from 'vue'
// // import DocenteRepository from '@/repositories/DocenteRepository'    sacar comentario para usar la petición real al backend, dejarlo comentado para pruebas con datos simulados

// export const usePlanificacionStore = defineStore('planificacion', () => {
//   // ─── Estado ───────────────────────────────────────────────────────────────
//   const planificaciones = ref([])
//   const loading = ref(false)
//   const error = ref(null)

//   // ─── Getters ──────────────────────────────────────────────────────────────
//   const totalPlanificaciones = computed(() => planificaciones.value.length)

//   const planificacionesAprobadas = computed(() =>
//     planificaciones.value.filter((p) => p.estados_anual === 'Aprobado').length
//   )

//   const planificacionesPendientes = computed(() =>
//     planificaciones.value.filter((p) => p.estados_anual === 'Pendiente').length
//   )

//   // ─── Helpers ──────────────────────────────────────────────────────────────
//   function clearErrors() {
//     error.value = null
//   }

//   // ─── Acciones ─────────────────────────────────────────────────────────────
//   async function fetchPlanificaciones() {
//     loading.value = true
//     clearErrors()
//     try {
//       const data = await DocenteRepository.getPlanificaciones()
//       // Adaptación flexible si el backend envuelve la respuesta en data o data.data
//       planificaciones.value = Array.isArray(data) ? data : (data.data ?? [])
//     } catch (err) {
//       error.value = err.response?.data?.message || 'Error al cargar las planificaciones.'
//     } finally {
//       loading.value = false
//     }
//   }
//   return {
//     // Estado
//     planificaciones,
//     loading,
//     error,
//     // Getters
//     totalPlanificaciones,
//     planificacionesAprobadas,
//     planificacionesPendientes,
//     // Acciones
//     fetchPlanificaciones,
//     clearErrors
//   }
// })

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import DocenteRepository from '@/repositories/DocenteRepository'

export const usePlanificacionStore = defineStore('planificacion', () => {
  const planificaciones = ref([])
  const loading = ref(false)
  const loadingAction = ref(false)
  const error = ref(null)

  const totalPlanificaciones = computed(() => planificaciones.value.length)

  const planificacionesAprobadas = computed(() =>
    planificaciones.value.filter((p) => p.estados_anual === 'Aprobado').length
  )

  const planificacionesPendientes = computed(() =>
    planificaciones.value.filter((p) => p.estados_anual === 'Pendiente' || p.estados_anual === 'Observado' || p.estados_anual === 'A corregir').length
  )

  function clearErrors() {
    error.value = null
  }

  async function fetchPlanificaciones() {
    loading.value = true
    clearErrors()
    try {
      // Llama al repositorio (que actualmente devuelve los datos simulados)
      const data = await DocenteRepository.getPlanificaciones()
      planificaciones.value = Array.isArray(data) ? data : (data.data ?? [])
    } catch (err) {
      error.value = err.message || 'Error al cargar las planificaciones.'
    } finally {
      loading.value = false
    }
  }
  async function crearPlanificacion(formData) {
    loadingAction.value = true
    clearErrors()
    try {
      const data = await DocenteRepository.storePlanificacion(formData)
      // Si el backend retorna el objeto creado, lo inyectamos al inicio de la lista reactiva
      const nuevaPlan = data.planificacion || data
      if (nuevaPlan) planificaciones.value.unshift(nuevaPlan)
      return { ok: true }
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al guardar la planificación.'
      return { ok: false }
    } finally {
      loadingAction.value = false
    }
  }

  return {
    planificaciones,
    loading,
    error,
    loadingAction,
    totalPlanificaciones,
    planificacionesAprobadas,
    planificacionesPendientes,
    fetchPlanificaciones,
    crearPlanificacion,
    clearErrors
  }
})
