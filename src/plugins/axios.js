
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import router from '@/router'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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

    // 401 — Sesión expirada
    if (status === 401) {
      toast.showToast('Sesión expirada. Iniciá sesión nuevamente.', 'error')

      const auth = useAuthStore()
      auth.clearSession()

      router.push('/login')
    }
    // 403 — Sin permisos
    if (status === 403) {
      toast.showToast('No tenés permisos para acceder.', 'warning')
    }
    // 422 — Errores de validación
    if (status === 422) {
      const errors = error.response.data.errors
      const first = Object.values(errors)[0][0]
      toast.showToast(first, 'warning')
    }
    // 500+ — Error inesperado
    if (!status || status >= 500) {
      toast.showToast('Error inesperado en el servidor.', 'error')
    }

    return Promise.reject(error)
  }
)

export default api
