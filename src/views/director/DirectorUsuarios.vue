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


