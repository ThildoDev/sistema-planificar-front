<template>
  <div class="dashboard-page">
    <div class="page-header">
      <h1 class="page-title">Panel de Administración</h1>
      <p class="page-subtitle">Gestión de usuarios y roles del sistema</p>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-grid">
      <div class="kpi-card kpi-blue">
        <div class="kpi-icon"><Users :size="24" /></div>
        <div class="kpi-info">
          <span class="kpi-value">{{ totalUsuarios }}</span>
          <span class="kpi-label">Usuarios Totales</span>
        </div>
      </div>
      <div class="kpi-card kpi-green">
        <div class="kpi-icon"><GraduationCap :size="24" /></div>
        <div class="kpi-info">
          <span class="kpi-value">{{ totalDocentes }}</span>
          <span class="kpi-label">Docentes</span>
        </div>
      </div>
      <div class="kpi-card kpi-purple">
        <div class="kpi-icon"><UserCheck :size="24" /></div>
        <div class="kpi-info">
          <span class="kpi-value">{{ totalDirectores }}</span>
          <span class="kpi-label">Directores</span>
        </div>
      </div>
    </div>

    <!-- Feedback global -->
    <Transition name="fade">
      <div v-if="successMsg" class="success-banner">
        <CheckCircle2 :size="18" /> <span>{{ successMsg }}</span>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="error && !loadingAction" class="error-banner">
        <AlertCircle :size="18" /> <span>{{ error }}</span>
      </div>
    </Transition>

    <!-- Sección Crear Usuario -->
    <CreateUserForm @created="onUsuarioCreado" />

    <!-- Sección Tabla de Usuarios -->
    <div class="section-header">
      <h2 class="section-title"><Users :size="18" /> Gestión de Usuarios</h2>
      <button class="btn-refresh" @click="fetchUsuarios()" :disabled="loading">
        <RefreshCw :size="15" :class="{ spinning: loading }" />
        Actualizar
      </button>
    </div>

    <UsuariosTable @asignar-rol="abrirRolModal" @reset-password="abrirResetModal" />

    <!-- Modales -->
    <AsignarRolModal
      v-model="showRolModal"
      :usuario="usuarioSeleccionado"
      @rol-asignado="onRolAsignado"
    />

    <ResetPasswordModal
      v-model="showResetModal"
      :usuario="usuarioSeleccionado"
      @password-reseteada="onPasswordReset"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  Users,
  GraduationCap,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-vue-next'

import CreateUserForm from '@/components/admin/CreateUserForm.vue'
import UsuariosTable from '@/components/admin/UsuariosTable.vue'
import AsignarRolModal from '@/components/admin/AsignarRolModal.vue'
import ResetPasswordModal from '@/components/admin/ResetPasswordModal.vue'
import { useUsuarios } from '@/composables/useUsuarios'

const {
  fetchUsuarios,
  loading,
  loadingAction,
  error,
  successMsg,
  totalUsuarios,
  totalDocentes,
  totalDirectores,
} = useUsuarios()

const showRolModal = ref(false)
const showResetModal = ref(false)
const usuarioSeleccionado = ref(null)

const abrirRolModal = (u) => {
  usuarioSeleccionado.value = u
  showRolModal.value = true
}
const abrirResetModal = (u) => {
  usuarioSeleccionado.value = u
  showResetModal.value = true
}

const onUsuarioCreado = () => fetchUsuarios()
const onRolAsignado = () => fetchUsuarios()
const onPasswordReset = () => {}

onMounted(() => fetchUsuarios())
</script>

