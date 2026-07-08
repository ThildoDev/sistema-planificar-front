<template>
  <div class="space-y-6 animate-in fade-in duration-300">

    <div class="flex flex-col md:flex-row md:justify-between md:items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm gap-4">
      <div>
        <h1 class="text-xl font-bold text-slate-900 tracking-tight">Mis Planificaciones Anuales</h1>
        <p class="text-xs text-slate-500 mt-1">Gestioná, editá y revisá el estado de tus propuestas pedagógicas conectadas al sistema central.</p>
      </div>
      <button
        @click="openModal"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/10 active:scale-98"
      >
        + Nueva Planificación
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md/5 transition-all">
        <div class="text-base p-2.5 bg-slate-50 border border-slate-100 rounded-xl">📋</div>
        <div>
          <p class="text-xxs font-bold text-slate-400 uppercase tracking-wider">Total Cargadas</p>
          <h3 class="text-xl font-black text-slate-900 mt-0.5">{{ totalPlanificaciones }}</h3>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md/5 transition-all">
        <div class="text-base p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl">✅</div>
        <div>
          <p class="text-xxs font-bold text-slate-400 uppercase tracking-wider">Aprobadas</p>
          <h3 class="text-xl font-black text-emerald-600 mt-0.5">{{ totalAprobadas }}</h3>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md/5 transition-all">
        <div class="text-base p-2.5 bg-blue-50 border border-blue-100 rounded-xl">⏳</div>
        <div>
          <p class="text-xxs font-bold text-slate-400 uppercase tracking-wider">En Revisión</p>
          <h3 class="text-xl font-black text-blue-600 mt-0.5">{{ totalEnRevision }}</h3>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md/5 transition-all">
        <div class="text-base p-2.5 bg-amber-50 border border-amber-100 rounded-xl">⚠️</div>
        <div>
          <p class="text-xxs font-bold text-slate-400 uppercase tracking-wider">A Corregir / Obs.</p>
          <h3 class="text-xl font-black text-amber-600 mt-0.5">{{ totalACorregir }}</h3>
        </div>
      </div>
    </div>

    <div class="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-100" v-if="planificacionStore.loading">
      <div class="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
      <p class="text-xs font-medium text-slate-500">Sincronizando con el servidor de Laravel...</p>
    </div>

    <div class="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 text-xs flex items-center gap-3" v-else-if="planificacionStore.error">
      <span>⚠️</span>
      <p class="font-medium">{{ planificacionStore.error }}</p>
    </div>

    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" v-else>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/70 border-b border-slate-100 text-xxs font-bold text-slate-500 uppercase tracking-wider">
              <th class="p-4 pl-6 w-16">ID</th>
              <th class="p-4">Fecha Presentación</th>
              <th class="p-4">Materia / Área</th>
              <th class="p-4">Tipo</th>
              <th class="p-4">Estado</th>
              <th class="p-4 text-center pr-6 w-52">Acciones</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-50 text-xs text-slate-700">
            <tr v-if="planificacionesFiltradas.length === 0">
              <td class="p-12 text-center text-slate-400 font-medium" colspan="6">
                No tenés ninguna planificación anual cargada en el sistema.
              </td>
            </tr>

            <tr class="hover:bg-slate-50/40 transition-colors" v-for="item in planificacionesFiltradas" :key="item?.id">
              <td class="p-4 pl-6 font-bold text-slate-400">#{{ item?.id }}</td>

              <td class="p-4 font-semibold text-slate-800">
                {{ formatFechaAmigable(item?.fecha_presentacion) }}
              </td>

              <td class="p-4 font-medium text-slate-900">
                {{ item?.area?.area || 'Sin especificar' }}
              </td>

              <td class="p-4">
                <span class="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-xxs font-bold uppercase tracking-wider">
                  {{ item?.tipo_planificacion || 'Anual' }}
                </span>
              </td>
              <td class="p-4">
                <span class="px-2.5 py-1 rounded-full text-xxs font-bold tracking-wide border uppercase" :class="formatStatus(obtenerUltimoEstado(item))">
                  {{ obtenerUltimoEstado(item) }}
                </span>
              </td>

              <td class="p-4 pr-6">
                <div class="flex items-center justify-center gap-1.5">

                  <button
                    @click.prevent="router.push(`/planificaciones/ver/${item?.id}`)"
                    class="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 active:scale-95 text-slate-700 border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-xl text-xxs font-bold transition-all uppercase tracking-wider shadow-sm"
                    title="Visualizar documento completo"
                  >
                    <svg class="w-3.5 h-3.5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    Ver
                  </button>

                  <button
                    v-if="['borrador', 'rechazado', 'rechazada', 'a corregir', 'corregir', 'observado'].includes(obtenerUltimoEstado(item).toLowerCase().trim())"
                    @click.prevent="router.push(`/planificaciones/editar/${item?.id}`)"
                    class="inline-flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 active:scale-95 text-amber-800 border border-amber-200/60 px-3 py-1.5 rounded-xl text-xxs font-bold transition-all uppercase tracking-wider shadow-sm shadow-amber-100/50"
                  >
                    <svg class="w-3.5 h-3.5 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                    </svg>
                    Editar
                  </button>

                  <button
                    v-if="!obtenerUltimoEstado(item).toLowerCase().trim().includes('aprob')"
                    @click.prevent="procesarEnvioDirector(item?.id)"
                    class="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-3 py-1.5 rounded-xl text-xxs font-bold transition-all uppercase tracking-wider shadow-sm shadow-blue-500/20"
                  >
                    <svg class="w-3.5 h-3.5 text-blue-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L6 12Zm0 0h7.5" />
                    </svg>
                    Enviar
                  </button>

                </div>
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

const planificacionesFiltradas = computed(() => planificacionStore.planificaciones || [])

onMounted(async () => {
  await planificacionStore.fetchPlanificaciones()
})

// --- FUNCIONES DE FORMATEO ---

const formatFechaAmigable = (fechaStr) => {
  if (!fechaStr) return 'No definida'

  const soloFecha = fechaStr.split('T')[0]
  const date = new Date(soloFecha.replace(/-/g, '\/'))

  if (isNaN(date.getTime())) return fechaStr

  return date.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const obtenerUltimoEstado = (item) => {
  if (!item?.estados || item.estados.length === 0) {
    return item?.estado || 'Borrador'
  }
  return item.estados[item.estados.length - 1].estado || 'Borrador'
}

const formatStatus = (status) => {
  if (!status) return 'bg-slate-50 text-slate-600 border-slate-200'
  const normalized = status.toLowerCase().trim()

  if (normalized.includes('aprob') || normalized === 'aprobada') {
    return 'bg-emerald-50 text-emerald-700 border-emerald-100/60'
  }
  if (normalized.includes('obs') || normalized.includes('rechaz') || normalized.includes('corregir')) {
    return 'bg-amber-50 text-amber-700 border-amber-100/60'
  }
  if (normalized.includes('revis') || normalized.includes('envi') || normalized.includes('pend')) {
    return 'bg-blue-50 text-blue-700 border-blue-100/60'
  }
  return 'bg-slate-50 text-slate-600 border-slate-200'
}

// --- CONTADORES DINÁMICOS PARA LAS TARJETAS ---

const totalPlanificaciones = computed(() => planificacionesFiltradas.value.length)

const totalAprobadas = computed(() => {
  return planificacionesFiltradas.value.filter(item => {
    const estado = obtenerUltimoEstado(item).toLowerCase().trim()
    return estado.includes('aprob')
  }).length
})

const totalEnRevision = computed(() => {
  return planificacionesFiltradas.value.filter(item => {
    const estado = obtenerUltimoEstado(item).toLowerCase().trim()
    return estado.includes('revis') || estado.includes('envi') || estado.includes('pend')
  }).length
})

const totalACorregir = computed(() => {
  return planificacionesFiltradas.value.filter(item => {
    const estado = obtenerUltimoEstado(item).toLowerCase().trim()
    return estado.includes('obs') || estado.includes('rechaz') || estado.includes('corregir')
  }).length
})

// --- ACCIONES ---

const openModal = () => {
  router.push('/planificaciones/nueva')
}

const procesarEnvioDirector = async (id) => {
  if (!id) return
  if (confirm("¿Estás seguro de que querés enviar esta planificación al Director? Al hacerlo pasará a modo de revisión.")) {
    try {
      const { useToastStore } = await import('@/stores/toast')
      const toast = useToastStore()

      await planificacionStore.enviarARevision(id)
      toast.showToast('🚀 ¡Planificación enviada con éxito! Se ha notificado al Director para su revisión.', 'success')
    } catch (err) {
      console.error("Fallo técnico en la interfaz al despachar el documento:", err)
    }
  }
}
</script>

<style scoped>
.text-xxs {
  font-size: 0.68rem;
}
</style>
