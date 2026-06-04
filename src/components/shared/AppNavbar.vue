<template>
  <header class="navbar">
    <div class="left">
      <h3>{{ user?.name }}</h3>
      <span class="role">{{ user?.role }}</span>
    </div>

    <button class="logout" @click="logout">Cerrar sesión</button>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import useAuth from '@/composables/useAuth'

const { user, logout } = useAuth()
</script>

<style scoped>
.navbar {
  height: 60px;
  background: white;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}
.role {
  font-size: 12px;
  color: #888;
}
.logout {
  background: #e74c3c;
  color: white;
  padding: 8px 14px;
  border-radius: 6px;
}
</style>
