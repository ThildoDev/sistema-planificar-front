// src/composables/useUsuarios.js
import { computed } from 'vue'
import { useUsuariosStore } from '@/stores/usuarios'
import { useToast } from '@/composables/useToast'

/**
 * Composable para la gestión de usuarios.
 * Compartido entre el panel Admin y Director.
 */
export function useUsuarios() {
  const store = useUsuariosStore()
  const { showToast } = useToast()

  // ─────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────

  const usuarios = computed(() => store.usuariosFiltrados)
  const usuarioSeleccionado = computed(() => store.usuarioSeleccionado)
  const rolesPermitidos = computed(() => store.rolesPermitidos)
  const loading = computed(() => store.loading)
  const loadingAccion = computed(() => store.loadingAccion)
  const error = computed(() => store.error)
  const successMessage = computed(() => store.successMessage)
  const busqueda = computed(() => store.busqueda)

  // ─────────────────────────────────────────────
  // ACCIONES
  // ─────────────────────────────────────────────

  async function cargarUsuarios() {
    await store.fetchUsuarios()
    if (store.error) {
      showToast(store.error, 'error')
    }
  }

  async function crearUsuario(formData) {
    const ok = await store.crearUsuario(formData)
    if (ok) {
      showToast(store.successMessage || 'Usuario creado', 'success')
    } else {
      showToast(store.error || 'Error al crear usuario', 'error')
    }
    return ok
  }

  async function cambiarRol(userId, nuevoRol) {
    const ok = await store.cambiarRol(userId, nuevoRol)
    if (ok) {
      showToast(store.successMessage || 'Rol actualizado', 'success')
    } else {
      showToast(store.error || 'Error al cambiar rol', 'error')
    }
    return ok
  }

  async function resetPassword(userId, password) {
    const ok = await store.resetPassword(userId, password)
    if (ok) {
      showToast('Contraseña actualizada correctamente', 'success')
    } else {
      showToast(store.error || 'Error al resetear contraseña', 'error')
    }
    return ok
  }

  function seleccionarUsuario(usuario) {
    store.seleccionarUsuario(usuario)
  }

  function limpiarSeleccion() {
    store.limpiarSeleccion()
  }

  function setBusqueda(valor) {
    store.setBusqueda(valor)
  }

  function limpiarMensajes() {
    store.limpiarMensajes()
  }

  /**
   * Retorna el color del badge según el rol.
   * @param {string} role
   */
  function getColorRol(role) {
    const colores = {
      admin: 'red',
      director: 'purple',
      docente: 'blue',
      user: 'gray',
    }
    return colores[role] || 'gray'
  }

  /**
   * Retorna el label legible del rol.
   * @param {string} role
   */
  function getLabelRol(role) {
    const labels = {
      admin: 'Administrador',
      director: 'Director',
      docente: 'Docente',
      user: 'Usuario',
    }
    return labels[role] || role
  }

  /**
   * Nombre completo desde el objeto persona.
   * @param {Object} usuario
   */
  function getNombreCompleto(usuario) {
    if (usuario.persona?.apellidos && usuario.persona?.nombres) {
      return `${usuario.persona.apellidos}, ${usuario.persona.nombres}`
    }
    return usuario.name || usuario.email || '—'
  }

  return {
    // Estado
    usuarios,
    usuarioSeleccionado,
    rolesPermitidos,
    loading,
    loadingAccion,
    error,
    successMessage,
    busqueda,

    // Acciones
    cargarUsuarios,
    crearUsuario,
    cambiarRol,
    resetPassword,
    seleccionarUsuario,
    limpiarSeleccion,
    setBusqueda,
    limpiarMensajes,

    // Helpers
    getColorRol,
    getLabelRol,
    getNombreCompleto,
  }
}
