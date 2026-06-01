<template>
  <div class="filtros-bar">
    <div class="filter-group">
      <label class="filter-label">Estado:</label>
      <select v-model="filtroEstado" class="filter-select">
        <option value="todos">Todos</option>
        <option value="Pendiente">Pendiente</option>
        <option value="Revisado">En Revisión</option>
        <option value="Aprobado">Aprobada</option>
        <option value="Rechazado">Con Observaciones</option>
      </select>
    </div>
    <div class="search-wrapper">
      <Search :size="15" class="search-icon" />
      <input
        v-model="filtroSearch"
        type="text"
        class="search-input"
        placeholder="Buscar por docente o área..."
      />
    </div>
    <button class="btn-reset" @click="resetFiltros"><X :size="14" /> Limpiar</button>
  </div>
</template>

<script setup>
import { Search, X } from 'lucide-vue-next'
import { useRevision } from '@/composables/useRevision'

const { filtroEstado, filtroSearch } = useRevision()

const resetFiltros = () => {
  filtroEstado.value = 'todos'
  filtroSearch.value = ''
}
</script>

<style scoped>
.filtros-bar {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  flex-wrap: wrap;
  padding: 1rem 1.25rem;
  background: #f8fafc;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.filter-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #64748b;
  white-space: nowrap;
}

.filter-select {
  height: 36px;
  padding: 0 0.75rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.8125rem;
  color: #374151;
  background: #fff;
  outline: none;
  cursor: pointer;
}

.search-wrapper {
  position: relative;
  flex: 1;
  min-width: 200px;
}
.search-icon {
  position: absolute;
  left: 0.625rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  pointer-events: none;
}
.search-input {
  width: 100%;
  height: 36px;
  padding: 0 0.75rem 0 2rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.8125rem;
  background: #fff;
  outline: none;
  transition: border-color 0.2s;
}
.search-input:focus {
  border-color: #2563eb;
}

.btn-reset {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.4rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #fff;
  font-size: 0.8125rem;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-reset:hover {
  background: #f1f5f9;
}
</style>
