<!-- src/components/director/FiltrosPlanificacion.vue -->
<template>
  <div class="filtros-panel">
    <div class="filtros-header">
      <h3 class="filtros-titulo">
        <Filter class="filtros-icon" />
        Filtros
      </h3>
      <button v-if="hayFiltrosActivos" class="btn-limpiar" @click="limpiar">
        <X class="btn-icon" />
        Limpiar filtros
      </button>
    </div>

    <div class="filtros-grid">
      <!-- Búsqueda por docente -->
      <div class="filtro-grupo">
        <label class="filtro-label" for="f-docente">Docente</label>
        <input
          id="f-docente"
          v-model="form.docente"
          type="text"
          class="filtro-input"
          placeholder="Nombre o apellido..."
          @input="emitirCambio"
        />
      </div>

      <!-- Área -->
      <div class="filtro-grupo">
        <label class="filtro-label" for="f-area">Área</label>
        <select id="f-area" v-model="form.area" class="filtro-select" @change="emitirCambio">
          <option value="">Todas las áreas</option>
          <option v-for="area in areasDisponibles" :key="area" :value="area">
            {{ area }}
          </option>
        </select>
      </div>

      <!-- Tipo de planificación -->
      <div class="filtro-grupo">
        <label class="filtro-label" for="f-tipo">Tipo</label>
        <select id="f-tipo" v-model="form.tipo" class="filtro-select" @change="emitirCambio">
          <option value="">Todos los tipos</option>
          <option value="Anual">Anual</option>
          <option value="Trimestral">Trimestral</option>
        </select>
      </div>

      <!-- Estado -->
      <div class="filtro-grupo">
        <label class="filtro-label" for="f-estado">Estado</label>
        <select id="f-estado" v-model="form.estado" class="filtro-select" @change="emitirCambio">
          <option value="">Todos los estados</option>
          <option v-for="e in estados" :key="e" :value="e">{{ e }}</option>
        </select>
      </div>

      <!-- Fecha desde -->
      <div class="filtro-grupo">
        <label class="filtro-label" for="f-desde">Desde</label>
        <input
          id="f-desde"
          v-model="form.fecha_desde"
          type="date"
          class="filtro-input"
          @change="emitirCambio"
        />
      </div>

      <!-- Fecha hasta -->
      <div class="filtro-grupo">
        <label class="filtro-label" for="f-hasta">Hasta</label>
        <input
          id="f-hasta"
          v-model="form.fecha_hasta"
          type="date"
          class="filtro-input"
          @change="emitirCambio"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Filter, X } from 'lucide-vue-next'

const props = defineProps({
  /** Áreas disponibles (extraídas de las planificaciones cargadas) */
  areasDisponibles: {
    type: Array,
    default: () => [
      'Matemáticas',
      'Lengua y Literatura',
      'Ciencias Naturales',
      'Ciencias Sociales',
      'Educación Física',
      'Arte y Educación Musical',
    ],
  },
})

const emit = defineEmits(['cambio', 'limpiar'])

const estados = [
  'Pendiente',
  'En Proceso',
  'Revisado',
  'Aprobado',
  'Rechazado',
  'Archivado',
  'En Espera',
  'Finalizado',
]

const form = ref({
  docente: '',
  area: '',
  tipo: '',
  estado: '',
  fecha_desde: '',
  fecha_hasta: '',
})

const hayFiltrosActivos = computed(() => Object.values(form.value).some((v) => v !== ''))

function emitirCambio() {
  // Eliminar claves vacías antes de emitir
  const filtrosLimpios = Object.fromEntries(Object.entries(form.value).filter(([, v]) => v !== ''))
  emit('cambio', filtrosLimpios)
}

function limpiar() {
  form.value = {
    docente: '',
    area: '',
    tipo: '',
    estado: '',
    fecha_desde: '',
    fecha_hasta: '',
  }
  emit('limpiar')
}
</script>

<style scoped>
.filtros-panel {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.filtros-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.filtros-titulo {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.filtros-icon {
  width: 1rem;
  height: 1rem;
  color: #6366f1;
}

.btn-limpiar {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.75rem;
  background: transparent;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-limpiar:hover {
  border-color: #ef4444;
  color: #ef4444;
}

.btn-icon {
  width: 0.875rem;
  height: 0.875rem;
}

.filtros-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.filtro-grupo {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.filtro-label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #475569;
}

.filtro-input,
.filtro-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #1e293b;
  background: #f8fafc;
  transition: border-color 0.15s;
  width: 100%;
}

.filtro-input:focus,
.filtro-select:focus {
  outline: none;
  border-color: #6366f1;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}
</style>
