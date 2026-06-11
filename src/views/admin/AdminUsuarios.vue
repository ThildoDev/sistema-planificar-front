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

