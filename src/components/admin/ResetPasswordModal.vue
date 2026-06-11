<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-backdrop" @click.self="$emit('update:modelValue', false)">
        <div class="modal-container">
          <div class="modal-header">
            <div class="modal-title-group">
              <KeyRound :size="20" color="#d97706" />
              <h3 class="modal-title">Blanquear Contraseña</h3>
            </div>
            <button class="modal-close" @click="$emit('update:modelValue', false)">
              <X :size="18" />
            </button>
          </div>

          <div class="modal-body">
            <div class="usuario-info">
              <div class="usuario-avatar">{{ getInitials(usuario?.name) }}</div>
              <div>
                <p class="usuario-name">{{ usuario?.name }}</p>
                <p class="usuario-email">{{ usuario?.email }}</p>
              </div>
            </div>

            <div class="form-group" :class="{ 'has-error': errors.password }">
              <label class="form-label">Nueva contraseña temporal *</label>
              <input
                v-model="form.password"
                type="password"
                class="form-input"
                placeholder="Mín. 8 caracteres"
                :disabled="loadingAction"
              />
              <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
            </div>

            <div class="form-group" :class="{ 'has-error': errors.confirm }">
              <label class="form-label">Confirmar contraseña *</label>
              <input
                v-model="form.confirm"
                type="password"
                class="form-input"
                placeholder="Repetir contraseña"
                :disabled="loadingAction"
              />
              <span v-if="errors.confirm" class="field-error">{{ errors.confirm }}</span>
            </div>

            <label class="check-label">
              <input v-model="form.forceChange" type="checkbox" class="check-input" />
              <span>Forzar cambio en el próximo inicio de sesión</span>
            </label>

            <div v-if="error" class="error-banner">
              <AlertCircle :size="16" /> <span>{{ error }}</span>
            </div>
          </div>

          <div class="modal-footer">
            <button
              class="btn-cancel"
              @click="$emit('update:modelValue', false)"
              :disabled="loadingAction"
            >
              Cancelar
            </button>
            <button class="btn-confirm" @click="handleConfirm" :disabled="loadingAction">
              <Loader2 v-if="loadingAction" :size="15" class="spinning" />
              <KeyRound v-else :size="15" />
              {{ loadingAction ? 'Aplicando...' : 'Blanquear Contraseña' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { KeyRound, X, AlertCircle, Loader2 } from 'lucide-vue-next'
import { useUsuarios } from '@/composables/useUsuarios'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  usuario: { type: Object, default: null },
})

const emit = defineEmits(['update:modelValue', 'password-reseteada'])

const { resetPassword, loadingAction, error, clearMessages } = useUsuarios()

const form = reactive({ password: '', confirm: '', forceChange: true })
const errors = reactive({ password: '', confirm: '' })

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      Object.assign(form, { password: '', confirm: '', forceChange: true })
      Object.assign(errors, { password: '', confirm: '' })
      clearMessages()
    }
  },
)

const getInitials = (name = '') =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

function validate() {
  let valid = true
  errors.password = ''
  errors.confirm = ''

  if (!form.password || form.password.length < 8) {
    errors.password = 'Mínimo 8 caracteres.'
    valid = false
  }
  if (form.password !== form.confirm) {
    errors.confirm = 'Las contraseñas no coinciden.'
    valid = false
  }
  return valid
}

async function handleConfirm() {
  if (!validate() || !props.usuario) return
  const result = await resetPassword(props.usuario.id, {
    newPassword: form.password,
    forceChange: form.forceChange,
  })
  if (result.ok) {
    emit('password-reseteada')
    emit('update:modelValue', false)
  }
}
</script>

<!-- <style scoped>
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
}
.modal-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  border-top: 1px solid #f1f5f9;
}
.usuario-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem;
  background: #f8fafc;
  border-radius: 10px;
}
.usuario-avatar {
  width: 40px;
  height: 40px;
  background: #fef3c7;
  color: #92400e;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
}
.usuario-name {
  font-weight: 600;
  color: #0f172a;
  font-size: 0.9rem;
}
.usuario-email {
  font-size: 0.8125rem;
  color: #64748b;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}
.form-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #374151;
}
.form-input {
  height: 40px;
  padding: 0 0.875rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  background: #f8fafc;
  outline: none;
}
.form-input:focus {
  border-color: #d97706;
  box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.1);
}
.has-error .form-input {
  border-color: #ef4444;
}
.field-error {
  font-size: 0.75rem;
  color: #ef4444;
}
.check-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
}
.check-input {
  accent-color: #d97706;
  cursor: pointer;
}
.error-banner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 8px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  font-size: 0.8125rem;
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
  background: #d97706;
  color: #fff;
}
.btn-confirm:hover:not(:disabled) {
  background: #b45309;
}
.btn-confirm:disabled {
  background: #fcd34d;
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
  to {
    transform: rotate(360deg);
  }
}
.spinning {
  animation: spin 0.8s linear infinite;
}
</style> -->
