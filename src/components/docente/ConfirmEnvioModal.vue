<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-backdrop" @click.self="$emit('update:modelValue', false)">
        <div class="modal-container">
          <div class="modal-header">
            <div class="modal-title-group">
              <FileCheck :size="20" color="#14532d" />
              <h3 class="modal-title">¿Confirmar Entrega?</h3>
            </div>
            <button class="modal-close" @click="$emit('update:modelValue', false)">
              <X :size="18" />
            </button>
          </div>

          <div class="modal-body">
            <p class="modal-message">
              Estás por enviar la planificación para el área de <strong>{{ area }}</strong>.
              Una vez confirmada, quedará en estado de revisión y el Directivo podrá evaluarla.
            </p>
          </div>

          <div class="modal-footer">
            <button
              class="btn-cancel"
              @click="$emit('update:modelValue', false)"
              :disabled="loading"
            >
              Modificar
            </button>
            <button
              class="btn-confirm"
              :disabled="loading"
              @click="$emit('confirm')"
            >
              <Loader2 v-if="loading" :size="15" class="spinning" />
              <Save v-else :size="15" />
              {{ loading ? 'Guardando...' : 'Confirmar Envío' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { FileCheck, X, Loader2, Save } from 'lucide-vue-next'

defineProps({
  modelValue: { type: Boolean, default: false },
  area: { type: String, default: '' },
  loading: { type: Boolean, default: false }
})

defineEmits(['update:modelValue', 'confirm'])
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-container {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.modal-title-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.modal-title {
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
}

.modal-close {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  border-radius: 6px;
  padding: 0.25rem;
  transition: color 0.2s;
}

.modal-close:hover {
  color: #0f172a;
}

.modal-body {
  padding: 1.5rem;
  font-size: 0.875rem;
  color: #475569;
  line-height: 1.5;
}

.modal-message strong {
  color: #0f172a;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  border-top: 1px solid #f1f5f9;
}

.btn-cancel,
.btn-confirm {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.btn-cancel:hover {
  background: #e2e8f0;
}

.btn-confirm {
  background: #14532d;
  color: #fff;
}

.btn-confirm:hover:not(:disabled) {
  background: #166534;
}

.btn-confirm:disabled {
  background: #bbf7d0;
  cursor: not-allowed;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
.spinning {
  animation: spin 0.8s linear infinite;
}
</style>
