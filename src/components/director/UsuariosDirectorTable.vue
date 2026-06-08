<!-- src/components/director/UsuariosDirectorTable.vue -->
<template>
  <div class="tabla-wrapper">
    <!-- Cargando -->
    <div v-if="loading" class="estado-loading">
      <div class="spinner" />
      <span>Cargando usuarios...</span>
    </div>

    <!-- Sin usuarios -->
    <div v-else-if="!usuarios.length" class="estado-vacio">
      <Users class="vacio-icon" />
      <p class="vacio-texto">No se encontraron usuarios</p>
      <p class="vacio-sub">El director puede gestionar usuarios con rol "Docente" o "Usuario"</p>
    </div>

    <!-- Tabla -->
    <div v-else class="tabla-container">
      <table class="tabla">
        <thead>
          <tr>
            <th>#</th>
            <th>Usuario</th>
            <th>Email</th>
            <th>Rol actual</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="usuario in usuarios" :key="usuario.id" class="tabla-fila">
            <!-- ID -->
            <td class="celda-id">{{ usuario.id }}</td>

            <!-- Nombre completo -->
            <td class="celda-usuario">
              <div class="usuario-info">
                <!-- Avatar inicial -->
                <div class="avatar" :class="`avatar--${getRolColor(usuario.role)}`">
                  {{ getIniciales(usuario) }}
                </div>
                <div class="usuario-datos">
                  <span class="usuario-nombre">{{ getNombreCompleto(usuario) }}</span>
                  <span class="usuario-username">@{{ usuario.name }}</span>
                </div>
              </div>
            </td>

            <!-- Email -->
            <td class="celda-email">{{ usuario.email }}</td>

            <!-- Rol con badge -->
            <td class="celda-rol">
              <span class="rol-badge" :class="`rol-badge--${usuario.role}`">
                {{ getLabelRol(usuario.role) }}
              </span>
            </td>

            <!-- Acción -->
            <td class="celda-accion">
              <button
                class="btn-promover"
                :class="{ 'btn-promover--docente': usuario.role === 'docente' }"
                @click="$emit('promover', usuario)"
              >
                <ArrowUpDown class="btn-icon" />
                {{ usuario.role === 'docente' ? 'Cambiar rol' : 'Promover' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Contador -->
      <div class="tabla-footer">
        {{ usuarios.length }} usuario{{ usuarios.length !== 1 ? 's' : '' }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { Users, ArrowUpDown } from 'lucide-vue-next'

const props = defineProps({
  usuarios: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['promover'])

function getNombreCompleto(usuario) {
  if (usuario.persona?.apellidos && usuario.persona?.nombres) {
    return `${usuario.persona.apellidos}, ${usuario.persona.nombres}`
  }
  return usuario.name || '—'
}

function getIniciales(usuario) {
  const nombre = getNombreCompleto(usuario)
  const partes = nombre.split(/[\s,]+/).filter(Boolean)
  if (partes.length >= 2) {
    return `${partes[0][0]}${partes[1][0]}`.toUpperCase()
  }
  return nombre.slice(0, 2).toUpperCase()
}

function getLabelRol(role) {
  const labels = { admin: 'Admin', director: 'Director', docente: 'Docente', user: 'Usuario' }
  return labels[role] || role
}

function getRolColor(role) {
  const colores = { admin: 'red', director: 'purple', docente: 'blue', user: 'gray' }
  return colores[role] || 'gray'
}
</script>

<style scoped>
.tabla-wrapper {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

/* Estados */
.estado-loading,
.estado-vacio {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 3rem;
  color: #94a3b8;
}

.spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid #e2e8f0;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.vacio-icon {
  width: 2.5rem;
  height: 2.5rem;
  color: #cbd5e1;
}

.vacio-texto {
  font-size: 1rem;
  font-weight: 500;
  color: #475569;
  margin: 0;
}

.vacio-sub {
  font-size: 0.8125rem;
  color: #94a3b8;
  margin: 0;
  text-align: center;
  max-width: 30rem;
}

/* Tabla */
.tabla-container {
  overflow-x: auto;
}

.tabla {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.tabla thead tr {
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
}

.tabla th {
  padding: 0.875rem 1rem;
  text-align: left;
  font-weight: 600;
  color: #475569;
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.tabla-fila {
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.1s;
}

.tabla-fila:last-child {
  border-bottom: none;
}

.tabla-fila:hover {
  background: #f8fafc;
}

.tabla td {
  padding: 0.875rem 1rem;
  color: #1e293b;
  vertical-align: middle;
}

/* Celdas */
.celda-id {
  color: #94a3b8;
  font-size: 0.8125rem;
  font-variant-numeric: tabular-nums;
}

.usuario-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.avatar {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  flex-shrink: 0;
}

.avatar--blue {
  background: #dbeafe;
  color: #1d4ed8;
}
.avatar--gray {
  background: #f1f5f9;
  color: #475569;
}
.avatar--purple {
  background: #ede9fe;
  color: #7c3aed;
}
.avatar--red {
  background: #fee2e2;
  color: #991b1b;
}

.usuario-datos {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.usuario-nombre {
  font-weight: 500;
  color: #1e293b;
}

.usuario-username {
  font-size: 0.75rem;
  color: #94a3b8;
}

.celda-email {
  color: #64748b;
  font-size: 0.875rem;
}

/* Rol badge */
.rol-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.rol-badge--docente {
  background: #dbeafe;
  color: #1d4ed8;
}
.rol-badge--user {
  background: #f1f5f9;
  color: #475569;
}
.rol-badge--director {
  background: #ede9fe;
  color: #7c3aed;
}
.rol-badge--admin {
  background: #fee2e2;
  color: #991b1b;
}

/* Botones */
.btn-promover {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.4rem 0.875rem;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
}

.btn-promover:hover {
  background: #4f46e5;
}

.btn-promover--docente {
  background: #8b5cf6;
}

.btn-promover--docente:hover {
  background: #7c3aed;
}

.btn-icon {
  width: 0.875rem;
  height: 0.875rem;
}

/* Footer */
.tabla-footer {
  padding: 0.75rem 1rem;
  border-top: 1px solid #f1f5f9;
  font-size: 0.8125rem;
  color: #94a3b8;
  text-align: right;
}
</style>
