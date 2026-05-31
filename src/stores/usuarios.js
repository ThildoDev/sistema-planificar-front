import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import AdminRepository from '@/repositories/AdminRepository'

export const useUsuariosStore = defineStore('usuarios', () => {
  // ─── Estado ───────────────────────────────────────────────────────────────
  const usuarios = ref([])
  const loading = ref(false)
  const loadingAction = ref(false)
  const error = ref(null)
  const successMsg = ref(null)

  // ─── Getters ──────────────────────────────────────────────────────────────
  const totalUsuarios = computed(() => usuarios.value.length)

  const totalDocentes = computed(() => usuarios.value.filter((u) => u.role === 'docente').length)

  const totalDirectores = computed(() => usuarios.value.filter((u) => u.role === 'director').length)

  // ─── Helpers internos ────────────────────────────────────────────────────
  function clearMessages() {
    error.value = null
    successMsg.value = null
  }

  // ─── Acciones ─────────────────────────────────────────────────────────────

  async function fetchUsuarios(params = {}) {
    loading.value = true
    clearMessages()
    try {
      const data = await AdminRepository.getUsuarios(params)
      usuarios.value = Array.isArray(data) ? data : (data.data ?? [])
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al cargar los usuarios.'
    } finally {
      loading.value = false
    }
  }

  async function crearUsuario(formData) {
    loadingAction.value = true
    clearMessages()
    try {
      const data = await AdminRepository.register(formData)
      // Agregar el nuevo usuario a la lista local
      if (data.user) usuarios.value.unshift(data.user)
      successMsg.value = `Usuario ${formData.name} creado exitosamente con rol "user".`
      return { ok: true }
    } catch (err) {
      const errors = err.response?.data?.errors
      if (errors) {
        const firstError = Object.values(errors)[0]
        error.value = Array.isArray(firstError) ? firstError[0] : firstError
      } else {
        error.value = err.response?.data?.message || 'Error al crear el usuario.'
      }
      return { ok: false }
    } finally {
      loadingAction.value = false
    }
  }

  async function asignarRol(userId, role) {
    loadingAction.value = true
    clearMessages()
    try {
      const data = await AdminRepository.asignarRol(userId, role)
      // Actualizar el rol en la lista local sin refetch
      const idx = usuarios.value.findIndex((u) => u.id === userId)
      if (idx !== -1) usuarios.value[idx].role = role
      successMsg.value = `Rol actualizado a "${role}" correctamente.`
      return { ok: true }
    } catch (err) {
      if (err.response?.status === 403) {
        error.value = 'No tenés permisos para asignar ese rol.'
      } else {
        error.value = err.response?.data?.message || 'Error al cambiar el rol.'
      }
      return { ok: false }
    } finally {
      loadingAction.value = false
    }
  }

  async function resetPassword(userId, data) {
    loadingAction.value = true
    clearMessages()
    try {
      await AdminRepository.resetPassword(userId, data)
      successMsg.value = 'Contraseña blanqueada exitosamente.'
      return { ok: true }
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al blanquear la contraseña.'
      return { ok: false }
    } finally {
      loadingAction.value = false
    }
  }

  return {
    // Estado
    usuarios,
    loading,
    loadingAction,
    error,
    successMsg,
    // Getters
    totalUsuarios,
    totalDocentes,
    totalDirectores,
    // Acciones
    fetchUsuarios,
    crearUsuario,
    asignarRol,
    resetPassword,
    clearMessages,
  }
})
