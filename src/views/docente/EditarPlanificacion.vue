<template>
  <div class="max-w-4xl mx-auto space-y-6 pb-12">

    <div v-if="accessBlocked" class="flex items-center justify-between gap-4 p-4 bg-orange-50 border border-orange-200 border-l-4 border-l-orange-500 rounded-xl">
      <div class="flex items-start gap-3 text-orange-700">
        <ShieldAlert :size="20" class="mt-0.5 flex-shrink-0" />
        <div>
          <strong class="block text-sm font-bold text-orange-900">Acceso Restringido</strong>
          <p class="text-xs text-amber-800 m-0 leading-relaxed">{{ error || 'No tienes permisos para editar este documento o se encuentra en estado de revisión.' }}</p>
        </div>
      </div>
      <button
        @click="goBack"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-200 transition-colors"
      >
        Volver
      </button>
    </div>

    <div v-else-if="loading" class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden animate-pulse">
      <div class="p-4 border-b border-slate-100">
        <div class="h-5 w-48 bg-slate-200 rounded-md"></div>
      </div>
      <div class="p-6 space-y-5">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div v-for="i in 3" :key="i" class="h-10 bg-slate-100 rounded-lg"></div>
        </div>
        <div v-for="i in 3" :key="i" class="h-24 bg-slate-50 rounded-lg"></div>
      </div>
    </div>

    <div v-else-if="error" class="p-6 text-center bg-white rounded-xl border border-red-200 text-red-500 flex flex-col items-center gap-3">
      <AlertCircle :size="40" />
      <p class="font-medium">{{ error }}</p>
      <button class="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors" @click="goBack">
        Volver
      </button>
    </div>

    <template v-else-if="currentPlanificacion">

      <div class="flex items-center gap-3.5 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <button
          class="w-9 h-9 border border-slate-200 rounded-lg bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors flex-shrink-0"
          @click="goBack"
        >
          <ArrowLeft :size="16" />
        </button>
        <div>
          <h2 class="text-xl font-bold text-slate-900 m-0">Editar Propuesta Pedagógica</h2>
          <p class="text-sm text-slate-500 m-0 mt-0.5">Modificá los bloques observados. Al guardar, el documento volverá a estar disponible para enviarse al Director.</p>
        </div>
      </div>

      <div v-if="ultimaObservacion" class="bg-amber-50 border border-amber-200 border-l-4 border-l-amber-500 rounded-xl p-4.5 flex gap-3 items-start shadow-sm">
        <MessageSquare :size="18" class="text-amber-600 mt-0.5 flex-shrink-0" />
        <div class="space-y-1">
          <strong class="text-sm text-amber-900 block font-bold">Indicaciones de Corrección Obligatoria:</strong>
          <p class="text-xs text-amber-800 m-0 font-medium leading-relaxed bg-white/60 p-2.5 rounded-lg border border-amber-100/50">
            "{{ ultimaObservacion }}"
          </p>
        </div>
      </div>

      <div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div class="flex items-center justify-between gap-4 p-4 border-b border-slate-100 bg-slate-50/50">
          <div class="flex items-center gap-2 text-sm font-bold text-slate-800">
            <Pencil :size="16" class="text-slate-400" />
            <h3>Espacio: {{ currentPlanificacion.area?.area || currentPlanificacion.area_curricular || 'Cargando Área...' }}</h3>
          </div>
          <StatusBadgeAnual :estado="obtenerEstadoActual" />
        </div>

        <div class="p-6">
          <PlanificacionForm
            :initial-data="currentPlanificacion"
            :is-edit="true"
            @submit="onFormSubmit"
            @cancel="goBack"
          />
        </div>
      </div>

      <ConfirmEnvioModal
        :visible="showConfirmModal"
        :loading="submitting"
        :data="pendingData"
        @confirm="onConfirm"
        @cancel="showConfirmModal = false"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Pencil, ShieldAlert, AlertCircle, MessageSquare } from 'lucide-vue-next'
import PlanificacionForm from '@/components/docente/PlanificacionForm.vue'
import ConfirmEnvioModal from '@/components/docente/ConfirmarEnvioModal.vue' // O tu import de modal base
import ConfirmEnvioModalComponent from '@/components/docente/ConfirmEnvioModal.vue' // Alias de resguardo según tu código
import StatusBadgeAnual from '@/components/docente/StatusBadgeAnual.vue'
import { usePlanificacion } from '@/composables/usePlanificacion'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'

// Resguardo de importación para evitar fallos de compresión en compiladores inline
const ConfirmEnvioModal = ConfirmEnvioModalComponent

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const toast = useToastStore()
const { currentPlanificacion, loading, error, fetchById, updatePlanificacion } = usePlanificacion(false)

const planId = route.params.id
const showConfirmModal = ref(false)
const submitting = ref(false)
const pendingData = ref(null)

// Estados tolerados para entrar a la pantalla de edición
const EDITABLE_STATES = ['pendiente', 'a corregir', 'rechazado', 'borrador']

const obtenerEstadoActual = computed(() => {
  if (!currentPlanificacion.value) return 'Borrador'
  if (currentPlanificacion.value.estados && currentPlanificacion.value.estados.length > 0) {
    return currentPlanificacion.value.estados[currentPlanificacion.value.estados.length - 1].estado
  }
  return currentPlanificacion.value.estado || 'Borrador'
})

// Mapea la última observación registrada de la auditoría para exponerla en pantalla
const ultimaObservacion = computed(() => {
  if (!currentPlanificacion.value?.estados) return null
  // Recorremos de atrás hacia adelante para sacar el comentario más nuevo
  const hist = [...currentPlanificacion.value.estados].reverse()
  const conObs = hist.find(e => e.observaciones && e.observaciones.trim() !== '')
  return conObs ? conObs.observaciones : null
})

const accessBlocked = computed(() => {
  if (authStore.userRole !== 'docente') return true
  const state = obtenerEstadoActual.value.toLowerCase()
  if (!EDITABLE_STATES.includes(state)) return true
  return false
})

const accessReason = computed(() => {
  if (authStore.userRole !== 'docente') return 'Solo los docentes vinculados pueden editar planificaciones pedagógicas.'
  const state = obtenerEstadoActual.value
  if (!EDITABLE_STATES.includes(state.toLowerCase())) {
    return `No se puede modificar una planificación que se encuentra actualmente en estado de auditoría "${state}".`
  }
  return ''
})

onMounted(() => {
  fetchById(planId)
})

function goBack() {
  router.push('/planificaciones')
}

function onFormSubmit(formData) {
  pendingData.value = formData
  showConfirmModal.value = true
}

async function onConfirm() {
  submitting.value = true
  try {
    // Dispara el PUT hacia el método update blindado de Laravel
    await updatePlanificacion(planId, pendingData.value)
    showConfirmModal.value = false
    toast.showToast('¡Modificaciones guardadas! El registro volvió a estado borrador listo para enviarse.', 'success')
    router.push('/planificaciones')
  } catch (err) {
    console.error('Error al actualizar planificación:', err)
    toast.showToast('Error al intentar guardar las modificaciones en Laravel.', 'error')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
/* Eliminado el CSS clásico. El componente ahora hereda de forma limpia la grilla y fuentes nativas de Tailwind CSS. */
.p-4\.5 { padding: 1.125rem; }
</style>
