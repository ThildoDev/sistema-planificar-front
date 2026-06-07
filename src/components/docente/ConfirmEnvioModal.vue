<template>
  <Teleport to="body">
    <div v-if="visible" class="modal-backdrop" @click.self="$emit('cancel')">
      <div class="modal-box" role="dialog" aria-modal="true">
        <div class="modal-icon-wrap">
          <Send :size="28" />
        </div>
        <h3 class="modal-title">¿Enviar planificación?</h3>
        <p class="modal-desc">
          Estás a punto de enviar tu planificación de
          <strong>{{ data?.area_curricular }}</strong> al directivo para su revisión.
          Una vez enviada, quedará en estado <em>Pendiente</em> hasta su evaluación.
        </p>
        <div class="modal-summary">
          <div class="summary-row">
            <span class="summary-label">Área:</span>
            <span class="summary-value">{{ data?.area_curricular }}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Tipo:</span>
            <span class="summary-value">{{ data?.tipo_planificacion }}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Fecha de presentación:</span>
            <span class="summary-value">{{ data?.fecha_presentacion }}</span>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-cancel" @click="$emit('cancel')" :disabled="loading">
            Cancelar
          </button>
          <button class="btn-confirm" @click="$emit('confirm')" :disabled="loading">
            <Loader2 v-if="loading" :size="15" class="spinning" />
            <Send v-else :size="15" />
            {{ loading ? 'Enviando...' : 'Sí, enviar planificación' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { Send, Loader2 } from 'lucide-vue-next'

defineProps({
  visible: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  data: { type: Object, default: null }
})

defineEmits(['confirm', 'cancel'])
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,0.45);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 300;
  padding: 1rem;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-box {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
  width: 100%;
  max-width: 440px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
  animation: slideUp 0.25s ease;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal-icon-wrap {
  width: 60px;
  height: 60px;
  background: #dbeafe;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1d4ed8;
}

.modal-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}

.modal-desc {
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}

.modal-summary {
  width: 100%;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 0.85rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.82rem;
  gap: 0.5rem;
}

.summary-label {
  color: #64748b;
  font-weight: 500;
}

.summary-value {
  color: #1a202c;
  font-weight: 600;
  text-align: right;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  width: 100%;
}

.btn-cancel {
  flex: 1;
  padding: 0.65rem;
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-cancel:hover:not(:disabled) { background: #e2e8f0; }
.btn-cancel:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-confirm {
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  padding: 0.65rem;
  background: #1e3a5f;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
  box-shadow: 0 2px 8px rgba(30,58,95,0.25);
}

.btn-confirm:hover:not(:disabled) {
  background: #2d5282;
  transform: translateY(-1px);
}

.btn-confirm:disabled {
  opacity: 0.75;
  cursor: not-allowed;
  transform: none;
}

.spinning {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
