<template>
  <aside class="sidebar">
    <h2 class="logo">PlanificAr</h2>

    <nav>
      <ul>
        <li v-for="item in menu" :key="item.to">
          <router-link :to="item.to" class="nav-item">
            <component :is="item.icon" class="icon" />
            <span>{{ item.label }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { Home, Users, BookOpen, ClipboardList } from 'lucide-vue-next'

const auth = useAuthStore()

const menus = {
  admin: [
    { label: 'Dashboard', to: '/admin/dashboard', icon: Home },
    { label: 'Usuarios', to: '/admin/usuarios', icon: Users }
  ],
  director: [
    { label: 'Dashboard', to: '/director/dashboard', icon: Home },
    { label: 'Docentes', to: '/director/docentes', icon: Users },
    { label: 'Planificaciones', to: '/director/planificaciones', icon: ClipboardList }
  ],
  docente: [
    { label: 'Dashboard', to: '/docente/dashboard', icon: Home },
    { label: 'Mis Planificaciones', to: '/docente/planificaciones', icon: BookOpen }
  ]
}

const menu = computed(() => menus[auth.userRole] || [])
</script>

<style scoped>
.sidebar {
  width: 240px;
  background: #1e1f26;
  color: white;
  padding: 20px;
}
.logo {
  font-size: 22px;
  margin-bottom: 30px;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  color: white;
}
.nav-item:hover {
  background: #2c2d35;
}
.icon {
  width: 20px;
}
</style>
