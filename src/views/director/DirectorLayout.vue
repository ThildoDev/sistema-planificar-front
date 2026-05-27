<template>
  <div class="layout-wrapper">
    <aside class="sidebar">
      <div class="sidebar-brand">
        <h2>SGE Pedagógico</h2>
        <span class="badge">Director</span>
      </div>

      <nav class="sidebar-nav">
        <RouterLink to="/director/dashboard" class="nav-item" active-class="active">
          <LayoutDashboardIcon :size="20" />
          <span>Módulo Control</span>
        </RouterLink>

        <RouterLink to="/director/revisiones" class="nav-item" active-class="active">
          <ClipboardCheckIcon :size="20" />
          <span>Revisión Cargas</span>
        </RouterLink>
      </nav>
    </aside>

    <div class="content-area">
      <header class="navbar">
        <div class="navbar-left">
          <SchoolIcon :size="20" class="icon-school" />
          <span>Escuela de Educación Técnica N° 1 - Región IV</span>
        </div>
        <div class="navbar-right">
          <span class="user-name">Lic. María Sosa (Directora)</span>
          <button @click="logout" class="logout-btn">
            <LogOutIcon :size="18" />
          </button>
        </div>
      </header>

      <main class="view-container">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script>
import {
  LayoutDashboard as LayoutDashboardIcon,
  ClipboardCheck as ClipboardCheckIcon,
  School as SchoolIcon,
  LogOut as LogOutIcon,
} from 'lucide-vue-next'

export default {
  name: 'DirectorLayout',
  components: { LayoutDashboardIcon, ClipboardCheckIcon, SchoolIcon, LogOutIcon },
  methods: {
    logout() {
      localStorage.removeItem('user_role')
      this.$router.push('/login')
    },
  },
}
</script>

<style scoped>
/* Reutiliza los estilos estructurales bases del docente */
.layout-wrapper {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
.sidebar {
  width: 260px;
  background-color: #061f17;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
}
.sidebar-brand h2 {
  font-size: 1.15rem;
  font-weight: 700;
}
.badge {
  display: inline-block;
  margin-top: 4px;
  font-size: 0.75rem;
  background-color: #059669;
  padding: 2px 8px;
  border-radius: 4px;
}
.sidebar-nav {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #a7f3d0;
  opacity: 0.7;
  text-decoration: none;
  padding: 12px;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: all 0.2s;
}
.nav-item:hover,
.nav-item.active {
  opacity: 1;
  color: white;
  background-color: #0f372a;
}
.nav-item.active {
  background-color: #059669;
}
.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f8fafc;
}
.navbar {
  height: 64px;
  background-color: white;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}
.navbar-left {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #334155;
}
.icon-school {
  color: #64748b;
}
.navbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}
.user-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e293b;
}
.logout-btn {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
}
.logout-btn:hover {
  color: #ef4444;
  background-color: #fef2f2;
}
.view-container {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}
</style>
