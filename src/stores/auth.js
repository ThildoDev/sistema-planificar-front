// 📂 Archivo: src/stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/plugins/axios'

export const useAuthStore = defineStore('auth', () => {
  // Estado persistido real del almacenamiento local
  const token = ref(localStorage.getItem('planificar_token') || null)
  const user = ref(JSON.parse(localStorage.getItem('planificar_user')) || null)
  const isAuthenticated = ref(!!token.value)

  // Rol del usuario leído de forma reactiva de la base de datos
  const userRole = computed(() => user.value?.role || null)

  /**
   * Petición HTTP POST al /api/login del Backend real de Laravel
   */
  async function login(email, password) {
    // Realiza el disparo POST enviando el body estructurado al backend
    const response = await api.post('/login', { email, password })

    // Extrae las propiedades reales devueltas por Laravel Sanctum
    const accessToken = response.data.access_token
    const userData = response.data.user

    // Mutamos los valores reactivos en memoria
    token.value = accessToken
    user.value = userData
    isAuthenticated.value = true

    // Guardamos físicamente la sesión para aguantar los reinicios del navegador
    localStorage.setItem('planificar_token', accessToken)
    localStorage.setItem('planificar_user', JSON.stringify(userData))

    return response.data
  }

  /**
   * Cierre de sesión centralizado (Revoca token en Laravel y borra memoria)
   */
  async function logout() {
    try {
      await api.post('/logout')
    } catch (error) {
      console.warn('El backend no pudo invalidar el token o ya estaba expirado.', error)
    } finally {
      // Limpieza total obligatoria sin importar si la red falló
      clearSession()
    }
  }

  /**
   * Limpia el estado local (Llamado por logout manual y por el interceptor 401)
   */
  function clearSession() {
    token.value = null
    user.value = null
    isAuthenticated.value = false

    localStorage.removeItem('planificar_token')
    localStorage.removeItem('planificar_user')
  }

  /**
   * Valida sesión en el Navigation Guard (router.beforeEach) antes de cargar páginas
   */
  function loadSession() {
    const savedToken = localStorage.getItem('planificar_token')
    const savedUser = localStorage.getItem('planificar_user')

    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = JSON.parse(savedUser)
      isAuthenticated.value = true
      return true
    }

    clearSession()
    return false
  }

  return {
    token,
    user,
    userRole,
    isAuthenticated,
    login,
    logout,
    clearSession,
    loadSession,
  }
})
