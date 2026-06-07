<!-- src/views/director/DirectorUsuarios.vue -->
<template>
  <div class="director-usuarios">
    <!-- Cabecera -->
    <div class="page-header">
      <div>
        <h1 class="page-title">
          <Users class="title-icon" />
          Gestión de Usuarios
        </h1>
        <p class="page-subtitle">Administra los docentes de tu institución</p>
      </div>
    </div>

    <!-- Barra de búsqueda -->
    <div class="busqueda-wrapper">
      <div class="busqueda-container">
        <Search class="busqueda-icon" />
        <input
          v-model="busquedaLocal"
          type="text"
          class="busqueda-input"
          placeholder="Buscar por nombre, email..."
          @input="setBusqueda(busquedaLocal)"
        />
      </div>

      <button class="btn-reload" :disabled="loading" @click="cargarUsuarios">
        <RefreshCw class="btn-icon" :class="{ spin: loading }" />
        Actualizar
      </button>
    </div>

    <!-- Mensaje de error global -->
    <div v-if="error && !showModal" class="alerta-error">
      <AlertCircle class="alerta-icon" />
      {{ error }}
    </div>

    <!-- Mensaje de éxito -->
    <div v-if="successMessage" class="alerta-success">
      <CheckCircle class="alerta-icon" />
      {{ successMessage }}
    </div>

    <!-- Tabla de usuarios -->
    <UsuariosDirectorTable :usuarios="usuarios" :loading="loading" @promover="abrirModal" />

    <!-- Modal promover docente -->
    <PromoverDocenteModal
      v-if="showModal"
      :usuario="usuarioSeleccionado"
      :roles-permitidos="rolesPermitidos"
      :loading="loadingAccion"
      :error="error"
      @confirmar="confirmarCambioRol"
      @cerrar="cerrarModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Users, Search, RefreshCw, AlertCircle, CheckCircle } from 'lucide-vue-next'
import { useUsuarios } from '@/composables/useUsuarios'
import UsuariosDirectorTable from '@/components/director/UsuariosDirectorTable.vue'
import PromoverDocenteModal from '@/components/director/PromoverDocenteModal.vue'

const {
  usuarios,
  usuarioSeleccionado,
  rolesPermitidos,
  loading,
  loadingAccion,
  error,
  successMessage,
  busqueda,
  cargarUsuarios,
  cambiarRol,
  seleccionarUsuario,
  limpiarSeleccion,
  setBusqueda,
  limpiarMensajes,
} = useUsuarios()

const showModal = ref(false)
const busquedaLocal = ref('')

function abrirModal(usuario) {
  limpiarMensajes()
  seleccionarUsuario(usuario)
  showModal.value = true
}

function cerrarModal() {
  showModal.value = false
  limpiarSeleccion()
}

async function confirmarCambioRol({ userId, nuevoRol }) {
  const ok = await cambiarRol(userId, nuevoRol)
  if (ok) {
    cerrarModal()
    // Auto-limpiar mensaje de éxito
    setTimeout(() => limpiarMensajes(), 4000)
  }
}

onMounted(() => {
  cargarUsuarios()
})
</script>

<style scoped>
.director-usuarios {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  max-width: 1100px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.title-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #6366f1;
}

.page-subtitle {
  margin: 0.25rem 0 0 2rem;
  color: #64748b;
  font-size: 0.9rem;
}

/* Búsqueda */
.busqueda-wrapper {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.busqueda-container {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.busqueda-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  color: #94a3b8;
  pointer-events: none;
}

.busqueda-input {
  width: 100%;
  padding: 0.625rem 0.75rem 0.625rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  color: #1e293b;
  background: #f8fafc;
  transition: border-color 0.15s;
  box-sizing: border-box;
}

.busqueda-input:focus {
  outline: none;
  border-color: #6366f1;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.btn-reload {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.625rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background: #fff;
  font-size: 0.875rem;
  color: #475569;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.btn-reload:hover:not(:disabled) {
  border-color: #6366f1;
  color: #6366f1;
}

.btn-reload:disabled {
  opacity: 0.6;
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

/* Alertas */
.alerta-error,
.alerta-success {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.alerta-error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.alerta-success {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.alerta-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}
</style>
