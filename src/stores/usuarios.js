// src/stores/usuarios.js
import { defineStore } from 'pinia'
import AdminRepository from '@/repositories/AdminRepository'
import DirectorRepository from '@/repositories/DirectorRepository'
import { useAuthStore } from '@/stores/auth'

/**
 * Store de Pinia para la gestión de usuarios.
 * Compartido entre Admin y Director con permisos diferenciados.
 */
export const useUsuariosStore = defineStore('usuarios', {
  state: () => ({
    // Lista de usuarios cargados
    usuarios: [],

    // Usuario seleccionado para modal de rol o password
    usuarioSeleccionado: null,

    // Estado de carga
    loading: false,
    loadingAccion: false,

    // Mensajes
    error: null,
    successMessage: null,

    // Filtro de búsqueda local
    busqueda: '',
  }),

  getters: {
    /**
     * Usuarios filtrados localmente por nombre o email.
     */
    usuariosFiltrados: (state) => {
      if (!state.busqueda.trim()) return state.usuarios
      const q = state.busqueda.toLowerCase()
      return state.usuarios.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.persona?.nombres?.toLowerCase().includes(q) ||
          u.persona?.apellidos?.toLowerCase().includes(q),
      )
    },

    /**
     * Roles que el usuario logueado puede asignar.
     * Admin → todos los roles
     * Director → solo 'user' y 'docente'
     */
    rolesPermitidos: () => {
      const authStore = useAuthStore()
      if (authStore.user?.role === 'admin') {
        return [
          { value: 'user', label: 'Usuario', color: 'gray' },
          { value: 'docente', label: 'Docente', color: 'blue' },
          { value: 'director', label: 'Director', color: 'purple' },
          { value: 'admin', label: 'Administrador', color: 'red' },
        ]
      }
      // Director
      return [
        { value: 'user', label: 'Usuario', color: 'gray' },
        { value: 'docente', label: 'Docente', color: 'blue' },
      ]
    },
  },

  actions: {
    // ─────────────────────────────────────────────
    // CARGAR USUARIOS
    // ─────────────────────────────────────────────

    /**
     * Carga la lista de usuarios según el rol del usuario logueado.
     * Admin → todos los usuarios
     * Director → solo user y docente
     */
    async fetchUsuarios() {
      this.loading = true
      this.error = null
      try {
        const authStore = useAuthStore()
        let response

        if (authStore.user?.role === 'admin') {
          response = await AdminRepository.getUsuarios()
        } else {
          response = await DirectorRepository.getUsuarios()
        }

        // Soportar respuesta directa o paginada
        this.usuarios = response.data?.data || response.data || []
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al cargar usuarios'
        this.usuarios = []
      } finally {
        this.loading = false
      }
    },

    // ─────────────────────────────────────────────
    // CREAR USUARIO (solo Admin)
    // ─────────────────────────────────────────────

    /**
     * Crea un usuario nuevo vía POST /api/register.
     * Siempre crea con role='user'.
     * @param {Object} formData - { nombre, apellido, name, email, password }
     * @returns {Promise<boolean>}
     */
    async crearUsuario(formData) {
      this.loadingAccion = true
      this.error = null
      this.successMessage = null
      try {
        await AdminRepository.crearUsuario(formData)
        this.successMessage = 'Usuario creado exitosamente'
        await this.fetchUsuarios()
        return true
      } catch (error) {
        this.error =
          error.response?.data?.message ||
          error.response?.data?.errors?.email?.[0] ||
          'Error al crear usuario'
        return false
      } finally {
        this.loadingAccion = false
      }
    },

    // ─────────────────────────────────────────────
    // CAMBIAR ROL
    // ─────────────────────────────────────────────

    /**
     * Cambia el rol de un usuario.
     * Respeta la jerarquía: director solo puede asignar user/docente.
     * @param {number|string} userId
     * @param {string} nuevoRol
     * @returns {Promise<boolean>}
     */
    async cambiarRol(userId, nuevoRol) {
      this.loadingAccion = true
      this.error = null
      this.successMessage = null
      try {
        const authStore = useAuthStore()
        let response

        if (authStore.user?.role === 'admin') {
          response = await AdminRepository.cambiarRolUsuario(userId, nuevoRol)
        } else {
          response = await DirectorRepository.cambiarRolUsuario(userId, nuevoRol)
        }

        // Actualizar localmente sin recargar todo
        const index = this.usuarios.findIndex((u) => u.id === userId)
        if (index !== -1) {
          this.usuarios[index] = { ...this.usuarios[index], role: nuevoRol }
        }

        this.successMessage = `Rol actualizado a "${nuevoRol}" correctamente`
        return true
      } catch (error) {
        const status = error.response?.status
        if (status === 403) {
          this.error = 'No tienes permisos para asignar ese rol'
        } else {
          this.error = error.response?.data?.message || 'Error al cambiar el rol'
        }
        return false
      } finally {
        this.loadingAccion = false
      }
    },

    // ─────────────────────────────────────────────
    // RESET PASSWORD (solo Admin)
    // ─────────────────────────────────────────────

    /**
     * Blanquea la contraseña de un usuario.
     * @param {number|string} userId
     * @param {string} nuevaPassword
     * @returns {Promise<boolean>}
     */
    async resetPassword(userId, nuevaPassword) {
      this.loadingAccion = true
      this.error = null
      this.successMessage = null
      try {
        await AdminRepository.resetPassword(userId, nuevaPassword)
        this.successMessage = 'Contraseña actualizada correctamente'
        return true
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al resetear contraseña'
        return false
      } finally {
        this.loadingAccion = false
      }
    },

    // ─────────────────────────────────────────────
    // UTILIDADES
    // ─────────────────────────────────────────────

    seleccionarUsuario(usuario) {
      this.usuarioSeleccionado = { ...usuario }
    },

    limpiarSeleccion() {
      this.usuarioSeleccionado = null
      this.error = null
      this.successMessage = null
    },

    setBusqueda(valor) {
      this.busqueda = valor
    },

    limpiarMensajes() {
      this.error = null
      this.successMessage = null
    },
  },
})
