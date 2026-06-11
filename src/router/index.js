// src/router/index.js
// import { createRouter, createWebHistory } from 'vue-router'

// import {useAuthStore} from '@/stores/auth'

// import AuthLayout from '@/layouts/AuthLayout.vue'
// // import AdminLayout from '@/layouts/AdminLayout.vue'
// // import DirectorLayout from '@/layouts/DirectorLayout.vue'
// import DocenteLayout from '@/layouts/DocenteLayout.vue'

// import LoginView from '@/views/auth/LoginView.vue'
// import Error403 from '@/views/Error403.vue'
// import SinAcceso from '@/views/SinAcceso.vue'


// const router = createRouter({
//   history: createWebHistory(),
//   routes: [
//     {
//       path: '/',
//       component: AuthLayout,
//       children: [{ path: '', component: LoginView }],
//       meta: { public: true }
//     },
//     // ADMIN
//     // {
//     //   path: '/admin',
//     //   component: AdminLayout,
//     //   meta: { role: 'admin' },
//     //   children: [
//     //     { path: 'dashboard', component: () => import('@/views/admin/AdminDashboard.vue') },
//     //     { path: 'usuarios', component: () => import('@/views/admin/AdminUsuarios.vue') }
//     //   ]
//     // },
//     // DIRECTOR
//     // {
//     //   path: '/director',
//     //   component: DirectorLayout,
//     //   meta: { role: 'director' },
//     //   children: [
//     //     { path: 'dashboard', component: () => import('@/views/director/DirectorDashboard.vue') },
//     //     { path: 'planificaciones', component: () => import('@/views/director/PlanificacionesRecibidas.vue') }
//     //   ]
//     // },
//     // DOCENTE
//     {
//       path: '/docente',
//       component: DocenteLayout,
//       meta: { role: 'docente' },
//       redirect: '/docente/dashboard',
//       children: [
//               {
//                 path: 'dashboard',
//                 name: 'docente-dashboard',
//                 component: () => import('@/views/docente/DocenteDashboard.vue')
//               },
//               {
//                 path: 'planificaciones/crear',
//                 name: 'crear-planificacion',
//                 component: () => import('@/views/docente/CrearPlanificacion.vue')
//               },
//               {
//                 path: 'planificaciones/editar/:id',
//                 name: 'editar-planificacion',
//                 component: () => import('@/views/docente/EditarPlanificacion.vue')
//               },
//               {
//                 path: 'planificaciones/ver/:id',
//                 name: 'ver-planificacion',
//                 component: () => import('@/views/docente/VerPlanificacion.vue')
//               }
//       ]
//     },
//     // Rutas públicas o sin rol específico
//     { path: '/403', component: Error403, meta: { public: true } },
//     { path: '/sin-acceso', component: SinAcceso, meta: { public: true } }
//   ],
// })
// // GUARD GLOBAL
// router.beforeEach((to, from, next) => {
//   const auth = useAuthStore()

//   if (!auth.token) auth.loadSession()

//   if (to.meta.public) return next()

//   if (!auth.isAuthenticated) return next('/login')

//   if (to.meta.role && to.meta.role !== auth.userRole) {
//     return next('/403')
//   }

//   next()
// })
// export default router

// src/router/index.js
// src/router/index.js
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
      // Módulo Docente
      {
        path: 'planificaciones',
        component: () => import('@/views/docente/DocenteDashboard.vue'),
        meta: { title: 'Mis Planificaciones', role: 'docente' }
      },
      {
        path: 'planificaciones/crear',
        component: () => import('@/views/docente/CrearPlanificacion.vue'),
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
        meta: { title: 'Ver Planificación', role: 'docente' }
      },
      // Módulo Director
      {
        path: 'revisiones',
        component: () => import('@/views/director/DirectorDashboard.vue'),
        meta: { title: 'Revisiones', role: 'director' }
      },
      // {
      //   path: 'director',
      //   component: () => import('@/views/director/DirectorDashboard.vue'),
      //   meta: { title: 'Docentes', role: 'director' }
      // },
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

// Guard de autenticación y redirección por Roles
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // 1. Si tu store tiene una función loadSession para mocks, la ejecutamos si no está autenticado
  if (typeof authStore.loadSession === 'function' && !authStore.isAuthenticated) {
    await authStore.loadSession()
  }

  // 2. Si la ruta es pública (como el Login), permitir el paso libre
  if (to.meta.public) {
    // Si ya está logueado e intenta ir al login, lo mandamos a la raíz para que se redirija por su rol
    if (authStore.isAuthenticated) {
      return next('/')
    }
    return next()
  }

  // 3. Protección de autenticación global
  if (!authStore.isAuthenticated) {
    return next('/login')
  }

  // 4. Redirección automática en la raíz '/' según el rol del usuario logueado
  if (to.path === '/') {
    if (authStore.userRole === 'docente') return next('/planificaciones')
    if (authStore.userRole === 'director') return next('/revisiones')
    if (authStore.userRole === 'admin') return next('/admin')
    return next('/login') // Por seguridad si no tiene rol conocido
  }

  // 5. Control perimetral estricto de Roles (v-meta.role)
  if (to.meta.role && to.meta.role !== authStore.userRole) {
    console.warn(`Acceso denegado a ${to.path}. Rol requerido: ${to.meta.role}. Tu rol: ${authStore.userRole}`)
    // Redirige al panel correspondiente de su rol real para que no vea la pantalla en blanco
    if (authStore.userRole === 'docente') return next('/planificaciones')
    if (authStore.userRole === 'director') return next('/revisiones')
    if (authStore.userRole === 'admin') return next('/admin')
    return next('/login')
  }

  next()
})

export default router
