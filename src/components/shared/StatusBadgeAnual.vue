<template>
  <span :class="['badge', statusClass]">{{ label }}</span>
</template>

<script setup>
defineProps({
  status: String
})

const statusClass = computed(() => {
  switch (status) {
    case 'aprobado': return 'success'
    case 'pendiente': return 'warning'
    case 'rechazado': return 'error'
    default: return 'neutral'
  }
})

const label = computed(() => {
  switch (status) {
    case 'aprobado': return 'Aprobado'
    case 'pendiente': return 'Pendiente'
    case 'rechazado': return 'Rechazado'
    default: return 'Sin estado'
  }
})
</script>

<style scoped>
.badge {
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 600;
  text-transform: capitalize;
}
.success { background: #2ecc71; color: white; }
.warning { background: #f1c40f; color: black; }
.error { background: #e74c3c; color: white; }
.neutral { background: #bdc3c7; color: black; }
</style>
