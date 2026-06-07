<!-- src/components/shared/EstadoBadge.vue -->
<template>
  <span class="estado-badge" :class="`estado-badge--${claseEstado}`">
    {{ estado || '—' }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  estado: {
    type: String,
    default: null,
  },
})

const claseEstado = computed(() => {
  const mapa = {
    Pendiente: 'pendiente',
    'En Proceso': 'en-proceso',
    Revisado: 'revisado',
    Aprobado: 'aprobado',
    Rechazado: 'rechazado',
    Archivado: 'archivado',
    Cancelado: 'cancelado',
    'En Espera': 'en-espera',
    Finalizado: 'finalizado',
  }
  return mapa[props.estado] || 'default'
})
</script>

<style scoped>
.estado-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.estado-badge--pendiente {
  background: #fef9c3;
  color: #854d0e;
}
.estado-badge--en-proceso {
  background: #dbeafe;
  color: #1e40af;
}
.estado-badge--revisado {
  background: #e0e7ff;
  color: #3730a3;
}
.estado-badge--aprobado {
  background: #dcfce7;
  color: #166534;
}
.estado-badge--rechazado {
  background: #fee2e2;
  color: #991b1b;
}
.estado-badge--archivado {
  background: #f1f5f9;
  color: #475569;
}
.estado-badge--cancelado {
  background: #fce7f3;
  color: #9d174d;
}
.estado-badge--en-espera {
  background: #fff7ed;
  color: #9a3412;
}
.estado-badge--finalizado {
  background: #f0fdf4;
  color: #065f46;
}
.estado-badge--default {
  background: #f1f5f9;
  color: #64748b;
}
</style>
