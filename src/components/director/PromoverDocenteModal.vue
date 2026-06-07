<!-- src/components/director/PromoverDocenteModal.vue -->
<template>
  <!-- Overlay -->
  <Teleport to="body">
    <div class="modal-overlay" @click.self="$emit('cerrar')">
      <div class="modal" role="dialog" aria-modal="true">
        <!-- Header -->
        <div class="modal-header">
          <div class="modal-titulo-group">
            <ArrowUpDown class="modal-titulo-icon" />
            <h2 class="modal-titulo">Cambiar Rol de Usuario</h2>
          </div>
          <button class="modal-cerrar" @click="$emit('cerrar')">
            <X />
          </button>
        </div>

        <!-- Cuerpo -->
        <div class="modal-body">
          <!-- Info del usuario -->
          <div class="usuario-card">
            <div class="avatar" :class="`avatar--${getRolColor(usuario.role)}`">
              {{ getIniciales(usuario) }}
            </div>
            <div class="usuario-info">
              <p class="usuario-nombre">{{ getNombreCompleto(usuario) }}</p>
              <p class="usuario-email">{{ usuario.email }}</p>
              <span class="rol-actual">
                Rol actual: <strong>{{ getLabelRol(usuario.role) }}</strong>
              </span>
            </div>
          </div>

          <!-- Advertencia de restricción director -->
          <div class="aviso-director">
            <Info class="aviso-icon" />
            <p>
              Como director, solo puedes asignar los roles
              <strong>Docente</strong> y <strong>Usuario</strong>.
            </p>
          </div>

          <!-- Selector de rol -->
          <div class="rol-selector">
            <p class="selector-label">Selecciona el nuevo rol:</p>
            <div class="roles-grid">
              <label
                v-for="rol in rolesPermitidos"
                :key="rol.value"
                class="rol-opcion"
                :class="{
                  'rol-opcion--activo': rolSeleccionado === rol.value,
                  'rol-opcion--actual': usuario.role === rol.value,
                }"
              >
                <input
                  v-model="rolSeleccionado"
                  type="radio"
                  :value="rol.value"
                  class="rol-radio"
                />
                <div class="rol-opcion-content">
                  <span class="rol-opcion-nombre">{{ rol.label }}</span>
                  <span class="rol-opcion-desc">
                    {{ getDescripcionRol(rol.value) }}
                  </span>
                  <span v-if="usuario.role === rol.value" class="rol-opcion-tag"> Rol actual </span>
                </div>
              </label>
            </div>
          </div>

          <!-- Error -->
          <div v-if="error" class="error-msg">
            <AlertCircle class="error-icon" />
            {{ error }}
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button class="btn-cancelar" @click="$emit('cerrar')">Cancelar</button>
          <button class="btn-confirmar" :disabled="!puedeConfirmar || loading" @click="confirmar">
            <Loader2 v-if="loading" class="btn-icon spin" />
            <Check v-else class="btn-icon" />
            {{ loading ? 'Guardando...' : 'Confirmar cambio' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ArrowUpDown, X, Info, AlertCircle, Check, Loader2 } from 'lucide-vue-next'

const props = defineProps({
  usuario: {
    type: Object,
    required: true,
  },
  rolesPermitidos: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['confirmar', 'cerrar'])

// Inicia con el rol actual del usuario
const rolSeleccionado = ref(props.usuario.role)

// Solo habilitar si se eligió un rol diferente al actual
const puedeConfirmar = computed(
  () => rolSeleccionado.value && rolSeleccionado.value !== props.usuario.role,
)

function confirmar() {
  if (!puedeConfirmar.value || props.loading) return
  emit('confirmar', {
    userId: props.usuario.id,
    nuevoRol: rolSeleccionado.value,
  })
}

// ── Helpers visuales ──
function getNombreCompleto(usuario) {
  if (usuario.persona?.apellidos && usuario.persona?.nombres) {
    return `${usuario.persona.apellidos}, ${usuario.persona.nombres}`
  }
  return usuario.name || '—'
}

function getIniciales(usuario) {
  const nombre = getNombreCompleto(usuario)
  const partes = nombre.split(/[\s,]+/).filter(Boolean)
  return partes.length >= 2
    ? `${partes[0][0]}${partes[1][0]}`.toUpperCase()
    : nombre.slice(0, 2).toUpperCase()
}

function getLabelRol(role) {
  const labels = {
    admin: 'Administrador',
    director: 'Director',
    docente: 'Docente',
    user: 'Usuario',
  }
  return labels[role] || role
}

function getRolColor(role) {
  const colores = { admin: 'red', director: 'purple', docente: 'blue', user: 'gray' }
  return colores[role] || 'gray'
}

function getDescripcionRol(role) {
  const desc = {
    docente: 'Puede crear y enviar planificaciones',
    user: 'Sin acceso a planificaciones',
    director: 'Revisa y aprueba planificaciones',
    admin: 'Administración total del sistema',
  }
  return desc[role] || ''
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(2px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal {
  background: #ffffff;
  border-radius: 0.75rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

/* Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.modal-titulo-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.modal-titulo-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #6366f1;
}

.modal-titulo {
  font-size: 1.0625rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.modal-cerrar {
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  display: flex;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: color 0.15s;
}

.modal-cerrar:hover {
  color: #1e293b;
}

/* Body */
.modal-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Card de usuario */
.usuario-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
}

.avatar {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  flex-shrink: 0;
}

.avatar--blue {
  background: #dbeafe;
  color: #1d4ed8;
}
.avatar--gray {
  background: #f1f5f9;
  color: #475569;
}
.avatar--purple {
  background: #ede9fe;
  color: #7c3aed;
}
.avatar--red {
  background: #fee2e2;
  color: #991b1b;
}

.usuario-info {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.usuario-nombre {
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  font-size: 0.9375rem;
}

.usuario-email {
  color: #64748b;
  font-size: 0.8125rem;
  margin: 0;
}

.rol-actual {
  font-size: 0.8125rem;
  color: #475569;
}

/* Aviso director */
.aviso-director {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  color: #1e40af;
}

.aviso-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
  color: #3b82f6;
}

/* Selector de roles */
.selector-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
  margin: 0 0 0.75rem;
}

.roles-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.rol-opcion {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  padding: 0.875rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.15s;
  background: #fff;
}

.rol-opcion:hover {
  border-color: #a5b4fc;
  background: #f5f3ff;
}

.rol-opcion--activo {
  border-color: #6366f1;
  background: #eef2ff;
}

.rol-opcion--actual {
  border-color: #86efac;
  background: #f0fdf4;
}

.rol-radio {
  margin-top: 0.125rem;
  accent-color: #6366f1;
  flex-shrink: 0;
}

.rol-opcion-content {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.rol-opcion-nombre {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.9rem;
}

.rol-opcion-desc {
  font-size: 0.75rem;
  color: #64748b;
  line-height: 1.3;
}

.rol-opcion-tag {
  font-size: 0.7rem;
  color: #166534;
  background: #dcfce7;
  padding: 0.1rem 0.4rem;
  border-radius: 9999px;
  display: inline-block;
  margin-top: 0.2rem;
}

/* Error */
.error-msg {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  color: #991b1b;
  font-size: 0.875rem;
}

.error-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

/* Footer */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}

.btn-cancelar {
  padding: 0.625rem 1.25rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background: #fff;
  color: #475569;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-cancelar:hover {
  border-color: #94a3b8;
  color: #1e293b;
}

.btn-confirmar {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.625rem 1.25rem;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-confirmar:hover:not(:disabled) {
  background: #4f46e5;
}

.btn-confirmar:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-icon {
  width: 1rem;
  height: 1rem;
}

.spin {
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
