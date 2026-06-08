<!-- src/components/director/DecisionPanel.vue -->
<template>
  <div class="decision-panel">
    <div class="panel-header">
      <Shield class="panel-icon" />
      <h3 class="panel-titulo">Panel de Decisión</h3>
    </div>

    <p class="panel-descripcion">
      Revisá el contenido completo antes de tomar una decisión. Esta acción quedará registrada en el
      historial.
    </p>

    <div class="decision-acciones">
      <!-- Aprobar -->
      <button class="btn-aprobar" :disabled="loading" @click="confirmarAprobar">
        <Loader2 v-if="loading && accionActiva === 'aprobar'" class="btn-icon spin" />
        <CheckCircle v-else class="btn-icon" />
        Aprobar planificación
      </button>

      <!-- Rechazar con observaciones -->
      <button class="btn-rechazar" :disabled="loading" @click="$emit('rechazar')">
        <XCircle class="btn-icon" />
        Rechazar con observaciones
      </button>
    </div>

    <!-- Diálogo de confirmación inline para Aprobar -->
    <div v-if="mostrarConfirmacion" class="confirmacion-inline">
      <AlertTriangle class="confirm-icon" />
      <div class="confirmacion-texto">
        <p class="confirm-titulo">¿Confirmar aprobación?</p>
        <p class="confirm-subtitulo">
          Esta acción cambiará el estado a <strong>Aprobado</strong>
          y notificará al docente.
        </p>
      </div>
      <div class="confirmacion-btns">
        <button class="btn-confirm-si" :disabled="loading" @click="ejecutarAprobar">
          <Loader2 v-if="loading" class="btn-icon spin" />
          <Check v-else class="btn-icon" />
          Sí, aprobar
        </button>
        <button class="btn-confirm-no" :disabled="loading" @click="cancelarConfirmacion">
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Shield, CheckCircle, XCircle, AlertTriangle, Check, Loader2 } from 'lucide-vue-next'

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['aprobar', 'rechazar'])

const mostrarConfirmacion = ref(false)
const accionActiva = ref(null)

function confirmarAprobar() {
  mostrarConfirmacion.value = true
}

function cancelarConfirmacion() {
  mostrarConfirmacion.value = false
  accionActiva.value = null
}

function ejecutarAprobar() {
  accionActiva.value = 'aprobar'
  emit('aprobar')
}
</script>

<style scoped>
.decision-panel {
  background: #ffffff;
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.panel-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #6366f1;
}

.panel-titulo {
  font-size: 1.0625rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.panel-descripcion {
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.5;
  margin: 0;
  padding: 0.875rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  border-left: 3px solid #6366f1;
}

/* Botones de acción */
.decision-acciones {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.875rem;
}

@media (max-width: 480px) {
  .decision-acciones {
    grid-template-columns: 1fr;
  }
}

.btn-aprobar,
.btn-rechazar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-aprobar {
  background: #22c55e;
  color: #ffffff;
}

.btn-aprobar:hover:not(:disabled) {
  background: #16a34a;
}

.btn-rechazar {
  background: #ef4444;
  color: #ffffff;
}

.btn-rechazar:hover:not(:disabled) {
  background: #dc2626;
}

.btn-aprobar:disabled,
.btn-rechazar:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-icon {
  width: 1.1rem;
  height: 1.1rem;
}

.spin {
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Confirmación inline */
.confirmacion-inline {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: #fefce8;
  border: 1px solid #fde68a;
  border-radius: 0.5rem;
  flex-wrap: wrap;
}

.confirm-icon {
  width: 1.375rem;
  height: 1.375rem;
  color: #d97706;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.confirmacion-texto {
  flex: 1;
  min-width: 200px;
}

.confirm-titulo {
  font-weight: 700;
  color: #92400e;
  margin: 0 0 0.25rem;
  font-size: 0.9375rem;
}

.confirm-subtitulo {
  font-size: 0.8125rem;
  color: #78350f;
  margin: 0;
  line-height: 1.4;
}

.confirmacion-btns {
  display: flex;
  gap: 0.625rem;
  align-items: center;
  flex-shrink: 0;
}

.btn-confirm-si {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  background: #22c55e;
  color: #fff;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-confirm-si:hover:not(:disabled) {
  background: #16a34a;
}

.btn-confirm-si:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-confirm-no {
  padding: 0.5rem 0.875rem;
  background: transparent;
  border: 1px solid #d97706;
  border-radius: 0.375rem;
  color: #92400e;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-confirm-no:hover:not(:disabled) {
  background: #fef3c7;
}
</style>
