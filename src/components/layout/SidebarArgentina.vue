<template>
  <aside class="sidebar-argentina fade-in">
    <div class="top">
      <div class="shield">🛡️</div>
      <h2 class="role">{{ roleLabel }}</h2>
    </div>

    <nav class="menu">
      <RouterLink
        v-for="item in menuItems"
        :key="item.to"
        :to="item.to"
        class="menu-item"
        active-class="active"
      >
        <span class="icon">{{ item.icon }}</span>
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const roleLabel = computed(() => {
  switch (auth.userRole) {
    case 'admin': return 'Administrador'
    case 'director': return 'Director'
    case 'docente': return 'Docente'
    default: return 'Usuario'
  }
})

const menuItems = computed(() => {
  if (auth.userRole === 'admin') {
    return [
      { label: 'Dashboard', to: '/admin/dashboard', icon: '📊' },
      { label: 'Usuarios', to: '/admin/usuarios', icon: '👥' },
      { label: 'Planificaciones', to: '/admin/planificaciones', icon: '📘' }
    ]
  }

  if (auth.userRole === 'director') {
    return [
      { label: 'Dashboard', to: '/director/dashboard', icon: '📊' },
      { label: 'Aprobaciones', to: '/director/aprobaciones', icon: '✔️' },
      { label: 'Reportes', to: '/director/reportes', icon: '📄' }
    ]
  }

  if (auth.userRole === 'docente') {
    return [
      { label: 'Mis Planificaciones', to: '/docente/planificaciones', icon: '📘' },
      { label: 'Perfil', to: '/docente/perfil', icon: '👤' }
    ]
  }

  return []
})
</script>

<style scoped>
.sidebar-argentina {
  width: 240px;
  height: 100vh;
  background: var(--bg-soft);
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  border-right: 2px solid rgba(255,215,0,0.25);
  box-shadow: 4px 0 12px rgba(0,0,0,0.06);

  background-image: repeating-linear-gradient(
    180deg,
    rgba(117,170,219,0.12) 0px,
    rgba(117,170,219,0.12) 60px,
    rgba(255,255,255,0.12) 60px,
    rgba(255,255,255,0.12) 120px
  );
}

.top {
  text-align: center;
}

.shield {
  font-size: 40px;
  margin-bottom: 8px;
  animation: pulse 3s infinite ease-in-out;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 0.9; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.9; }
}

.role {
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: var(--radius);
  color: var(--text);
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition);
}

.menu-item:hover {
  background: rgba(117,170,219,0.15);
  transform: translateX(4px);
}

.menu-item.active {
  background: linear-gradient(135deg, #75aadb, #a6d4ff);
  color: #0a1a2b;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(0, 90, 160, 0.25);
}

.icon {
  font-size: 18px;
}
</style>
