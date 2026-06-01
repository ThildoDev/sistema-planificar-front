import { storeToRefs } from 'pinia';
import { usePlanificacionStore } from '@/stores/planificacion';

export function usePlanificacion() {
    const store = usePlanificacionStore();
    const { planificaciones, loading, error } = storeToRefs(store);

    const cargarPlanificaciones = async () => {
        await store.fetchPlanificaciones();
    };

    return {
        planificaciones,
        loading,
        error,
        cargarPlanificaciones
    };
}
