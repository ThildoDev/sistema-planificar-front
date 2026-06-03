// src/repositories/AuthRepository.js
import api from '@/plugins/axios'

export default {
  async login({ email, password }) {
    try {
      const response = await api.post('/login', {
        email,
        password
      })

      return {
        user: response.data.user,
        token: response.data.access_token
}

    } catch (error) {
      throw error
    }
  },

  async logout() {
    try {
      await api.post('/logout')
    } catch (error) {
      // Ignorar errores del backend
      console.warn('Error al cerrar sesión:', error)
    }
  },

  async register(payload) {
    try {
      const response = await api.post('/register', payload)
      return response.data
    } catch (error) {
      throw error
    }
  }
}
