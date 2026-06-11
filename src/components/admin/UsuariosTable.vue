<template>
  <div class="table-card">
    <!-- Toolbar de filtros -->
    <div class="table-toolbar">
      <div class="filter-group">
        <label class="filter-label">Rol:</label>
        <select v-model="filterRole" class="filter-select">
          <option value="todos">Todos</option>
          <option value="admin">Admin</option>
          <option value="director">Director</option>
          <option value="docente">Docente</option>
          <option value="user">Usuario</option>
        </select>
      </div>
      <div class="search-wrapper">
        <Search :size="16" class="search-icon" />
        <input
          v-model="searchQuery"
          type="text"
          class="search-input"
          placeholder="Buscar por nombre o email..."
        />
      </div>
    </div>

    <!-- Estado de carga -->
    <div v-if="loading" class="table-loading">
      <Loader2 :size="28" class="spinning" />
      <span>Cargando usuarios...</span>
    </div>

    <!-- Sin resultados -->
    <div v-else-if="usuariosFiltrados.length === 0" class="empty-state">
      <Users :size="40" color="#cbd5e1" />
      <p>No se encontraron usuarios.</p>
    </div>

    <!-- Tabla -->
    <div v-else class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Usuario</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(usuario, index) in usuariosFiltrados" :key="usuario.id">
            <td class="td-index">{{ index + 1 }}</td>
            <td class="td-name">
              <div class="user-avatar">
                {{ getInitials(usuario.name) }}
              </div>
              <span>{{ usuario.name }}</span>
            </td>
            <td class="td-email">{{ usuario.email }}</td>
            <td>
              <span class="role-badge" :class="`role-${usuario.role}`">
                {{ rolLabel(usuario.role) }}
              </span>
            </td>
            <td class="td-actions">
              <button
                class="action-btn action-role"
                title="Cambiar rol"
                @click="$emit('asignar-rol', usuario)"
              >
                <Shield :size="15" />
              </button>
              <button
                class="action-btn action-reset"
                title="Blanquear contraseña"
                @click="$emit('reset-password', usuario)"
              >
                <KeyRound :size="15" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="!loading && usuariosFiltrados.length > 0" class="table-footer">
      Mostrando {{ usuariosFiltrados.length }} de {{ totalUsuarios }} usuarios
    </div>
  </div>
</template>

<script setup>
import { Search, Loader2, Users, Shield, KeyRound } from 'lucide-vue-next'
import { useUsuarios } from '@/composables/useUsuarios'

defineEmits(['asignar-rol', 'reset-password'])

const { usuariosFiltrados, totalUsuarios, loading, searchQuery, filterRole } = useUsuarios()

const rolLabel = (role) =>
  ({
    admin: 'Admin',
    director: 'Director',
    docente: 'Docente',
    user: 'Usuario',
  })[role] || role

const getInitials = (name = '') =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
</script>

<!-- <style scoped>
.table-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.table-toolbar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f1f5f9;
  flex-wrap: wrap;
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
}

.filter-select {
  height: 36px;
  padding: 0 0.75rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.8125rem;
  color: #374151;
  background: #f8fafc;
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
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  pointer-events: none;
}

.search-input {
  width: 100%;
  height: 36px;
  padding: 0 0.75rem 0 2.25rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.8125rem;
  color: #374151;
  background: #f8fafc;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #2563eb;
}

.table-loading,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 3rem;
  color: #94a3b8;
  font-size: 0.875rem;
}

.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.data-table thead tr {
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
}

.data-table th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
  white-space: nowrap;
}

.data-table td {
  padding: 0.875rem 1rem;
  border-bottom: 1px solid #f1f5f9;
  color: #374151;
  vertical-align: middle;
}

.data-table tbody tr:hover {
  background: #fafafa;
}
.data-table tbody tr:last-child td {
  border-bottom: none;
}

.td-index {
  color: #94a3b8;
  font-size: 0.8125rem;
  width: 48px;
}

.td-name {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-weight: 600;
  color: #0f172a;
}

.user-avatar {
  width: 32px;
  height: 32px;
  background: #dbeafe;
  color: #1d4ed8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
}

.td-email {
  color: #64748b;
  font-size: 0.8125rem;
}

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

.role-admin {
  background: #fef3c7;
  color: #92400e;
}
.role-director {
  background: #ede9fe;
  color: #5b21b6;
}
.role-docente {
  background: #dcfce7;
  color: #14532d;
}
.role-user {
  background: #f1f5f9;
  color: #475569;
}

.td-actions {
  display: flex;
  gap: 0.375rem;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: #64748b;
}

.action-role:hover {
  background: #ede9fe;
  border-color: #a78bfa;
  color: #5b21b6;
}
.action-reset:hover {
  background: #fef3c7;
  border-color: #fcd34d;
  color: #92400e;
}

.table-footer {
  padding: 0.75rem 1.25rem;
  font-size: 0.8125rem;
  color: #94a3b8;
  border-top: 1px solid #f1f5f9;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.spinning {
  animation: spin 0.8s linear infinite;
}
</style> -->
