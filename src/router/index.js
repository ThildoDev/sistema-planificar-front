import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
    },
    {
      path: '/docente',
      component: () => import('../views/docente/DocenteLayout.vue'),
      meta: { requiresRole: 'docente' },
      children: [
        {
          path: '',
          redirect: { name: 'docente-dashboard' },
        },
        {
          path: 'dashboard',
          name: 'docente-dashboard',
          component: () => import('../views/docente/DashboardDocente.vue'),
        },
        // Marcadores de posición para las tareas del Integrante B
        {
          path: 'planificacion-anual',
          name: 'docente-anual',
          component: () => import('../views/docente/DashboardDocente.vue'), // Reutilizado temporalmente
        },
        {
          path: 'clase-diaria',
          name: 'docente-diaria',
          component: () => import('../views/docente/DashboardDocente.vue'),
        },
      ],
    },
    {
      path: '/director',
      component: () => import('../views/director/DirectorLayout.vue'),
      meta: { requiresRole: 'director' },
      children: [
        {
          path: '',
          redirect: { name: 'director-dashboard' },
        },
        {
          path: 'dashboard',
          name: 'director-dashboard',
          component: () => import('../views/director/DashboardDirector.vue'),
        },
        // Marcadores de posición para las tareas del Integrante C
        {
          path: 'revisiones',
          name: 'director-revisiones',
          component: () => import('../views/director/DashboardDirector.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/login',
    },
  ],
})

// Guard de Seguridad Simulado por Rol
router.beforeEach((to, from, next) => {
  const userRole = localStorage.getItem('user_role')

  if (to.meta.requiresRole) {
    if (!userRole) {
      next('/login')
    } else if (to.meta.requiresRole !== userRole) {
      // Si intenta entrar a un rol que no le corresponde, lo redirige a su panel
      next(userRole === 'director' ? '/director/dashboard' : '/docente/dashboard')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
