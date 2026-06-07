// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

import {useAuthStore} from '@/stores/auth'

import AuthLayout from '@/layouts/AuthLayout.vue'
// import AdminLayout from '@/layouts/AdminLayout.vue'
// import DirectorLayout from '@/layouts/DirectorLayout.vue'
import DocenteLayout from '@/layouts/DocenteLayout.vue'

import LoginView from '@/views/auth/LoginView.vue'
import Error403 from '@/views/Error403.vue'
import SinAcceso from '@/views/SinAcceso.vue'


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      component: AuthLayout,
      children: [{ path: '', component: LoginView }],
      meta: { public: true }
    },
    // ADMIN
    // {
    //   path: '/admin',
    //   component: AdminLayout,
    //   meta: { role: 'admin' },
    //   children: [
    //     { path: 'dashboard', component: () => import('@/views/admin/AdminDashboard.vue') },
    //     { path: 'usuarios', component: () => import('@/views/admin/AdminUsuarios.vue') }
    //   ]
    // },
    // DIRECTOR
    // {
    //   path: '/director',
    //   component: DirectorLayout,
    //   meta: { role: 'director' },
    //   children: [
    //     { path: 'dashboard', component: () => import('@/views/director/DirectorDashboard.vue') },
    //     { path: 'planificaciones', component: () => import('@/views/director/PlanificacionesRecibidas.vue') }
    //   ]
    // },
    // DOCENTE
    {
      path: '/docente',
      component: DocenteLayout,
      meta: { role: 'docente' },
      redirect: '/docente/dashboard',
      children: [
              {
                path: 'dashboard',
                name: 'docente-dashboard',
                component: () => import('@/views/docente/DocenteDashboard.vue')
              },
              {
                path: 'planificaciones/crear',
                name: 'crear-planificacion',
                component: () => import('@/views/docente/CrearPlanificacion.vue')
              },
              {
                path: 'planificaciones/editar/:id',
                name: 'editar-planificacion',
                component: () => import('@/views/docente/EditarPlanificacion.vue')
              },
              {
                path: 'planificaciones/ver/:id',
                name: 'ver-planificacion',
                component: () => import('@/views/docente/VerPlanificacion.vue')
              }
      ]
    },
    // Rutas públicas o sin rol específico
    { path: '/403', component: Error403, meta: { public: true } },
    { path: '/sin-acceso', component: SinAcceso, meta: { public: true } }
  ],
})
// GUARD GLOBAL
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (!auth.token) auth.loadSession()

  if (to.meta.public) return next()

  if (!auth.isAuthenticated) return next('/login')

  if (to.meta.role && to.meta.role !== auth.userRole) {
    return next('/403')
  }

  next()
})
export default router

