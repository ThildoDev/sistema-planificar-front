
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  withCredentials: true,

})

// REQUEST → agrega token si existe

api.interceptors.request.use(config => {
  const auth = useAuthStore()
  if (auth.token) config.headers.Authorization = `Bearer ${auth.token}`
  return config
})


// RESPONSE → maneja expiración, 401, 419
api.interceptors.response.use(
  response => response,
  error => {
    const toast = useToastStore()
    const status = error.response?.status

    // Token expirado o sesión inválida
    if (status === 401) {
      toast.showToast('Sesión expirada. Iniciá sesión nuevamente.', 'error')
      const auth = useAuthStore()
      auth.logout()
    } else if (status === 403) {
      toast.showToast('No tenés permisos para acceder.', 'warning')
    } else if (status === 422) {
      toast.showToast('Error de validación. Revisá los datos.', 'info')
    } else {
      toast.showToast('Error inesperado en el servidor.', 'error')
    }

    return Promise.reject(error)
  }
)

export default api
