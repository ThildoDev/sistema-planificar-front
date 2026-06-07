// import { defineStore } from 'pinia'
// import api from '@/plugins/axios'
// import { useToastStore } from '@/stores/toast'

// export const useAuthStore = defineStore('auth', {
//   state: () => ({
//     user: null,
//     token: null
//   }),

//   getters: {
//     isAuthenticated: (state) => !!state.token,
//     userRole: (state) => state.user?.role || null
//   },

//   actions: {
//     async login(credentials) {
//       const toast = useToastStore()

//       try {
//         const { data } = await api.post('/login', credentials)

//         this.token = data.access_token
//         this.user = data.user

//         toast.showToast('Inicio de sesión exitoso', 'success')
//       } catch (error) {
//         toast.showToast('Credenciales incorrectas', 'error')
//         throw error
//       }
//     },

//     clearSession() {
//       this.token = null
//       this.user = null
//     },

//     logout() {
//       const toast = useToastStore()
//       this.clearSession()
//       toast.showToast('Sesión cerrada correctamente', 'info')
//     }
//   }
// })

//  SE DEJÓ COMENTADO PORQUE TODAVÍA NO SE IMPLEMENTÓ LA AUTENTICACIÓN REAL, PERO SE MANTIENE COMO REFERENCIA PARA FUTURAS IMPLEMENTACIONES.!!!!!
// import { defineStore } from 'pinia'
// import { ref, computed } from 'vue'

// export const useAuthStore = defineStore('auth', () => {
//   const user = ref({
//     id: 1,
//     name: 'Ana García',
//     email: 'ana.garcia@escuela.edu.ar',
//     userRole: 'docente',
//     legajo: 'DOC-2024-001',
//     avatar: null
//   })

//   const isAuthenticated = ref(true)
//   const userRole = computed(() => user.value?.userRole || null)

//   function setUser(userData) {
//     user.value = userData
//   }

//   function logout() {
//     user.value = null
//     isAuthenticated.value = false
//   }

//   return {
//     user,
//     isAuthenticated,
//     userRole,
//     setUser,
//     logout
//   }
// })

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // Estado del usuario logueado por defecto (Mock institucional)
  const user = ref({
    id: 1,
    name: 'Ana García',
    email: 'ana.garcia@escuela.edu.ar',
    userRole: 'docente',
    legajo: 'DOC-2024-001',
    avatar: null
  })

  const isAuthenticated = ref(true)
  const loading = ref(false) // 🌟 Controla el estado de carga global de la sesión

  // Propiedad computada para obtener el rol de forma segura
  const userRole = computed(() => user.value?.userRole || null)

  /**
   * 🌟 FUNCIÓN CLAVE: Carga o valida la sesión activa
   * Esto es lo que el Navigation Guard de tu router necesita (auth.loadSession)
   */
  const loadSession = async () => {
    loading.value = true
    return new Promise((resolve) => {
      // Simulamos un retraso de red imperceptible de 100ms
      setTimeout(() => {
        loading.value = false
        // Si hay un usuario en el ref, la sesión es válida (true)
        resolve(!!user.value)
      }, 100)
    })
  }

  function setUser(userData) {
    user.value = userData
    isAuthenticated.value = !!userData
  }

  function logout() {
    user.value = null
    isAuthenticated.value = false
  }

  return {
    user,
    isAuthenticated,
    userRole,
    loading,      //  Exportado para componentes que requieran ver si está verificando
    loadSession,  //  ¡Exportado para que el router deje de tirar error!
    setUser,
    logout
  }
})
