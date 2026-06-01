import axios from 'axios'; // O tu cliente HTTP configurado

export default {
    /**
     * Obtiene el listado de planificaciones del docente autenticado.
     * @returns {Promise<AxiosResponse>}
     */
    getPlanificaciones() {
        return axios.get('/api/planificaciones');
    }

    // Futuras implementaciones: uploadPlanificacion(), getHistorial()
};
