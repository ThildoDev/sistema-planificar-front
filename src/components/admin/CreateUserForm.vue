<template>
  <div class="form-card">
    <h3 class="form-title">
      <UserPlus :size="20" />
      Crear Nuevo Usuario
    </h3>

    <form @submit.prevent="handleSubmit" novalidate>
      <div class="form-grid">
        <!-- Nombre -->
        <div class="form-group" :class="{ 'has-error': errors.nombre }">
          <label class="form-label">Nombre *</label>
          <input
            v-model.trim="form.nombre"
            type="text"
            class="form-input"
            placeholder="Ej: Ana"
            :disabled="loadingAction"
          />
          <span v-if="errors.nombre" class="field-error">{{ errors.nombre }}</span>
        </div>

        <!-- Apellido -->
        <div class="form-group" :class="{ 'has-error': errors.apellido }">
          <label class="form-label">Apellido *</label>
          <input
            v-model.trim="form.apellido"
            type="text"
            class="form-input"
            placeholder="Ej: García"
            :disabled="loadingAction"
          />
          <span v-if="errors.apellido" class="field-error">{{ errors.apellido }}</span>
        </div>

        <!-- Username -->
        <div class="form-group" :class="{ 'has-error': errors.name }">
          <label class="form-label">Nombre de usuario *</label>
          <input
            v-model.trim="form.name"
            type="text"
            class="form-input"
            placeholder="Ej: agarcia"
            :disabled="loadingAction"
          />
          <span v-if="errors.name" class="field-error">{{ errors.name }}</span>
        </div>

        <!-- Email -->
        <div class="form-group" :class="{ 'has-error': errors.email }">
          <label class="form-label">Email institucional *</label>
          <input
            v-model.trim="form.email"
            type="email"
            class="form-input"
            placeholder="usuario@escuela.edu.ar"
            :disabled="loadingAction"
          />
          <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
        </div>

        <!-- Contraseña -->
        <div class="form-group" :class="{ 'has-error': errors.password }">
          <label class="form-label">Contraseña temporal *</label>
          <div class="input-wrapper">
            <input
              v-model="form.password"
              :type="showPass ? 'text' : 'password'"
              class="form-input"
              placeholder="Mín. 8 caracteres"
              :disabled="loadingAction"
            />
            <button type="button" class="toggle-pass" @click="showPass = !showPass">
              <Eye v-if="!showPass" :size="16" />
              <EyeOff v-else :size="16" />
            </button>
          </div>
          <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
        </div>

        <!-- Confirmar Contraseña -->
        <div class="form-group" :class="{ 'has-error': errors.password_confirmation }">
          <label class="form-label">Confirmar contraseña *</label>
          <div class="input-wrapper">
            <input
              v-model="form.password_confirmation"
              :type="showPass ? 'text' : 'password'"
              class="form-input"
              placeholder="Repetir contraseña"
              :disabled="loadingAction"
            />
          </div>
          <span v-if="errors.password_confirmation" class="field-error">
            {{ errors.password_confirmation }}
          </span>
        </div>
      </div>

      <!-- Nota informativa sobre el rol -->
      <div class="info-banner">
        <Info :size="16" />
        <span>
          El usuario se creará con rol <strong>"Usuario común"</strong>. Podés cambiar el rol desde
          la tabla de gestión.
        </span>
      </div>

      <!-- Acciones -->
      <div class="form-actions">
        <button type="button" class="btn-secondary" @click="resetForm" :disabled="loadingAction">
          <X :size="16" /> Limpiar
        </button>
        <button type="submit" class="btn-primary" :disabled="loadingAction">
          <Loader2 v-if="loadingAction" :size="16" class="spinning" />
          <UserPlus v-else :size="16" />
          {{ loadingAction ? 'Creando...' : 'Crear Usuario' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { UserPlus, Eye, EyeOff, Info, X, Loader2 } from 'lucide-vue-next'
import { useUsuarios } from '@/composables/useUsuarios'

const emit = defineEmits(['created'])

const { crearUsuario, loadingAction } = useUsuarios()

const showPass = ref(false)

const form = reactive({
  nombre: '',
  apellido: '',
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const errors = reactive({
  nombre: '',
  apellido: '',
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate() {
  let valid = true
  Object.keys(errors).forEach((k) => (errors[k] = ''))

  if (!form.nombre) {
    errors.nombre = 'El nombre es requerido.'
    valid = false
  }
  if (!form.apellido) {
    errors.apellido = 'El apellido es requerido.'
    valid = false
  }
  if (!form.name) {
    errors.name = 'El usuario es requerido.'
    valid = false
  }
  if (!form.email) {
    errors.email = 'El email es requerido.'
    valid = false
  } else if (!emailRegex.test(form.email)) {
    errors.email = 'Email inválido.'
    valid = false
  }
  if (!form.password) {
    errors.password = 'La contraseña es requerida.'
    valid = false
  } else if (form.password.length < 8) {
    errors.password = 'Mínimo 8 caracteres.'
    valid = false
  }
  if (form.password !== form.password_confirmation) {
    errors.password_confirmation = 'Las contraseñas no coinciden.'
    valid = false
  }
  return valid
}

function resetForm() {
  Object.keys(form).forEach((k) => (form[k] = ''))
  Object.keys(errors).forEach((k) => (errors[k] = ''))
}

async function handleSubmit() {
  if (!validate()) return
  const result = await crearUsuario({
    nombre: form.nombre,
    apellido: form.apellido,
    name: form.name,
    email: form.email,
    password: form.password,
  })
  if (result.ok) {
    resetForm()
    emit('created')
  }
}
</script>

<style scoped>
.form-card {
  background: #fff;
  border-radius: 12px;
  padding: 1.75rem;
  border: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
}

.form-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
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

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.form-input {
  width: 100%;
  height: 40px;
  padding: 0 0.875rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #0f172a;
  background: #f8fafc;
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.form-input:focus {
  border-color: #2563eb;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.has-error .form-input {
  border-color: #ef4444;
}

.toggle-pass {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.field-error {
  font-size: 0.75rem;
  color: #ef4444;
}

.info-banner {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  color: #1d4ed8;
  font-size: 0.8125rem;
  margin: 1rem 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
}

.btn-primary,
.btn-secondary {
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

.btn-primary {
  background: #2563eb;
  color: #fff;
}
.btn-primary:hover:not(:disabled) {
  background: #1d4ed8;
}
.btn-primary:disabled {
  background: #93c5fd;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
}
.btn-secondary:hover:not(:disabled) {
  background: #e2e8f0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.spinning {
  animation: spin 0.8s linear infinite;
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
