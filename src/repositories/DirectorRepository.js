import api from '@/plugins/axios'

/**
 * DirectorRepository
 * Encapsula todas las llamadas HTTP del módulo Director.
 * Separación estricta: solo axios, sin lógica de negocio.
 */
const DirectorRepository = {
  // ─── PLANIFICACIONES ────────────────────────────────────────────

  /**
   * Obtiene todas las planificaciones visibles para el director.
   * @param {Object} params - Filtros opcionales: area_id, estado, tipo, docente_id
   */
  getPlanificaciones(params = {}) {
    return api.get('/planificaciones', { params })
  },

  /**
   * Obtiene una planificación completa por ID.
   * Incluye: area, estados_anual, persona_cargo_cursado con relaciones.
   * @param {number|string} id
   */
  getPlanificacion(id) {
    return api.get(`/planificaciones/${id}`)
  },

  // ─── ESTADOS / REVISIÓN ──────────────────────────────────────────

  /**
   * Aprueba una planificación.
   * El backend crea un estado_anual con estado='Aprobado'.
   * @param {number|string} id - ID de planificacion_anual
   */
  aprobarPlanificacion(id) {
    return api.post(`/planificaciones/${id}/aprobar`)
  },

  /**
   * Rechaza una planificación con observaciones obligatorias.
   * El backend crea un estado_anual con estado='Rechazado'.
   * @param {number|string} id
   * @param {Object} payload - { categoria: string, observacion: string }
   */
  rechazarPlanificacion(id, payload) {
    return api.post(`/planificaciones/${id}/rechazar`, payload)
  },

  /**
   * Agrega una observación sin cambiar el estado final.
   * @param {number|string} id
   * @param {Object} payload - { categoria: string, observacion: string }
   */
  agregarObservacion(id, payload) {
    return api.post(`/planificaciones/${id}/observaciones`, payload)
  },

  // ─── USUARIOS ────────────────────────────────────────────────────

  /**
   * Obtiene usuarios con role='user' o role='docente'.
   * El director solo puede ver/modificar estos roles.
   */
  getUsuarios() {
    return api.get('/users', {
      params: { roles: 'user,docente' },
    })
  },

  /**
   * Cambia el rol de un usuario.
   * Director solo puede asignar: 'user' | 'docente'
   * El backend valida la jerarquía y devuelve 403 si se excede.
   * @param {number|string} userId
   * @param {string} role - 'user' | 'docente'
   */
  cambiarRol(userId, role) {
    return api.put(`/users/${userId}/role`, { role })
  },
}

export default DirectorRepository
