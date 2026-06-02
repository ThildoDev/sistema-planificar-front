import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/docente/dashboard',
      name: 'DocenteDashboard',
      component: () => import('@/views/docente/DocenteDashboard.vue')
    },
    {
    path: '/docente/planificaciones/crear',
    name: 'CrearPlanificacion',
    component: () => import('@/views/docente/CrearPlanificacion.vue')
  }
  ],
})

export default router
