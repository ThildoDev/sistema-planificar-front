import api from '@/plugins/axios' // Tu plugin configurado con baseURL apuntando a /api

export default {
  // Traer planificaciones para el docente / director
  getPlanificacionesAnuales() {
    return api.get('/planificaciones/anuales')
      .then(response => response.data)
  },

  // Obtener una específica por su ID
  getPlanificacionById(id) {
    return api.get(`/planificaciones/${id}`)
      .then(response => response.data)
  },

  // Actualizar datos o estados de una planificación (Ruta dinámica que causaba el conflicto)
  updatePlanificacion(id, payload) {
    return api.put(`/planificaciones/${id}`, payload)
      .then(response => response.data)
  },

  createPlanificacion(payload) {
    return api.post('/planificaciones/anuales', payload).then(res => res.data)
  },

  // 🚀 Enviar a revisión (Docente)
  enviarARevision(id) {
    return api.post(`/planificaciones/anuales/${id}/estados/enviar-revision`)
      .then(response => response.data)
  },

  // 🍏 Aprobar planificación (Director)
  aprobarPlanificacion(id) {
    return api.post(`/planificaciones/anuales/${id}/estados/aprobar`)
      .then(response => response.data)
  },

  // 🍎 Rechazar planificación (Director)
  rechazarPlanificacion(id) {
    return api.post(`/planificaciones/anuales/${id}/estados/rechazar`)
      .then(response => response.data)
  }
}
