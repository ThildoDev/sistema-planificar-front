// src/repositories/AdminRepository.js
import api from '@/plugins/axios'

/**
 * Repositorio de llamadas HTTP para el rol Administrador.
 */
const AdminRepository = {
  // ─────────────────────────────────────────────
  // USUARIOS
  // ─────────────────────────────────────────────

  /**
   * Obtiene todos los usuarios del sistema.
   * El admin puede ver todos los roles.
   */
  getUsuarios() {
    return api.get('/users')
  },

  /**
   * Crea un nuevo usuario.
   * POST /api/register → crea con role='user' por defecto.
   * @param {Object} data - { nombre, apellido, name, email, password }
   */
  crearUsuario(data) {
    return api.post('/register', data)
  },

  /**
   * Cambia el rol de un usuario.
   * El admin puede asignar cualquier rol.
   * @param {number|string} userId
   * @param {string} role
   */
  cambiarRolUsuario(userId, role) {
    return api.put(`/users/${userId}/role`, { role })
  },

  /**
   * Blanquea la contraseña de un usuario.
   * @param {number|string} userId
   * @param {string} password
   */
  resetPassword(userId, password) {
    return api.put(`/users/${userId}/password`, { password })
  },

  // ─────────────────────────────────────────────
  // PLANIFICACIONES (solo lectura para admin)
  // ─────────────────────────────────────────────

  getPlanificaciones(params = {}) {
    return api.get('/planificaciones', { params })
  },

  getPlanificacionById(id) {
    return api.get(`/planificaciones/${id}`)
  },
}

export default AdminRepository
