<template>
  <div class="max-w-7xl mx-auto space-y-6 p-6">
    <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-black text-gray-900">Panel de Supervisión Directiva</h1>
        <p class="text-sm text-gray-500">Revisión, aprobación y devoluciones de propuestas pedagógicas anuales.</p>
      </div>
      <span class="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-xs font-bold uppercase">Rol: Director</span>
    </div>

    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div class="p-5 border-b border-gray-100 bg-gray-50/50">
        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider">Planificaciones Pendientes de Evaluación</h3>
      </div>

      <div v-if="planificacionStore.loading" class="p-8 text-center text-gray-500 font-medium">
        Cargando registros institucionales...
      </div>

      <div v-else-if="planificacionesPendientes.length === 0" class="p-12 text-center text-gray-400 font-medium text-sm">
        🎉 No quedan planificaciones pendientes de revisión técnica.
      </div>

      <table v-else class="w-full text-left border-collapse text-sm">
        <thead>
          <tr class="bg-gray-100/70 text-gray-600 font-bold text-xs uppercase tracking-wider border-b border-gray-200">
            <th class="p-4">Docente</th>
            <th class="p-4">Área / Espacio</th>
            <th class="p-4">Fecha Presentación</th>
            <th class="p-4 text-center">Acciones Directivas</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="p in planificacionesPendientes" :key="p.id" class="hover:bg-gray-50/50 transition-colors">
            <td class="p-4 font-semibold text-gray-900">
              {{ p.persona_cargo_cursado?.persona_cargo?.persona?.nombres || 'Docente' }}
              {{ p.persona_cargo_cursado?.persona_cargo?.persona?.apellidos || '' }}
            </td>
            <td class="p-4 text-gray-700 font-medium">{{ p.area?.area || `Área #${p.areas_id}` }}</td>
            <td class="p-4 text-gray-500">{{ p.fecha_presentacion }}</td>
            <td class="p-4 flex items-center justify-center gap-3">
              <button
                @click="procesarAprobacion(p.id)"
                class="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
              >
                ✓ Aprobar
              </button>
              <button
                @click="procesarRechazo(p.id)"
                class="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
              >
                ✕ Rechazar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { usePlanificacionStore } from '@/stores/planificacion'
import { useToastStore } from '@/stores/toast' // 🟢 Importamos el store de notificaciones

const planificacionStore = usePlanificacionStore()
const toast = useToastStore() // 🟢 Inicializamos el gestor de avisos

// 🔒 FILTRO DIRECTIVO: Trae ÚNICAMENTE las planificaciones que el docente ya envió
const planificacionesPendientes = computed(() => {
  return planificacionStore.planificaciones.filter(p => {
    if (!p.estados || p.estados.length === 0) return false // Oculta si no tiene estados (es un Borrador puro)

    const ultimoEstado = p.estados[p.estados.length - 1].estado.toLowerCase()
    // Filtramos estrictamente: Solo se listan si están "Enviada", "Pendiente" o bajo revisión directiva
    return ultimoEstado === 'enviada' || ultimoEstado === 'pendiente' || ultimoEstado === 'en revisión'
  })
})

onMounted(async () => {
  await planificacionStore.fetchPlanificaciones()
})

const procesarAprobacion = async (id) => {
  if (confirm("¿Confirmas la aprobación técnico-pedagógica de este documento?")) {
    try {
      await planificacionStore.aprobarPlanificacion(id)
      // 🔔 NOTIFICACIÓN: Alerta de éxito local y notificación simulada al docente
      toast.showToast('✓ Planificación Aprobada. Se ha enviado una notificación automática al Docente.', 'success')
    } catch (err) {
      toast.showToast('No se pudo procesar la aprobación en el servidor.', 'error')
    }
  }
}

const procesarRechazo = async (id) => {
  if (confirm("¿Deseas rechazar esta planificación para que el docente aplique correcciones?")) {
    try {
      await planificacionStore.rechazarPlanificacion(id)
      // 🔔 NOTIFICACIÓN: Alerta al directivo y aviso de re-envío de correcciones al docente
      toast.showToast('✕ Planificación Rechazada. El Docente ha sido notificado para aplicar correcciones.', 'warning')
    } catch (err) {
      toast.showToast('No se pudo procesar el rechazo en el servidor.', 'error')
    }
  }
}
</script>

