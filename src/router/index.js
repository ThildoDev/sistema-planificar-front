import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import MainLayout from '@/layouts/MainLayout.vue'
import LoginView from '@/views/auth/LoginView.vue'

const routes = [
  {
    path: '/login',
    component: LoginView,
    meta: { public: true }
  },
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        // Redirección inteligente inicial. El Guard global se encargará de cambiarla según el rol.
        redirect: '/planificaciones'
      },
      // ── MÓDULO CONFIGURACIÓN / PERFIL (Disponible para todos los roles) ── [cite: 485]
      {
        path: 'configuracion',
        name: 'configuracion',
        component: () => import('@/views/auth/ConfiguracionView.vue'),
        meta: { title: 'Configuración Perfil' }
      },

      // Módulo Docente
      {
        path: 'planificaciones',
        component: () => import('@/views/docente/DocenteDashboard.vue'),
        meta: { title: 'Mis Planificaciones', role: 'docente' }
      },
      {
        path: 'planificaciones/nueva',
        component: () => import('@/views/docente/FormularioPlanificacion.vue'),
        meta: { title: 'Crear Planificación', role: 'docente' }
      },
      {
        path: 'planificaciones/editar/:id',
        component: () => import('@/views/docente/EditarPlanificacion.vue'),
        meta: { title: 'Editar Planificación', role: 'docente' }
      },
      {
        path: 'planificaciones/ver/:id',
        component: () => import('@/views/docente/VerPlanificacion.vue'),
        meta: { title: 'Ver Planificación' } // 🟢 SE QUITÓ EL ROL EXCLUSIVO PARA QUE EL DIRECTOR TAMBIÉN PUEDA ENTRAR
      },
      // Módulo Director
      {
        path: 'revisiones',
        component: () => import('@/views/director/DirectorDashboard.vue'),
        meta: { title: 'Revisiones', role: 'director' }
      },
      // ── MÓDULO GESTIÓN DIRECTIVA (Crear Docente) ── [cite: 486]
      {
        path: 'docentes/crear',
        name: 'crear-docente',
        component: () => import('@/views/director/CrearDocenteView.vue'),
        meta: { title: 'Registrar Docente', role: 'director' }
      },
      // ── MÓDULO GESTIÓN DIRECTIVA (Blanqueo de Contraseña) ── [cite: 488]
      {
        path: 'usuarios/reset',
        name: 'usuarios-reset',
        component: () => import('@/views/director/BlanqueoView.vue'),
        meta: { title: 'Blanqueo de Contraseña', role: 'director' }
      },
      // Módulo Admin
      {
        path: 'admin',
        component: () => import('@/views/admin/AdminDashboard.vue'),
        meta: { title: 'Usuarios', role: 'admin' }
      }
    ]
  },
  // Captura de rutas inexistentes: redirige al Home seguro
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard de autenticación y redirección por Roles (Versión Vue Router 4 limpia 🟢)
router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  // 1. Cargar sesión persistente o mock si existe
  if (typeof authStore.loadSession === 'function' && !authStore.isAuthenticated) {
    await authStore.loadSession()
  }

  // 2. Si la ruta es pública (como el Login)
  if (to.meta.public) {
    if (authStore.isAuthenticated) {
      return '/' // Redirige a la raíz para resolver por rol
    }
    return true // Permite el paso libre al Login
  }

  // 3. Protección de autenticación global
  if (!authStore.isAuthenticated) {
    return '/login'
  }

  // 4. Redirección automática en la raíz '/' según el rol del usuario logueado
  if (to.path === '/') {
    if (authStore.userRole === 'docente') return '/planificaciones'
    if (authStore.userRole === 'director') return '/revisiones'
    if (authStore.userRole === 'admin') return '/admin'
    return '/login'
  }

  // 5. Control perimetral estricto de Roles (meta.role)
  if (to.meta.role && to.meta.role !== authStore.userRole) {
    console.warn(`Acceso denegado a ${to.path}. Rol requerido: ${to.meta.role}. Tu rol: ${authStore.userRole}`)

    if (authStore.userRole === 'docente') return '/planificaciones'
    if (authStore.userRole === 'director') return '/revisiones'
    if (authStore.userRole === 'admin') return '/admin'
    return '/login'
  }

  // 6. Si pasa todos los filtros, permitir la navegación de forma nativa
  return true
})

export default router
