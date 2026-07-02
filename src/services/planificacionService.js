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
  }
}
