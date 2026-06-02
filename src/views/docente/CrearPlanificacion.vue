<template>
  <div class="dashboard-page">

    <div class="page-header flex-space">
      <div>
        <h1 class="page-title">Nueva Propuesta Didáctica</h1>
        <p class="page-subtitle">Completá los campos requeridos para confeccionar el documento curricular.</p>
      </div>
      <IdentidadCard />
    </div>

    <Transition name="fade">
      <div v-if="error" class="error-banner">
        <AlertCircle :size="18" />
        <span>{{ error }}</span>
      </div>
    </Transition>

    <PlanificacionForm
      :loading="loadingAction"
      @submit="abrirConfirmacion"
      @cancelar="volverAlDashboard"
    />

    <ConfirmEnvioModal
      v-model="showConfirmModal"
      :area="dataPlanificacion?.area"
      :loading="loadingAction"
      @confirm="ejecutarGuardado"
    />

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { AlertCircle } from 'lucide-vue-next'
import { usePlanificacionStore } from '@/stores/planificacion'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

// Componentes Reutilizables e Hijos
import IdentidadCard from '@/components/docente/IdentidadCard.vue'
import PlanificacionForm from '@/components/docente/PlanificacionForm.vue'
import ConfirmEnvioModal from '@/components/docente/ConfirmEnvioModal.vue'

// Inicialización de Stores locales
const planificacionStore = usePlanificacionStore()
const authStore = useAuthStore()

const { loadingAction, error } = storeToRefs(planificacionStore)

// Estados locales de control para la confirmación
const showConfirmModal = ref(false)
const dataPlanificacion = ref(null)

function abrirConfirmacion(formData) {
  dataPlanificacion.value = formData
  showConfirmModal.value = true
}

async function ejecutarGuardado() {
  if (!dataPlanificacion.value) return

  // AUTO-INYECTAR el ID de cursado/cargo desde los metadatos del store auth
  const payloadCompleto = {
    ...dataPlanificacion.value,
    // Se usa un fallback numérico en caso de que el mock del auth no esté cargado por completo
    persona_cargo_cursado_id: authStore.user?.persona_cargo_cursado_id || 402,
    estados_anual: 'Pendiente' // Estado inicial base por defecto
  }

  const resultado = await planificacionStore.crearPlanificacion(payloadCompleto)

  if (resultado.ok) {
    showConfirmModal.value = false
    volverAlDashboard()
  }
}

function volverAlDashboard() {
  console.log('Redirigiendo a la grilla principal /docente/planificaciones...')
  // En tu entorno real con vue-router usarías: router.push('/docente/planificaciones')
}
</script>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.page-header {
  margin-bottom: 0.5rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
}

.page-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 0.25rem;
}

.flex-space {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.error-banner {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.875rem 1rem;
  border-radius: 10px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  font-size: 0.875rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
