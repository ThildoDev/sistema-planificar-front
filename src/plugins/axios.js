import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import router from '@/router'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

// REQUEST → Agrega token si existe automáticamente de forma ultra limpia
// REQUEST → Agrega token si existe automáticamente de forma limpia
api.interceptors.request.use(config => {
  let token = localStorage.getItem('planificar_token')

  if (!token) {
    const auth = useAuthStore()
    token = auth.token
  }

  if (token) {
    // 🧼 Limpieza definitiva: Removemos comillas dobles y espacios en blanco residuales
    token = token.trim().replace(/^"(.*)"$/, '$1')

    // Dejamos que vaya la estructura completa ID|TOKEN sin comillas
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// RESPONSE → Maneja expiración, 401, 403, 422 y 500
api.interceptors.response.use(
  response => response,
  error => {
    const toast = useToastStore()
    const status = error.response?.status

    // 401 — Sesión expirada o Inválida
    if (status === 401) {
      // 🟢 SI EL ERROR OCURRE EN EL LOGIN, NO HAGAS NADA
      // Deja pasar el error directamente al catch de LoginView.vue
      if (error.config?.url?.endsWith('/login')) {
        return Promise.reject(error)
      }

      // Si ocurre en cualquier otra ruta, entonces sí es porque el token caducó
      toast.showToast('Sesión expirada o credenciales inválidas.', 'error')

      const auth = useAuthStore()
      auth.clearSession()

      router.push('/login')
    }

    // 403 — Sin permisos
    if (status === 403) {
      toast.showToast('No tenés permisos para realizar esta acción.', 'warning')
    }

    // 422 — Errores de validación de Laravel (Mapeado con "Errors")
    if (status === 422) {
      const validationErrors = error.response.data.Errors || error.response.data.errors

      if (validationErrors) {
        const firstErrorMessage = Object.values(validationErrors)[0][0]
        toast.showToast(firstErrorMessage, 'warning')
      } else {
        toast.showToast(error.response.data.Mensaje || 'Error de validación.', 'warning')
      }
    }

    // 500+ — Error inesperado del Servidor
    if (!status || status >= 500) {
      toast.showToast('Error inesperado en el servidor.', 'error')
    }

    return Promise.reject(error)
  }
)

export default api
