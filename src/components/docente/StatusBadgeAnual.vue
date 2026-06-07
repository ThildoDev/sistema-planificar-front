<template>
  <span class="status-badge" :style="badgeStyle">
    <span class="badge-dot" :style="{ background: config.color }"></span>
    {{ config.label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  estado: {
    type: String,
    required: true
  }
})

const statusMap = {
  'Aprobado':   { color: '#16a34a', bg: '#dcfce7', border: '#bbf7d0', label: 'Aprobado' },
  'Pendiente':  { color: '#d97706', bg: '#fef3c7', border: '#fde68a', label: 'Pendiente' },
  'A Corregir': { color: '#dc2626', bg: '#fee2e2', border: '#fecaca', label: 'A Corregir' },
  'Rechazado':  { color: '#7c3aed', bg: '#ede9fe', border: '#ddd6fe', label: 'Rechazado' }
}

const config = computed(() => statusMap[props.estado] || { color: '#64748b', bg: '#f1f5f9', border: '#e2e8f0', label: props.estado })

const badgeStyle = computed(() => ({
  background: config.value.bg,
  color: config.value.color,
  border: `1px solid ${config.value.border}`
}))
</script>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
</style>
