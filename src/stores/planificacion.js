import { defineStore } from 'pinia';
import DocenteRepository from '@/repositories/DocenteRepository';

export const usePlanificacionStore = defineStore('planificacion', {
    state: () => ({
        planificaciones: [],
        loading: false,
        error: null
    }),

    actions: {
        async fetchPlanificaciones() {
            this.loading = true;
            this.error = null;
            try {
                const response = await DocenteRepository.getPlanificaciones();
                this.planificaciones = response.data;
            } catch (err) {
                this.error = err.message || 'Error al cargar las planificaciones';
            } finally {
                this.loading = false;
            }
        }
    }
});
