<template>
  <div class="editar-view">
    <!-- Access Blocked Banner -->
    <div v-if="accessBlocked" class="access-banner">
      <div class="banner-content">
        <ShieldAlert :size="20" />
        <div>
          <strong>Acceso restringido</strong>
          <p>{{ accessReason }}</p>
        </div>
      </div>
      <button class="btn-secondary" @click="goBack">
        <ArrowLeft :size="14" />
        Volver al panel
      </button>
    </div>

    <template v-else>
      <div class="page-header">
        <button class="back-btn" @click="goBack">
          <ArrowLeft :size="16" />
        </button>
        <div>
          <h2 class="page-title">Editar Planificación</h2>
          <p class="page-subtitle">
            Modificá los campos necesarios y guardá los cambios para reenviar al directivo.
          </p>
        </div>
      </div>

      <!-- Skeleton loading state -->
      <div v-if="loading" class="form-card">
        <div class="skeleton-header">
          <div class="skeleton sk-title"></div>
        </div>
        <div class="skeleton-form">
          <div class="sk-row">
            <div class="skeleton sk-field"></div>
            <div class="skeleton sk-field"></div>
            <div class="skeleton sk-field"></div>
          </div>
          <div v-for="i in 5" :key="i" class="skeleton sk-textarea"></div>
        </div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="error-state">
        <AlertCircle :size="40" />
        <p>{{ error }}</p>
        <button class="btn-secondary" @click="goBack">Volver</button>
      </div>

      <!-- Edit form -->
      <div v-else-if="currentPlanificacion" class="form-card">
        <div class="form-card-header">
          <Pencil :size="18" />
          <h3>Edición: {{ currentPlanificacion.area_curricular }}</h3>
          <StatusBadgeAnual :estado="currentPlanificacion.estado" />
        </div>

        <PlanificacionForm
          :initial-data="currentPlanificacion"
          :is-edit="true"
          @submit="onFormSubmit"
          @cancel="goBack"
        />
      </div>

      <!-- Confirm Modal -->
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
import { ArrowLeft, Pencil, ShieldAlert, AlertCircle } from 'lucide-vue-next'
import PlanificacionForm from '@/components/docente/PlanificacionForm.vue'
import ConfirmEnvioModal from '@/components/docente/ConfirmEnvioModal.vue'
import StatusBadgeAnual from '@/components/docente/StatusBadgeAnual.vue'
import { usePlanificacion } from '@/composables/usePlanificacion'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { currentPlanificacion, loading, error, fetchById, updatePlanificacion } = usePlanificacion(false)

const planId = route.params.id
const showConfirmModal = ref(false)
const submitting = ref(false)
const pendingData = ref(null)

const EDITABLE_STATES = ['Pendiente', 'A Corregir', 'Rechazado']

const accessBlocked = computed(() => {
  if (authStore.userRole !== 'docente') return true
  if (currentPlanificacion.value && !EDITABLE_STATES.includes(currentPlanificacion.value.estado)) return true
  return false
})

const accessReason = computed(() => {
  if (authStore.userRole !== 'docente') return 'Solo los docentes pueden editar planificaciones.'
  if (currentPlanificacion.value && !EDITABLE_STATES.includes(currentPlanificacion.value.estado)) {
    return `No se puede editar una planificación en estado "${currentPlanificacion.value.estado}".`
  }
  return ''
})

onMounted(() => {
  fetchById(planId)
})

function goBack() {
  router.push('/docente/dashboard')
}

function onFormSubmit(formData) {
  pendingData.value = formData
  showConfirmModal.value = true
}

async function onConfirm() {
  submitting.value = true
  try {
    await updatePlanificacion(planId, pendingData.value)
    showConfirmModal.value = false
    router.push('/docente/dashboard')
  } catch (err) {
    console.error('Error al actualizar planificación:', err)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.editar-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 900px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
}

.back-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition: background 0.15s, color 0.15s;
  margin-top: 3px;
  flex-shrink: 0;
}

.back-btn:hover { background: #f1f5f9; color: #1a202c; }

.page-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0.2rem;
}

.page-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

/* Access Banner */
.access-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: #fff7ed;
  border: 1px solid #fed7aa;
  border-left: 4px solid #f97316;
  border-radius: 10px;
  flex-wrap: wrap;
}

.banner-content {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  color: #c2410c;
}

.banner-content strong {
  display: block;
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 0.15rem;
}

.banner-content p {
  font-size: 0.82rem;
  margin: 0;
  color: #9a3412;
}

/* Form card */
.form-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  overflow: hidden;
}

.form-card-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 1.1rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.95rem;
  font-weight: 700;
  color: #1a202c;
}

.form-card :deep(.plan-form) {
  padding: 1.5rem;
}

/* Skeleton */
@keyframes shimmer {
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}

.skeleton {
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 800px 100%;
  animation: shimmer 1.4s infinite linear;
  border-radius: 6px;
}

.skeleton-header {
  padding: 1.1rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.sk-title { height: 20px; width: 220px; }

.skeleton-form {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.sk-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.sk-field { height: 42px; }
.sk-textarea { height: 100px; }

/* Error state */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem;
  color: #ef4444;
  text-align: center;
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.6rem 1rem;
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-secondary:hover { background: #e2e8f0; }
</style>
