<template>
  <div class="usuarios-page">
    <!-- ── Encabezado ──────────────────────────────────────────── -->
    <div class="page-header">
      <div class="header-text">
        <h1 class="page-title">Gestión de Usuarios</h1>
        <p class="page-subtitle">
          Administrá los usuarios del sistema, asigná roles y gestioná el acceso.
        </p>
      </div>
      <button class="btn-nuevo" @click="scrollToForm">
        <UserPlus :size="16" />
        Nuevo Usuario
      </button>
    </div>

    <!-- ── Tarjetas de estadísticas ───────────────────────────── -->
    <div class="stats-grid">
      <div class="stat-card stat-total">
        <div class="stat-icon"><Users :size="20" /></div>
        <div class="stat-info">
          <span class="stat-number">{{ totalUsuarios }}</span>
          <span class="stat-label">Total</span>
        </div>
      </div>

      <div class="stat-card stat-admin">
        <div class="stat-icon"><ShieldCheck :size="20" /></div>
        <div class="stat-info">
          <span class="stat-number">{{ contarPorRol('admin') }}</span>
          <span class="stat-label">Admins</span>
        </div>
      </div>

      <div class="stat-card stat-director">
        <div class="stat-icon"><Briefcase :size="20" /></div>
        <div class="stat-info">
          <span class="stat-number">{{ contarPorRol('director') }}</span>
          <span class="stat-label">Directores</span>
        </div>
      </div>

      <div class="stat-card stat-docente">
        <div class="stat-icon"><GraduationCap :size="20" /></div>
        <div class="stat-info">
          <span class="stat-number">{{ contarPorRol('docente') }}</span>
          <span class="stat-label">Docentes</span>
        </div>
      </div>

      <div class="stat-card stat-user">
        <div class="stat-icon"><User :size="20" /></div>
        <div class="stat-info">
          <span class="stat-number">{{ contarPorRol('user') }}</span>
          <span class="stat-label">Usuarios</span>
        </div>
      </div>
    </div>

    <!-- ── Mensajes de feedback ────────────────────────────────── -->
    <Transition name="fade">
      <div v-if="successMsg" class="banner banner-success">
        <CheckCircle2 :size="18" />
        <span>{{ successMsg }}</span>
        <button class="banner-close" @click="clearMessages">
          <X :size="14" />
        </button>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="error && !loadingAction" class="banner banner-error">
        <AlertCircle :size="18" />
        <span>{{ error }}</span>
        <button class="banner-close" @click="clearMessages">
          <X :size="14" />
        </button>
      </div>
    </Transition>

    <!-- ── Sección: Crear Usuario (colapsable) ─────────────────── -->
    <div ref="formRef" class="section-card">
      <div class="section-header">
        <h2 class="section-title">
          <UserPlus :size="18" />
          Crear Nuevo Usuario
        </h2>
        <button class="btn-toggle" @click="mostrarForm = !mostrarForm">
          <ChevronDown
            :size="18"
            :style="{
              transform: mostrarForm ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
            }"
          />
          {{ mostrarForm ? 'Ocultar' : 'Mostrar' }}
        </button>
      </div>

      <Transition name="slide-down">
        <div v-if="mostrarForm" class="form-wrapper">
          <CreateUserForm @created="onUsuarioCreado" />
        </div>
      </Transition>
    </div>

    <!-- ── Sección: Tabla de Usuarios ─────────────────────────── -->
    <div class="section-card">
      <div class="section-header">
        <h2 class="section-title">
          <Users :size="18" />
          Lista de Usuarios
          <span class="count-badge">{{ usuariosFiltrados.length }}</span>
        </h2>
        <button class="btn-refresh" @click="recargar" :disabled="loading">
          <RefreshCw :size="14" :class="{ spinning: loading }" />
          Actualizar
        </button>
      </div>

      <!-- Filtros -->
      <div class="filters-bar">
        <div class="search-wrapper">
          <Search :size="15" class="search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="Buscar por nombre o email..."
          />
          <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''">
            <X :size="13" />
          </button>
        </div>

        <div class="role-filters">
          <button
            v-for="op in opcionesFiltro"
            :key="op.value"
            class="filter-btn"
            :class="{ 'filter-btn-active': filterRole === op.value }"
            @click="filterRole = op.value"
          >
            {{ op.label }}
            <span class="filter-count">
              {{ op.value === 'todos' ? totalUsuarios : contarPorRol(op.value) }}
            </span>
          </button>
        </div>
      </div>

      <!-- Tabla -->
      <UsuariosTable @asignar-rol="abrirModalRol" @reset-password="abrirModalReset" />
    </div>

    <!-- ── Modales ─────────────────────────────────────────────── -->
    <AsignarRolModal
      v-model="showModalRol"
      :usuario="usuarioSeleccionado"
      @rol-asignado="onRolAsignado"
    />

    <ResetPasswordModal
      v-model="showModalReset"
      :usuario="usuarioSeleccionado"
      @password-reseteada="onPasswordReseteada"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  UserPlus,
  Users,
  User,
  ShieldCheck,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  Search,
  ChevronDown,
} from 'lucide-vue-next'

// ── Componentes que ya creaste en Issue #4 ─────────────────────────
import CreateUserForm from '@/components/admin/CreateUserForm.vue'
import UsuariosTable from '@/components/admin/UsuariosTable.vue'
import AsignarRolModal from '@/components/admin/AsignarRolModal.vue'
import ResetPasswordModal from '@/components/admin/ResetPasswordModal.vue'

// ── Composable que ya creaste en Issue #4 ──────────────────────────
import { useUsuarios } from '@/composables/useUsuarios'

// ── Extraer todo lo necesario del composable ───────────────────────
const {
  usuarios,
  usuariosFiltrados,
  totalUsuarios,
  loading,
  loadingAction,
  error,
  successMsg,
  searchQuery,
  filterRole,
  fetchUsuarios,
  clearMessages,
} = useUsuarios()

// ── Estado local (solo de esta vista) ─────────────────────────────
const mostrarForm = ref(true) // controla si el form está visible
const showModalRol = ref(false) // controla el modal de roles
const showModalReset = ref(false) // controla el modal de contraseña
const usuarioSeleccionado = ref(null) // usuario sobre el que se actúa
const formRef = ref(null) // referencia al DOM del formulario

// ── Opciones de los botones de filtro ─────────────────────────────
const opcionesFiltro = [
  { value: 'todos', label: 'Todos' },
  { value: 'admin', label: 'Admin' },
  { value: 'director', label: 'Director' },
  { value: 'docente', label: 'Docente' },
  { value: 'user', label: 'Usuario' },
]

// ── Función para contar usuarios por rol ───────────────────────────
const contarPorRol = (rol) => usuarios.value.filter((u) => u.role === rol).length

// ── Recarga la lista desde la API ──────────────────────────────────
const recargar = async () => {
  clearMessages()
  await fetchUsuarios()
}

// ── Se ejecuta cuando CreateUserForm emite 'created' ───────────────
const onUsuarioCreado = async () => {
  mostrarForm.value = false // colapsa el formulario
  await fetchUsuarios() // recarga la tabla
}

// ── Abre el modal de cambio de rol ─────────────────────────────────
const abrirModalRol = (usuario) => {
  usuarioSeleccionado.value = usuario
  showModalRol.value = true
}

// ── Abre el modal de blanqueo de contraseña ────────────────────────
const abrirModalReset = (usuario) => {
  usuarioSeleccionado.value = usuario
  showModalReset.value = true
}

// ── Callback: cuando el rol fue cambiado exitosamente ──────────────
const onRolAsignado = async () => {
  await fetchUsuarios()
}

// ── Callback: cuando la contraseña fue reseteada ───────────────────
const onPasswordReseteada = () => {
  // El store ya muestra el successMsg automáticamente
}

// ── Scroll suave hasta el formulario ──────────────────────────────
const scrollToForm = () => {
  mostrarForm.value = true
  setTimeout(() => {
    formRef.value?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }, 100)
}

// ── Al montar la vista, cargar los usuarios ────────────────────────
onMounted(async () => {
  await fetchUsuarios()
})
</script>

<style scoped>
/* ── Contenedor general ─────────────────────────────────────────── */
.usuarios-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* ── Encabezado ─────────────────────────────────────────────────── */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 0.25rem;
}

.page-subtitle {
  font-size: 0.875rem;
  color: #64748b;
}

.btn-nuevo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;
}

.btn-nuevo:hover {
  background: #1d4ed8;
}

/* ── Estadísticas ───────────────────────────────────────────────── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 0.875rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1rem 1.125rem;
  border-radius: 12px;
  border: 1px solid transparent;
}

.stat-total {
  background: #f8fafc;
  border-color: #e2e8f0;
}
.stat-admin {
  background: #fffbeb;
  border-color: #fde68a;
}
.stat-director {
  background: #faf5ff;
  border-color: #e9d5ff;
}
.stat-docente {
  background: #f0fdf4;
  border-color: #bbf7d0;
}
.stat-user {
  background: #f0f9ff;
  border-color: #bae6fd;
}

.stat-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-total .stat-icon {
  background: #e2e8f0;
  color: #475569;
}
.stat-admin .stat-icon {
  background: #fef3c7;
  color: #92400e;
}
.stat-director .stat-icon {
  background: #ede9fe;
  color: #5b21b6;
}
.stat-docente .stat-icon {
  background: #dcfce7;
  color: #15803d;
}
.stat-user .stat-icon {
  background: #e0f2fe;
  color: #0369a1;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
  line-height: 1;
}

.stat-label {
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.2rem;
}

/* ── Banners de feedback ────────────────────────────────────────── */
.banner {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.875rem 1rem;
  border-radius: 10px;
  font-size: 0.875rem;
}

.banner-success {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #15803d;
}

.banner-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
}

.banner-close {
  margin-left: auto;
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  opacity: 0.6;
  display: flex;
  align-items: center;
  padding: 0.2rem;
  border-radius: 4px;
}

.banner-close:hover {
  opacity: 1;
}

/* ── Cards de sección ───────────────────────────────────────────── */
.section-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 22px;
  padding: 0 0.5rem;
  background: #dbeafe;
  color: #1d4ed8;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
}

.btn-toggle {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.4rem 0.875rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  font-size: 0.8125rem;
  color: #475569;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-toggle:hover {
  background: #e2e8f0;
}

.form-wrapper {
  padding: 1.5rem;
}

.btn-refresh {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.4rem 0.875rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  font-size: 0.8125rem;
  color: #475569;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-refresh:hover:not(:disabled) {
  background: #e2e8f0;
}
.btn-refresh:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ── Filtros ────────────────────────────────────────────────────── */
.filters-bar {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  max-width: 380px;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  color: #9ca3af;
  pointer-events: none;
}

.search-input {
  width: 100%;
  height: 38px;
  padding: 0 2.25rem 0 2.25rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #374151;
  background: #f8fafc;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #2563eb;
  background: #fff;
}

.search-clear {
  position: absolute;
  right: 0.625rem;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0.2rem;
}

.search-clear:hover {
  color: #374151;
}

.role-filters {
  display: flex;
  gap: 0.375rem;
  flex-wrap: wrap;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  border: 1.5px solid #e2e8f0;
  background: #f8fafc;
  font-size: 0.8125rem;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: #2563eb;
  color: #2563eb;
}

.filter-btn-active {
  background: #2563eb;
  border-color: #2563eb;
  color: #fff;
  font-weight: 600;
}

.filter-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 0.3rem;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 700;
  background: rgba(0, 0, 0, 0.1);
}

.filter-btn-active .filter-count {
  background: rgba(255, 255, 255, 0.25);
}

/* ── Transiciones ───────────────────────────────────────────────── */
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  max-height: 0;
}
.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  max-height: 800px;
}

/* ── Spinner ────────────────────────────────────────────────────── */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.spinning {
  animation: spin 0.8s linear infinite;
}

/* ── Responsive ─────────────────────────────────────────────────── */
@media (max-width: 640px) {
  .page-header {
    flex-direction: column;
  }
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
