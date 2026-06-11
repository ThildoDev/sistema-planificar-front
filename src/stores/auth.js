import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// ─── Mock Users ───────────────────────────────────────────────────────────────
const MOCK_USERS = {
  docente: {
    id: 1,
    name: 'Ana García',
    email: 'ana.garcia@escuela.edu.ar',
    userRole: 'docente',
    roleLabel: 'Docente',
    prefix: 'Prof.',
    legajo: 'DOC-2024-001',
    notifications: 3,
  },
  director: {
    id: 2,
    name: 'Carlos Méndez',
    email: 'c.mendez@escuela.edu.ar',
    userRole: 'director',
    roleLabel: 'Director',
    prefix: 'Dir.',
    legajo: 'DIR-2024-001',
    notifications: 7,
  },
  admin: {
    id: 3,
    name: 'Laura Ríos',
    email: 'l.rios@escuela.edu.ar',
    userRole: 'admin',
    roleLabel: 'Administrador',
    prefix: 'Admin.',
    legajo: 'ADM-2024-001',
    notifications: 1,
  },
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
export const mockPlanificacionesDocente = [
  { id: 1, area: 'Matemática', tipo: 'Anual', fecha: '2024-03-15', estado: 'APROBADA', clases: 28, avance: 72 },
  { id: 2, area: 'Lengua', tipo: 'Trimestral', fecha: '2024-04-01', estado: 'EN REVISIÓN', clases: 14, avance: 45 },
  { id: 3, area: 'Ciencias Naturales', tipo: 'Anual', fecha: '2024-03-20', estado: 'CON OBS', clases: 10, avance: 30 },
  { id: 4, area: 'Ciencias Sociales', tipo: 'Trimestral', fecha: '2024-04-05', estado: 'BORRADOR', clases: 0, avance: 0 },
  { id: 5, area: 'Educación Física', tipo: 'Anual', fecha: '2024-03-10', estado: 'APROBADA', clases: 32, avance: 88 },
]

export const mockPlanificacionesDirector = [
  { id: 1, docente: 'Ana García', area: 'Matemática', tipo: 'Anual', fecha: '2024-03-15', estado: 'EN REVISIÓN' },
  { id: 2, docente: 'Marcos Pérez', area: 'Lengua', tipo: 'Anual', fecha: '2024-03-18', estado: 'EN REVISIÓN' },
  { id: 3, docente: 'Sofía Torres', area: 'Ciencias Naturales', tipo: 'Trimestral', fecha: '2024-03-22', estado: 'APROBADA' },
  { id: 4, docente: 'Lucía Romero', area: 'Historia', tipo: 'Anual', fecha: '2024-03-25', estado: 'CON OBS' },
  { id: 5, docente: 'Diego Fernández', area: 'Inglés', tipo: 'Trimestral', fecha: '2024-03-28', estado: 'EN REVISIÓN' },
]

export const mockUsuarios = [
  { id: 1, name: 'Ana García', email: 'ana.garcia@escuela.edu.ar', role: 'docente', activo: true },
  { id: 2, name: 'Carlos Méndez', email: 'c.mendez@escuela.edu.ar', role: 'director', activo: true },
  { id: 3, name: 'Marcos Pérez', email: 'm.perez@escuela.edu.ar', role: 'docente', activo: true },
  { id: 4, name: 'Sofía Torres', email: 's.torres@escuela.edu.ar', role: 'docente', activo: false },
  { id: 5, name: 'Lucía Romero', email: 'l.romero@escuela.edu.ar', role: 'docente', activo: true },
]

export function computeKpisDocente(planificaciones) {
  const total = planificaciones.length
  const clases = planificaciones.reduce((acc, p) => acc + p.clases, 0)
  const avancePromedio = total ? Math.round(planificaciones.reduce((acc, p) => acc + p.avance, 0) / total) : 0
  return { total, clases, avancePromedio }
}

export const ESTADO_CONFIG = {
  'APROBADA':    { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'EN REVISIÓN': { bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-500' },
  'CON OBS':     { bg: 'bg-rose-100',    text: 'text-rose-700',    dot: 'bg-rose-500' },
  'BORRADOR':    { bg: 'bg-slate-100',   text: 'text-slate-600',   dot: 'bg-slate-400' },
}

// ─── Store de Pinia Dinámico ──────────────────────────────────────────────────
export const useAuthStore = defineStore('auth', () => {
  // Inicializamos leyendo del localStorage para que no se borre al tocar F5
  const currentRole = ref(localStorage.getItem('planificar_role') || null)
  const isAuthenticated = ref(!!localStorage.getItem('planificar_role'))

  // Reactividad unificada en cascada
  const user = computed(() => currentRole.value ? MOCK_USERS[currentRole.value] : null)
  const userRole = computed(() => user.value?.userRole || null)

  /**
   * Procesa las credenciales ingresadas en el Login de forma dinámica
   */
  async function login(email, _password) { // El password no se valida en este mock, cualquier valor es aceptado
    return new Promise((resolve, reject) => {
      // Simula pequeña demora de red para apreciar el Loader animado
      setTimeout(() => {
        let roleEncontrado = null

        if (email === MOCK_USERS.docente.email) roleEncontrado = 'docente'
        else if (email === MOCK_USERS.director.email) roleEncontrado = 'director'
        else if (email === MOCK_USERS.admin.email) roleEncontrado = 'admin'

        if (roleEncontrado) {
          currentRole.value = roleEncontrado
          isAuthenticated.value = true
          localStorage.setItem('planificar_role', roleEncontrado)
          resolve(MOCK_USERS[roleEncontrado])
        } else {
          reject(new Error('El correo ingresado no coincide con ningún usuario del sistema.'))
        }
      }, 700)
    })
  }

  /**
   * Cierre de sesión efectivo y borrado del almacenamiento local
   */
  function logout() {
    currentRole.value = null
    isAuthenticated.value = false
    localStorage.removeItem('planificar_role')
  }

  /**
   * Valida sesión activa para el Navigation Guard global
   */
  function loadSession() {
    const savedRole = localStorage.getItem('planificar_role')
    if (savedRole) {
      currentRole.value = savedRole
      isAuthenticated.value = true
    }
    return user.value
  }

  function switchRole(role) {
    if (MOCK_USERS[role]) {
      currentRole.value = role
      isAuthenticated.value = true
      localStorage.setItem('planificar_role', role)
    }
  }

  return {
    user,
    userRole,
    isAuthenticated,
    currentRole,
    login,
    logout,
    loadSession,
    switchRole,
  }
})
