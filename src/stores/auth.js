import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    userRole: (state) => state.user?.role || null,
  },

  actions: {
    async login(email, password) {
      this.loading = true
      this.error = null

      try {
        // Simulamos una demora de red de 1 segundo para la experiencia de usuario
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // LÓGICA DE NEGOCIO SIMULADA: Reconocimiento de roles por correo
        let mockUser = null

        if (email === 'docente@escuela.edu.ar' && password === '123456') {
          mockUser = {
            id: 'doc_8832',
            name: 'Prof. Juan Pérez',
            email: email,
            role: 'docente',
            institution: 'Escuela de Educación Técnica N° 1',
          }
        } else if (email === 'director@escuela.edu.ar' && password === '123456') {
          mockUser = {
            id: 'dir_1102',
            name: 'Lic. María Sosa',
            email: email,
            role: 'director',
            institution: 'Escuela de Educación Técnica N° 1 - Región IV',
          }
        } else {
          throw new Error(
            'Credenciales inválidas. Usa: docente@escuela.edu.ar o director@escuela.edu.ar (Clave: 123456)',
          )
        }

        // Guardamos en el estado de Pinia
        this.user = mockUser
        this.token = 'mock-jwt-token-xyz123'

        // Persistencia para el router (local storage)
        localStorage.setItem('user_role', mockUser.role)
        localStorage.setItem('user_token', this.token)
        localStorage.setItem('user_data', JSON.stringify(mockUser))

        return mockUser
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.clear()
    },
  },
})
