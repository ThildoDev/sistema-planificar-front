import api from '@/plugins/axios'

/**
 * DirectorRepository
 * Encapsula todas las peticiones HTTP del módulo Director.
 */
class DirectorRepository {
  // ── Planificaciones ──────────────────────────────────────────────────────────

  async getPlanificaciones(params = {}) {
    const response = await api.get('/planificaciones', { params })
    return response.data
  }

  async getPlanificacion(id) {
    const response = await api.get(`/planificaciones/${id}`)
    return response.data
  }

  async aprobarPlanificacion(id) {
    const response = await api.put(`/planificaciones/${id}/aprobar`)
    return response.data
  }

  async observarPlanificacion(id, data) {
    const response = await api.put(`/planificaciones/${id}/observar`, data)
    return response.data
  }

  // ── Usuarios / Docentes ───────────────────────────────────────────────────────

  async getUsuarios(params = {}) {
    const response = await api.get('/users', { params })
    return response.data
  }

  async asignarRol(userId, role) {
    const response = await api.put(`/users/${userId}/role`, { role })
    return response.data
  }
}

export default new DirectorRepository()
