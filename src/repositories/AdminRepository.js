import api from '@/plugins/axios'

/**
 * AdminRepository
 * Encapsula todas las peticiones HTTP del módulo Administrador.
 */
class AdminRepository {
  /**
   * Registra un nuevo usuario en el sistema.
   * El backend asigna role='user' por defecto.
   * POST /api/register
   */
  async register(data) {
    const response = await api.post('/register', data)
    return response.data
  }

  /**
   * Obtiene el listado de todos los usuarios.
   * GET /api/users  (confirmar endpoint con backend team)
   */
  async getUsuarios(params = {}) {
    const response = await api.get('/users', { params })
    return response.data
  }

  /**
   * Cambia el rol de un usuario específico.
   * PUT /api/users/:id/role
   * Admin puede asignar: admin / director / docente / user
   */
  async asignarRol(userId, role) {
    const response = await api.put(`/users/${userId}/role`, { role })
    return response.data
  }

  /**
   * Blanquea la contraseña de un usuario.
   * Endpoint a confirmar con backend team.
   */
  async resetPassword(userId, data) {
    const response = await api.put(`/users/${userId}/reset-password`, data)
    return response.data
  }
}

export default new AdminRepository()
