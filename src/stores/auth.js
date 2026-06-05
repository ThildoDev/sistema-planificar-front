import { defineStore } from 'pinia'
import api from '@/plugins/axios'
import { useToastStore } from '@/stores/toast'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    userRole: (state) => state.user?.role || null
  },

  actions: {
    async login(credentials) {
      const toast = useToastStore()

      try {
        const { data } = await api.post('/login', credentials)

        this.token = data.access_token
        this.user = data.user

        toast.showToast('Inicio de sesión exitoso', 'success')
      } catch (error) {
        toast.showToast('Credenciales incorrectas', 'error')
        throw error
      }
    },

    clearSession() {
      this.token = null
      this.user = null
    },

    logout() {
      const toast = useToastStore()
      this.clearSession()
      toast.showToast('Sesión cerrada correctamente', 'info')
    }
  }
})
