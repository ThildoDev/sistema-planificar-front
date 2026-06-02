<template>
  <div class="usuario-info-card">
    <div class="usuario-avatar">{{ getInitials(authStore.user?.name) }}</div>
    <div class="usuario-detalles">
      <p class="usuario-name">{{ authStore.user?.name || 'Docente' }}</p>
      <p class="usuario-email">{{ authStore.user?.email || 'S/D' }}</p>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const getInitials = (name = '') =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
</script>

<style scoped>
.usuario-info-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}
.usuario-avatar {
  width: 36px;
  height: 36px;
  background: #dbeafe;
  color: #1d4ed8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.8125rem;
  flex-shrink: 0;
}
.usuario-detalles {
  display: flex;
  flex-direction: column;
}
.usuario-name {
  font-weight: 600;
  color: #0f172a;
  font-size: 0.875rem;
  line-height: 1.2;
}
.usuario-email {
  font-size: 0.75rem;
  color: #64748b;
}
</style>
