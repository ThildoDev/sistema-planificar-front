<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-backdrop" @click.self="$emit('update:modelValue', false)">
        <div class="modal-container">
          <!-- Header -->
          <div class="modal-header">
            <div class="modal-title-group">
              <Shield :size="20" color="#5b21b6" />
              <h3 class="modal-title">Cambiar Rol</h3>
            </div>
            <button class="modal-close" @click="$emit('update:modelValue', false)">
              <X :size="18" />
            </button>
          </div>

          <!-- Body -->
          <div class="modal-body">
            <div class="usuario-info">
              <div class="usuario-avatar">{{ getInitials(usuario?.name) }}</div>
              <div>
                <p class="usuario-name">{{ usuario?.name }}</p>
                <p class="usuario-email">{{ usuario?.email }}</p>
              </div>
            </div>

            <div class="rol-actual">
              Rol actual:
              <span class="role-badge" :class="`role-${usuario?.role}`">
                {{ rolLabel(usuario?.role) }}
              </span>
            </div>

            <p class="field-label">Seleccionar nuevo rol *</p>
            <div class="roles-grid">
              <label
                v-for="rol in rolesDisponibles"
                :key="rol.value"
                class="rol-option"
                :class="{
                  'rol-selected': selectedRole === rol.value,
                  'rol-current': usuario?.role === rol.value,
                }"
              >
                <input
                  v-model="selectedRole"
                  type="radio"
                  :value="rol.value"
                  :disabled="usuario?.role === rol.value || isCurrentUser(usuario)"
                />
                <span class="rol-label">{{ rol.label }}</span>
                <span v-if="usuario?.role === rol.value" class="rol-tag">Actual</span>
              </label>
            </div>

            <!-- Advertencia si es el mismo usuario -->
            <div v-if="isCurrentUser(usuario)" class="warn-banner">
              <AlertTriangle :size="16" />
              <span>No podés cambiar tu propio rol.</span>
            </div>

            <!-- Error del store -->
            <div v-if="error" class="error-banner">
              <AlertCircle :size="16" />
              <span>{{ error }}</span>
            </div>
          </div>

          <!-- Footer -->
          <div class="modal-footer">
            <button
              class="btn-cancel"
              @click="$emit('update:modelValue', false)"
              :disabled="loadingAction"
            >
              Cancelar
            </button>
            <button
              class="btn-confirm"
              :disabled="
                !selectedRole ||
                selectedRole === usuario?.role ||
                isCurrentUser(usuario) ||
                loadingAction
              "
              @click="handleConfirm"
            >
              <Loader2 v-if="loadingAction" :size="15" class="spinning" />
              <Shield v-else :size="15" />
              {{ loadingAction ? 'Aplicando...' : 'Confirmar Rol' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { Shield, X, AlertTriangle, AlertCircle, Loader2 } from 'lucide-vue-next'
import { useUsuarios } from '@/composables/useUsuarios'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  usuario: { type: Object, default: null },
})

const emit = defineEmits(['update:modelValue', 'rol-asignado'])

const { asignarRol, loadingAction, error, rolesDisponibles, clearMessages } = useUsuarios()
const authStore = useAuthStore()
const selectedRole = ref(null)

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      selectedRole.value = null
      clearMessages()
    }
  },
)

const isCurrentUser = (u) => u?.id === authStore.user?.id

const rolLabel = (role) =>
  ({
    admin: 'Admin',
    director: 'Director',
    docente: 'Docente',
    user: 'Usuario',
  })[role] || role

const getInitials = (name = '') =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

async function handleConfirm() {
  if (!selectedRole.value || !props.usuario) return
  const result = await asignarRol(props.usuario.id, selectedRole.value)
  if (result.ok) {
    emit('rol-asignado')
    emit('update:modelValue', false)
  }
}
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
  max-width: 440px;
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
  background: #dbeafe;
  color: #1d4ed8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  flex-shrink: 0;
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

.rol-actual {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #64748b;
}

.field-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #374151;
}

.roles-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.rol-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.875rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
  color: #374151;
}

.rol-option:has(input:disabled) {
  opacity: 0.5;
  cursor: not-allowed;
}

.rol-option input {
  display: none;
}

.rol-option:hover:not(:has(input:disabled)) {
  border-color: #a78bfa;
  background: #faf5ff;
}

.rol-selected {
  border-color: #7c3aed !important;
  background: #f5f3ff !important;
  color: #5b21b6;
  font-weight: 600;
}

.rol-tag {
  margin-left: auto;
  font-size: 0.7rem;
  background: #e2e8f0;
  color: #64748b;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
}

.role-badge {
  display: inline-flex;
  padding: 0.2rem 0.5rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
}
.role-admin {
  background: #fef3c7;
  color: #92400e;
}
.role-director {
  background: #ede9fe;
  color: #5b21b6;
}
.role-docente {
  background: #dcfce7;
  color: #14532d;
}
.role-user {
  background: #f1f5f9;
  color: #475569;
}

.warn-banner,
.error-banner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.8125rem;
}

.warn-banner {
  background: #fffbeb;
  border: 1px solid #fde68a;
  color: #92400e;
}
.error-banner {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
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
  background: #7c3aed;
  color: #fff;
}
.btn-confirm:hover:not(:disabled) {
  background: #6d28d9;
}
.btn-confirm:disabled {
  background: #c4b5fd;
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
</style>
