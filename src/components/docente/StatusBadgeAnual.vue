<template>
  <span class="role-badge" :class="badgeClass">
    {{ estadoLabel }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  estado: { type: String, required: true }
})

const badgeClass = computed(() => {
  return {
    'role-admin': props.estado === 'Aprobado',       // Color Ámbar/Dorado
    'role-docente': props.estado === 'Aprobado',     // Color Verde (Recomendado para aprobado)
    'role-director': props.estado === 'Observado',   // Color Púrpura
    'role-user': props.estado === 'Pendiente'        // Color Gris/Slate
  }
})

// Mapea los strings crudos de la BD a texto legible
const estadoLabel = computed(() => {
  return ({
    'Aprobado': 'Aprobado',
    'Pendiente': 'Pendiente',
    'Observado': 'Observado',
    'A corregir': 'A Corregir'
  })[props.estado] || props.estado
})
</script>

<style scoped>
/* Reutiliza exactamente tus clases de badges del proyecto */
.role-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.role-admin { background: #fef3c7; color: #92400e; }
.role-director { background: #ede9fe; color: #5b21b6; }
.role-docente { background: #dcfce7; color: #14532d; }
.role-user { background: #f1f5f9; color: #475569; }
</style>
