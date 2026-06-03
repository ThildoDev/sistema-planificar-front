// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import LoginView from '@/views/auth/LoginView.vue'
import ForbiddenView from '@/views/errors/ForbiddenView.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { public: true }
  },

  // DOCENTE
  {
    path: '/docente/dashboard',
    meta: { role: 'docente' },
    component: () => import('@/views/docente/DashboardView.vue')
  },

  // DIRECTOR
  {
    path: '/director/dashboard',
    meta: { role: 'director' },
    component: () => import('@/views/director/DashboardView.vue')
  },

  // ADMIN
  {
    path: '/admin/dashboard',
    meta: { role: 'admin' },
    component: () => import('@/views/admin/DashboardView.vue')
  },

  {
    path: '/403',
    component: ForbiddenView,
    meta: { public: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// GUARD GLOBAL
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  // Cargar sesión si no está cargada
  if (!auth.token) auth.loadSession()

  // Rutas públicas → permitir
  if (to.meta.public) return next()

  // Si no está autenticado → login
  if (!auth.isAuthenticated) return next('/login')

  // Si la ruta requiere rol → validar
  if (to.meta.role && to.meta.role !== auth.userRole) {
    return next('/403')
  }

  next()
})

export default router

