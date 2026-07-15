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
        redirect: '/planificaciones'
      },

      {
        path: 'configuracion',
        name: 'configuracion',
        component: () => import('@/views/auth/ConfiguracionView.vue'),
        meta: { title: 'Configuración Perfil' }
      },


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

      {
        path: 'revisiones',
        component: () => import('@/views/director/DirectorDashboard.vue'),
        meta: { title: 'Revisiones', role: 'director' }
      },

      {
        path: 'docentes/crear',
        name: 'crear-docente',
        component: () => import('@/views/director/CrearDocenteView.vue'),
        meta: { title: 'Registrar Docente', role: 'director' }
      },

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

  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (typeof authStore.loadSession === 'function' && !authStore.isAuthenticated) {
    await authStore.loadSession()
  }

  if (to.meta.public) {
    if (authStore.isAuthenticated) {
      return '/'
    }
    return true
  }

  if (!authStore.isAuthenticated) {
    return '/login'
  }

  if (to.path === '/') {
    if (authStore.userRole === 'docente') return '/planificaciones'
    if (authStore.userRole === 'director') return '/revisiones'
    if (authStore.userRole === 'admin') return '/admin'
    return '/login'
  }

  if (to.meta.role) {
    const rolesPermitidos = Array.isArray(to.meta.role) ? to.meta.role : [to.meta.role]

    if (!rolesPermitidos.includes(authStore.userRole)) {
      console.warn(`Acceso denegado a ${to.path}. Roles requeridos: ${rolesPermitidos.join(', ')}. Tu rol: ${authStore.userRole}`)

      if (authStore.userRole === 'docente') return '/planificaciones'
      if (authStore.userRole === 'director') return '/revisiones'
      if (authStore.userRole === 'admin') return '/admin'
      return '/login'
    }
  }

  return true
})

export default router
