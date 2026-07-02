import api from '@/plugins/axios'; // Importa tu configuración actual de Axios

export const planificacionRepository = {
  // 1. GET - Obtener todas las planificaciones anuales (Docente / General)
  async getAllAnuales() {
    const response = await api.get('/api/planificaciones/anuales');
    return response.data;
  },

  // 2. POST - Crear una nueva planificación anual (Rol: docente)
  async createAnual(data) {
    // data debe contener: fecha_presentacion, aprendizajes_esperados, saberes, criterios, bibliografia, diagnostico, areas_id, persona_cargo_cursado_id, tipo_planificacion
    const response = await api.post('/api/planificaciones/anuales', data);
    return response.data;
  },

  // 3. PUT - Actualizar campos opcionales de una planificación anual (Rol: docente)
  async updateAnual(id, data) {
    const response = await api.put(`/api/planificaciones/anuales/${id}`, data);
    return response.data;
  },

  // 4. DELETE - Ocultar/Mandar a la papelera una planificación (Rol: admin)
  async deleteAnual(id) {
    const response = await api.delete(`/api/planificaciones/anuales/${id}`);
    return response.data;
  },

  // 5. GET - Obtener la lista de planificaciones eliminadas (Rol: admin)
  async getPapelera() {
    const response = await api.get('/api/planificaciones/anuales/gestion/papelera');
    return response.data;
  },

  // 6. POST - Restaurar una planificación de la papelera (Rol: admin)
  async restoreAnual(id) {
    const response = await api.post(`/api/planificaciones/anuales/${id}/restore`);
    return response.data;
  }
};
