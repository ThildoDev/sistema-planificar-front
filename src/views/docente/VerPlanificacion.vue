<template>
  <div class="max-w-5xl mx-auto space-y-6 pb-12">

    <div class="flex items-start gap-3.5 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <button
        class="w-9 h-9 border border-slate-200 rounded-lg bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors mt-0.5 flex-shrink-0"
        @click="goBack"
      >
        <ArrowLeft :size="16" />
      </button>
      <div class="flex-1">
        <h2 class="text-xl font-bold text-slate-900 m-0">Inspección de Planificación</h2>
        <p class="text-sm text-slate-500 m-0 mt-0.5">Consulta los bloques didácticos guardados en el sistema y el historial de auditoría.</p>
      </div>
      <span
        :class="authStore.userRole === 'director' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'"
        class="px-3 py-1 border rounded-full text-xs font-bold uppercase tracking-wider"
      >
        Modo: {{ authStore.userRole }}
      </span>
    </div>

    <template v-if="loading">
      <div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden animate-pulse">
        <div class="flex items-center justify-between p-5 border-b border-slate-100 gap-4">
          <div class="h-5 w-48 bg-slate-200 rounded-md"></div>
          <div class="h-6 w-24 bg-slate-200 rounded-full"></div>
        </div>
        <div class="p-6 space-y-5">
          <div v-for="i in 4" :key="i" class="space-y-2">
            <div class="h-3 w-32 bg-slate-200 rounded-md"></div>
            <div class="h-16 w-full bg-slate-100 rounded-lg"></div>
          </div>
        </div>
      </div>
    </template>

    <div v-else-if="error" class="p-6 text-center bg-white rounded-xl border border-red-200 text-red-500 flex flex-col items-center gap-3">
      <AlertCircle :size="40" />
      <p class="font-medium">{{ error }}</p>
      <button class="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors" @click="goBack">
        Volver
      </button>
    </div>

    <template v-else-if="currentPlanificacion">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

        <div class="lg:col-span-2 space-y-5">

          <div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div class="flex items-start justify-between gap-4 p-5 border-b border-slate-100">
              <div class="space-y-1">
                <h3 class="text-lg font-bold text-slate-900 m-0">
                  {{ currentPlanificacion.area?.area || currentPlanificacion.area_curricular || 'Espacio Curricular' }}
                </h3>
                <div class="flex gap-4">
                  <span class="flex items-center gap-1 text-xs text-slate-500">
                    <CalendarDays :size="13" />
                    {{ formatDate(currentPlanificacion.fecha_presentacion) }}
                  </span>
                  <span class="flex items-center gap-1 text-xs text-slate-500">
                    <Tag :size="13" />
                    {{ currentPlanificacion.tipo_planificacion || 'Anual' }}
                  </span>
                </div>
              </div>
              <div class="flex items-center gap-2 flex-shrink-0">
                <StatusBadgeAnual :estado="obtenerUltimoEstado(currentPlanificacion)" />
                <RouterLink
                  v-if="authStore.userRole === 'docente' && canEdit(currentPlanificacion)"
                  :to="`/docente/editar/${currentPlanificacion.id}`"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs font-semibold hover:bg-amber-100 transition-colors text-decoration-none"
                >
                  <Pencil :size="14" />
                  Editar
                </RouterLink>
              </div>
            </div>

            <div v-if="tieneObservacionesHistoricas" class="p-5 pb-1 space-y-3 bg-amber-50/30 border-b border-slate-100">
              <div
                v-for="st in currentPlanificacion.estados"
                :key="st.id"
                v-show="st.observaciones"
                class="bg-amber-50 border border-amber-200 border-l-4 border-l-amber-500 rounded-lg p-3.5 space-y-1"
              >
                <div class="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                  <MessageSquare :size="14" />
                  <span>Observación Directiva ({{ st.fecha }})</span>
                </div>
                <p class="text-sm text-amber-900 m-0 font-medium leading-relaxed">{{ st.observaciones }}</p>
              </div>
            </div>

            <div class="p-5 space-y-5">
              <div v-for="field in contentFields" :key="field.key" class="space-y-1.5">
                <div class="flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-400 uppercase">
                  <component :is="field.icon" :size="14" />
                  {{ field.label }}
                </div>
                <div
                  class="bg-slate-50 border border-slate-100 rounded-lg p-4 text-sm text-slate-800 leading-relaxed ql-editor-content"
                  v-html="currentPlanificacion[field.key] || '—'"
                ></div>
              </div>
            </div>

            <div class="flex gap-4 flex-wrap p-4 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-400">
              <span class="flex items-center gap-1"><User :size="12" /> Cargo Cursado ID: {{ currentPlanificacion.persona_cargo_cursado_id }}</span>
              <span class="flex items-center gap-1"><Clock :size="12" /> Creado: {{ formatDatetime(currentPlanificacion.created_at) }}</span>
              <span class="flex items-center gap-1"><RefreshCw :size="12" /> Modificado: {{ formatDatetime(currentPlanificacion.updated_at) }}</span>
            </div>
          </div>

          <div v-if="authStore.userRole === 'director'" class="bg-white border border-slate-200 rounded-xl shadow-sm p-5 space-y-3">
            <div class="flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-500 uppercase">
              <MessageSquare :size="14" />
              Ingresar Evaluación Directiva u Observación Técnica
            </div>
            <textarea
              v-model="comentarioDirector"
              placeholder="Si vas a observar o rechazar este documento, escribe aquí las correcciones obligatorias paso a paso..."
              rows="3"
              class="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none font-medium text-slate-800 transition-colors"
            ></textarea>
            <div class="flex justify-end gap-3 pt-2">
              <button @click="procesarRechazo" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-md shadow-red-600/10 transition-colors">
                ✕ Rechazar con Observaciones
              </button>
              <button @click="procesarAprobacion" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-md shadow-emerald-600/10 transition-colors">
                ✓ Aprobar Propuesta Pedagógica
              </button>
            </div>
          </div>

        </div>

        <div class="bg-white border border-slate-200 rounded-xl shadow-sm lg:sticky lg:top-6 overflow-hidden">
          <div class="flex items-center gap-1.5 p-4 border-b border-slate-100 text-sm font-bold text-slate-900">
            <History :size="16" />
            <h4>Historial de Auditoría</h4>
          </div>

          <div class="p-4 space-y-0">
            <div v-if="!currentPlanificacion.estados || currentPlanificacion.estados.length === 0" class="text-xs text-slate-400 p-2 italic">
              Sin movimientos de estados registrados.
            </div>

            <div
              v-else
              v-for="(event, i) in currentPlanificacion.estados"
              :key="event.id"
              class="flex gap-3 relative"
            >
              <div
                :class="obtenerColorCirculo(event.estado)"
                class="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10"
              >
                <component :is="getStatusIcon(event.estado)" :size="12" />
              </div>

              <div v-if="i < currentPlanificacion.estados.length - 1" class="absolute left-[13px] top-7 bottom-0 w-0.5 bg-slate-100"></div>

              <div class="pb-5 flex-1 min-w-0">
                <div class="mb-1">
                  <StatusBadgeAnual :estado="event.estado" />
                </div>
                <p v-if="event.observaciones" class="text-xs text-slate-600 m-0 font-medium italic bg-slate-50 border border-slate-100 p-2 rounded-lg leading-relaxed mb-1">
                  💬 {{ event.observaciones }}
                </p>
                <span class="text-[10px] text-slate-400 block font-semibold">{{ event.fecha }}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </template>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  ArrowLeft, CalendarDays, Tag, MessageSquare, User, Clock,
  RefreshCw, History, AlertCircle, Pencil, CheckCircle2,
  XCircle, AlertTriangle, FileEdit, FilePlus
} from 'lucide-vue-next'
import StatusBadgeAnual from '@/components/docente/StatusBadgeAnual.vue'
import { usePlanificacion } from '@/composables/usePlanificacion'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { usePlanificacionStore } from '@/stores/planificacion'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const toast = useToastStore()
const planStore = usePlanificacionStore()

const { currentPlanificacion, loading, error, fetchById, canEdit } = usePlanificacion(false)
const planId = route.params.id
const comentarioDirector = ref('')

onMounted(() => fetchById(planId))

const tieneObservacionesHistoricas = computed(() => {
  return currentPlanificacion.value?.estados?.some(st => st.observaciones)
})

function obtenerUltimoEstado(plan) {
  if (plan.estados && plan.estados.length > 0) {
    return plan.estados[plan.estados.length - 1].estado
  }
  return plan.estado || 'Borrador'
}

function goBack() {
  if (authStore.userRole === 'director') {
    router.push('/revisiones')
  } else {
    router.push('/planificaciones')
  }
}

// Emisión asíncrona de firmas directivas hacia Pinia
const procesarAprobacion = async () => {
  if (confirm("¿Confirmas la aprobación final y firma de este documento pedagógico?")) {
    try {
      await planStore.aprobarPlanificacion(planId)
      toast.showToast('La propuesta anual ha sido autorizada con éxito.', 'success')
      goBack()
    } catch (err) {
      toast.showToast('No se pudo firmar el documento.', 'error')
    }
  }
}

const procesarRechazo = async () => {
  if (!comentarioDirector.value.trim()) {
    toast.showToast('Por favor, ingresá una observación para guiar al docente con sus correcciones.', 'warning')
    return
  }
  if (confirm("¿Confirmas el rechazo de la propuesta con las correcciones especificadas?")) {
    try {
      // Pasamos las observaciones recolectadas al store
      await planStore.rechazarPlanificacion(planId, {
        observaciones: comentarioDirector.value
      })
      toast.showToast('Se registraron las observaciones y el docente fue notificado.', 'warning')
      goBack()
    } catch (err) {
      toast.showToast('Error al impactar la auditoría en el servidor.', 'error')
    }
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })
}

function formatDatetime(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

function obtenerColorCirculo(estado) {
  if (!estado) return 'bg-slate-100 text-slate-500'
  const est = estado.toLowerCase()
  if (est.includes('aprob')) return 'bg-green-100 text-green-600'
  if (est.includes('envi') || est.includes('revis') || est.includes('pend')) return 'bg-amber-100 text-amber-600'
  if (est.includes('rechaz') || est.includes('obs') || est.includes('corregir')) return 'bg-red-100 text-red-600'
  return 'bg-slate-100 text-slate-500'
}

function getStatusIcon(estado) {
  const est = estado.toLowerCase()
  if (est.includes('aprob')) return CheckCircle2
  if (est.includes('envi') || est.includes('revis') || est.includes('pend')) return FilePlus
  return AlertTriangle
}

const contentFields = [
  { key: 'diagnostico', label: 'Diagnóstico del Grupo', icon: User },
  { key: 'aprendizajes_esperados', label: 'Aprendizajes Esperados', icon: CheckCircle2 },
  { key: 'saberes', label: 'Saberes / Contenidos', icon: FilePlus },
  { key: 'criterios', label: 'Criterios de Evaluación', icon: AlertTriangle },
  { key: 'bibliografia', label: 'Bibliografía', icon: History }
]
</script>

<style scoped>
/* Estilos profundos complementarios mínimos exclusivamente para estructurar el v-html de Quill */
.ql-editor-content :deep(ul) { list-style-type: disc; padding-left: 1.5rem; margin: 0.5rem 0; }
.ql-editor-content :deep(ol) { list-style-type: decimal; padding-left: 1.5rem; margin: 0.5rem 0; }
.ql-editor-content :deep(table) { width: 100%; border-collapse: collapse; margin: 0.75rem 0; }
.ql-editor-content :deep(table td), .ql-editor-content :deep(table th) { border: 1px solid #cbd5e1; padding: 0.4rem 0.6rem; text-align: left; }
.ql-editor-content :deep(table th) { background-color: #f8fafc; font-weight: 700; }
.ql-editor-content :deep(strong) { font-weight: 700; }
</style>
