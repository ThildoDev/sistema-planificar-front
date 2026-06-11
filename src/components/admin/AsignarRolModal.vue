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
import { ref, watch } from 'vue'
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
