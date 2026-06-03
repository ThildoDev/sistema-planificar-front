// src/plugins/axios.js
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  withCredentials: false,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

// REQUEST → agrega token si existe
api.interceptors.request.use(
  (config) => {
    const auth = useAuthStore()
    if (auth.token) {
      config.headers.Authorization = `Bearer ${auth.token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// RESPONSE → maneja expiración, 401, 419
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const auth = useAuthStore()

    // Token expirado o sesión inválida
    if (error.response?.status === 401 || error.response?.status === 419) {
      auth.logout()
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default api
