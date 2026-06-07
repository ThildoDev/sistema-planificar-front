<template>
  <div class="crear-view">
    <div class="page-header">
      <button class="back-btn" @click="goBack">
        <ArrowLeft :size="16" />
      </button>
      <div>
        <h2 class="page-title">Nueva Planificación</h2>
        <p class="page-subtitle">Completá todos los campos para enviar tu planificación al directivo.</p>
      </div>
    </div>

    <div class="form-card">
      <div class="form-card-header">
        <FilePlus :size="18" />
        <h3>Datos de la Planificación</h3>
      </div>

      <PlanificacionForm
        :is-edit="false"
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, FilePlus } from 'lucide-vue-next'
import PlanificacionForm from '@/components/docente/PlanificacionForm.vue'
import ConfirmEnvioModal from '@/components/docente/ConfirmEnvioModal.vue'
import { usePlanificacion } from '@/composables/usePlanificacion'

const router = useRouter()
const { createPlanificacion } = usePlanificacion(false)

const showConfirmModal = ref(false)
const submitting = ref(false)
const pendingData = ref(null)

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
    await createPlanificacion(pendingData.value)
    showConfirmModal.value = false
    router.push('/docente/dashboard')
  } catch (err) {
    console.error('Error al crear planificación:', err)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.crear-view {
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

.back-btn:hover {
  background: #f1f5f9;
  color: #1a202c;
}

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
</style>
