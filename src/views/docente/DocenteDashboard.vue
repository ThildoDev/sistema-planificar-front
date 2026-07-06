<template>
  <div class="space-y-6">

    <div class="flex flex-col md:flex-row md:justify-between md:items-center bg-white p-6 rounded-xl border border-gray-200 shadow-sm gap-4">
      <div>
        <h1 class="text-xl font-bold text-gray-900">Mis Planificaciones Anuales</h1>
        <p class="text-sm text-gray-500 mt-1">Gestioná, editá y revisá el estado de tus propuestas pedagógicas conectadas al sistema central.</p>
      </div>
      <button @click="openModal" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md shadow-blue-600/10">
        + Nueva Planificación
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
        <div class="text-xl p-3 bg-gray-50 border border-gray-100 rounded-lg">📋</div>
        <div>
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Entregadas</p>
          <h3 class="text-2xl font-bold text-gray-900 mt-0.5">{{ planificacionStore.totalEntregadas }}</h3>
        </div>
      </div>

      <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
        <div class="text-xl p-3 bg-green-50 border border-green-100 rounded-lg">✅</div>
        <div>
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Aprobadas</p>
          <h3 class="text-2xl font-bold text-green-700 mt-0.5">{{ planificacionStore.totalAprobadas }}</h3>
        </div>
      </div>

      <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
        <div class="text-xl p-3 bg-blue-50 border border-blue-100 rounded-lg">⏳</div>
        <div>
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">En Revisión</p>
          <h3 class="text-2xl font-bold text-blue-700 mt-0.5">{{ planificacionStore.totalPendientes }}</h3>
        </div>
      </div>

      <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
        <div class="text-xl p-3 bg-amber-50 border border-amber-100 rounded-lg">⚠️</div>
        <div>
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">A Corregir</p>
          <h3 class="text-2xl font-bold text-amber-700 mt-0.5">{{ planificacionStore.totalACorregir }}</h3>
        </div>
      </div>
    </div>

    <div class="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-gray-200" v-if="planificacionStore.loading">
      <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p class="text-sm font-medium text-gray-500">Sincronizando con el servidor de Laravel...</p>
    </div>

    <div class="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-3" v-else-if="planificacionStore.error">
      <span>⚠️</span>
      <p class="font-medium">{{ planificacionStore.error }}</p>
    </div>

    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden" v-else>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">
              <th class="p-4 pl-6 w-16">ID</th>
              <th class="p-4">Fecha Presentación</th>
              <th class="p-4">Saberes / Ejes</th>
              <th class="p-4">Tipo</th>
              <th class="p-4">Estado</th>
              <th class="p-4 text-center pr-6 w-32">Acciones</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100 text-sm text-gray-700">
            <tr v-if="planificacionesFiltradas.length === 0">
              <td class="p-12 text-center text-gray-400 font-medium" colspan="6">
                No tenés ninguna planificación anual cargada en el sistema.
              </td>
            </tr>

            <tr class="hover:bg-gray-50/70 transition-colors" v-for="item in planificacionesFiltradas" :key="item?.id">
              <td class="p-4 pl-6 font-semibold text-gray-400">#{{ item?.id }}</td>
              <td class="p-4 font-medium text-gray-900">{{ item?.fecha_presentacion || 'No definida' }}</td>
              <td class="p-4 max-w-xs truncate text-gray-600" :title="item?.saberes">
                {{ item?.saberes ? item.saberes.replace(/<[^>]*>/g, '') : 'Sin especificar' }}
              </td>
              <td class="p-4">
                <span class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-semibold uppercase border border-gray-200">
                  {{ item?.tipo_planificacion || 'Anual' }}
                </span>
              </td>
              <td class="p-4">
                <span class="px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border uppercase" :class="formatStatus(obtenerUltimoEstado(item))">
                  {{ obtenerUltimoEstado(item) }}
                </span>
              </td>
              <td class="p-4 text-center pr-6">
                <button
                  v-if="obtenerUltimoEstado(item).toLowerCase() === 'borrador' || obtenerUltimoEstado(item).toLowerCase() === 'pendiente'"
                  @click.prevent="procesarEnvioDirector(item?.id)"
                  class="text-blue-600 hover:text-blue-800 font-semibold text-xs bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-100 transition-all uppercase tracking-wider"
                >
                  enviar a revisión
                </button>
                <span v-else class="text-xs font-bold text-gray-400 italic">Enviado</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePlanificacionStore } from '@/stores/planificacion'

const planificacionStore = usePlanificacionStore()
const router = useRouter()

const planificacionesFiltradas = computed(() => planificacionStore.planificaciones)

onMounted(async () => {
  await planificacionStore.fetchPlanificaciones()
})

const openModal = () => {
  router.push('/planificaciones/nueva')
}

// Handler seguro para realizar el disparo asíncrono hacia el servicio con notificación
const procesarEnvioDirector = async (id) => {
  if (!id) return
  if (confirm("¿Estás seguro de que querés enviar esta planificación al Director? Al hacerlo pasará a modo de revisión.")) {
    try {
      const { useToastStore } = await import('@/stores/toast') // Importación dinámica segura
      const toast = useToastStore()

      await planificacionStore.enviarARevision(id)

      // 🔔 NOTIFICACIÓN CRUZADA: Alerta instantánea al Docente confirmando el aviso al Director
      toast.showToast('🚀 ¡Planificación enviada con éxito! Se ha notificado al Director para su revisión.', 'success')
    } catch (err) {
      console.error("Fallo técnico en la interfaz al despachar el documento:", err)
    }
  }
}

// Extrae de forma segura el último estado del histórico de Laravel estados_anual
const obtenerUltimoEstado = (item) => {
  if (!item?.estados || item.estados.length === 0) {
    return item?.estado || 'Borrador'
  }
  return item.estados[item.estados.length - 1].estado || 'Borrador'
}

const formatStatus = (status) => {
  if (!status) return 'bg-gray-50 text-gray-600 border-gray-200'
  const normalized = status.toLowerCase()

  if (normalized.includes('aprob') || normalized === 'aprobada') {
    return 'bg-green-50 text-green-700 border-green-200'
  }
  if (normalized.includes('obs') || normalized.includes('rechaz') || normalized.includes('corregir')) {
    return 'bg-amber-50 text-amber-700 border-amber-200'
  }
  if (normalized.includes('revis') || normalized.includes('envi') || normalized.includes('pend')) {
    return 'bg-blue-50 text-blue-700 border-blue-200'
  }
  return 'bg-gray-50 text-gray-600 border-gray-200'
}
</script>
