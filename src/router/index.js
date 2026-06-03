import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/login',
    //   name: 'login',
    //   component: LoginView
    // },
      {
        path: '/',
        component: MainLayout,
        redirect: '/docente/dashboard',
        children: [
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
        ]
      }
    ],
  })

export default router
