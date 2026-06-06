<template>
  <header class="navbar-argentina fade-in">
    <div class="left">
      <div class="logo">
        <span class="flag">🇦🇷</span>
        <span class="title">PlanificAr</span>
      </div>
    </div>

    <div class="right">
      <ThemeSwitcher />
      <button class="btn-logout" @click="logout">Salir</button>
    </div>
  </header>
</template>

<script setup>
import ThemeSwitcher from '@/components/shared/ThemeSwitcher.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const logout = () => {
  auth.logout()
}
</script>

<style scoped>
.navbar-argentina {
  width: 100%;
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0 24px;
  background: var(--bg-soft);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);

  background-image: repeating-linear-gradient(
    90deg,
    rgba(117,170,219,0.12) 0px,
    rgba(117,170,219,0.12) 60px,
    rgba(255,255,255,0.12) 60px,
    rgba(255,255,255,0.12) 120px
  );

  border-bottom: 2px solid rgba(255,215,0,0.25);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.flag {
  font-size: 22px;
}

.title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: 0.5px;
}

.right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.btn-logout {
  padding: 8px 14px;
  border-radius: var(--radius);
  border: none;
  cursor: pointer;
  background: linear-gradient(135deg, #75aadb, #a6d4ff);
  color: #0a1a2b;
  font-weight: 600;
  transition: var(--transition);
}

.btn-logout:hover {
  background: linear-gradient(135deg, #a6d4ff, #75aadb);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 90, 160, 0.25);
}
</style>
