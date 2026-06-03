
import { defineStore } from 'pinia'
import AuthRepository from '@/repositories/AuthRepository'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    userRole: (state) => state.user?.role || null
  },

  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null

      try {
        const { user, token } = await AuthRepository.login(credentials)

        this.user = user
        this.token = token

        // Guardar sesión
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))

        return true
      } catch (err) {
        this.error = err.response?.data?.message || 'Error al iniciar sesión'
        return false
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        await AuthRepository.logout()
      } catch (_) {
        // Ignorar errores del backend
      }

      this.user = null
      this.token = null

      localStorage.removeItem('token')
      localStorage.removeItem('user')

      window.location.href = '/login'
    },

    loadSession() {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')

      if (token && user) {
        this.token = token
        this.user = JSON.parse(user)
      }
    }
  }
})
