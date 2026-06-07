<template>
  <div class="layout-shell">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-brand">
        <div class="brand-icon">
          <BookOpen :size="22" />
        </div>
        <div class="brand-text">
          <span class="brand-name">PlanificAR</span>
          <span class="brand-sub">Gestión Pedagógica</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section-label">Principal</div>

        <RouterLink to="/docente/dashboard" class="nav-item" active-class="nav-item--active">
          <LayoutDashboard :size="18" />
          <span>Panel</span>
        </RouterLink>

        <RouterLink
          v-if="authStore.userRole === 'docente'"
          to="/docente/crear"
          class="nav-item"
          active-class="nav-item--active"
        >
          <FilePlus :size="18" />
          <span>Nueva Planificación</span>
        </RouterLink>

        <RouterLink
          v-if="authStore.userRole === 'docente'"
          to="/docente/mis-planificaciones"
          class="nav-item"
          active-class="nav-item--active"
        >
          <FolderOpen :size="18" />
          <span>Mis Planificaciones</span>
        </RouterLink>

        <template v-if="authStore.userRole === 'directivo'">
          <div class="nav-section-label">Dirección</div>
          <RouterLink to="/directivo/revision" class="nav-item" active-class="nav-item--active">
            <ClipboardCheck :size="18" />
            <span>Revisión</span>
          </RouterLink>
          <RouterLink to="/directivo/reportes" class="nav-item" active-class="nav-item--active">
            <BarChart2 :size="18" />
            <span>Reportes</span>
          </RouterLink>
        </template>
      </nav>

      <div class="sidebar-footer">
        <div class="sidebar-footer-item">
          <Settings :size="16" />
          <span>Configuración</span>
        </div>
        <div class="sidebar-footer-item sidebar-footer-item--danger" @click="handleLogout">
          <LogOut :size="16" />
          <span>Cerrar Sesión</span>
        </div>
      </div>
    </aside>

    <!-- Main content area -->
    <div class="layout-main">
      <!-- Header -->
      <header class="header">
        <div class="header-left">
          <h1 class="header-title">{{ pageTitle }}</h1>
          <div class="header-breadcrumb">
            <span>PlanificAR</span>
            <ChevronRight :size="14" />
            <span>{{ pageTitle }}</span>
          </div>
        </div>

        <div class="header-right">
          <button class="header-icon-btn" title="Notificaciones">
            <Bell :size="18" />
            <span class="notif-dot"></span>
          </button>

          <div class="user-identity">
            <div class="user-info">
              <span class="user-name">{{ authStore.user?.name }}</span>
              <span class="user-email">{{ authStore.user?.email }}</span>
            </div>
            <div class="user-avatar">
              {{ userInitials }}
            </div>
          </div>
        </div>
      </header>

      <!-- Dynamic view area -->
      <main class="content-area">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  BookOpen, LayoutDashboard, FilePlus, FolderOpen, ClipboardCheck,
  BarChart2, Settings, LogOut, Bell, ChevronRight
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const pageTitle = computed(() => route.meta?.title || 'Panel Principal')

const userInitials = computed(() => {
  const name = authStore.user?.name || ''
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
})

function handleLogout() {
  router.push('/login')
}
</script>

<style scoped>
:root {
  --color-bg: #f8fafc;
  --color-surface: #ffffff;
  --color-border: #e2e8f0;
  --color-primary: #1e3a5f;
  --color-primary-light: #2d5282;
  --color-primary-muted: #e8f0fe;
  --color-accent: #3b82f6;
  --color-text-main: #1a202c;
  --color-text-secondary: #64748b;
  --color-text-muted: #94a3b8;
  --sidebar-width: 256px;
  --header-height: 64px;
  --radius-md: 10px;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04);
}

.layout-shell {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  min-height: 100vh;
  background: var(--color-bg);
  font-family: 'Lato', 'Segoe UI', sans-serif;
}

/* ── Sidebar ─────────────────────────────── */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: var(--sidebar-width);
  height: 100vh;
  background: var(--color-primary);
  display: flex;
  flex-direction: column;
  z-index: 100;
  box-shadow: 4px 0 20px rgba(0,0,0,0.12);
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 1.25rem 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.brand-icon {
  width: 40px;
  height: 40px;
  background: rgba(255,255,255,0.15);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  flex-shrink: 0;
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 1.05rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.02em;
}

.brand-sub {
  font-size: 0.68rem;
  color: rgba(255,255,255,0.5);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  overflow-y: auto;
}

.nav-section-label {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.35);
  padding: 0.75rem 0.5rem 0.35rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
  color: rgba(255,255,255,0.7);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background 0.15s, color 0.15s;
  cursor: pointer;
}

.nav-item:hover {
  background: rgba(255,255,255,0.1);
  color: #ffffff;
}

.nav-item--active {
  background: rgba(255,255,255,0.18);
  color: #ffffff;
  font-weight: 600;
}

.sidebar-footer {
  padding: 0.75rem;
  border-top: 1px solid rgba(255,255,255,0.1);
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.sidebar-footer-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.55rem 0.75rem;
  border-radius: 8px;
  color: rgba(255,255,255,0.55);
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.sidebar-footer-item:hover {
  background: rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.9);
}

.sidebar-footer-item--danger:hover {
  background: rgba(239,68,68,0.2);
  color: #fca5a5;
}

/* ── Layout Main ─────────────────────────── */
.layout-main {
  margin-left: var(--sidebar-width);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* ── Header ─────────────────────────────── */
.header {
  position: sticky;
  top: 0;
  height: var(--header-height);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.75rem;
  z-index: 50;
  box-shadow: var(--shadow-sm);
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.header-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-text-main);
  margin: 0;
  line-height: 1.2;
}

.header-breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon-btn {
  position: relative;
  width: 36px;
  height: 36px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  transition: background 0.15s, color 0.15s;
}

.header-icon-btn:hover {
  background: var(--color-bg);
  color: var(--color-primary);
}

.notif-dot {
  position: absolute;
  top: 7px;
  right: 7px;
  width: 7px;
  height: 7px;
  background: #ef4444;
  border-radius: 50%;
  border: 1.5px solid white;
}

.user-identity {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.05rem;
}

.user-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-main);
  line-height: 1.2;
}

.user-email {
  font-size: 0.72rem;
  color: var(--color-text-muted);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  flex-shrink: 0;
}

/* ── Content Area ─────────────────────────── */
.content-area {
  flex: 1;
  padding: 1.75rem;
  overflow-y: auto;
}
</style>
