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

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.page-header {
  margin-bottom: 0.5rem;
}
.page-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
}
.page-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 0.25rem;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.kpi-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-radius: 12px;
  border: 1px solid transparent;
}

.kpi-blue {
  background: #eff6ff;
  border-color: #bfdbfe;
}
.kpi-green {
  background: #f0fdf4;
  border-color: #bbf7d0;
}
.kpi-purple {
  background: #faf5ff;
  border-color: #e9d5ff;
}

.kpi-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.kpi-blue .kpi-icon {
  background: #dbeafe;
  color: #1d4ed8;
}
.kpi-green .kpi-icon {
  background: #dcfce7;
  color: #15803d;
}
.kpi-purple .kpi-icon {
  background: #ede9fe;
  color: #6d28d9;
}

.kpi-info {
  display: flex;
  flex-direction: column;
}
.kpi-value {
  font-size: 1.75rem;
  font-weight: 800;
  color: #0f172a;
  line-height: 1;
}
.kpi-label {
  font-size: 0.8125rem;
  color: #64748b;
  margin-top: 0.25rem;
}

.success-banner,
.error-banner {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.875rem 1rem;
  border-radius: 10px;
  font-size: 0.875rem;
}
.success-banner {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #15803d;
}
.error-banner {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: -0.5rem;
}
.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
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
}
.btn-refresh:hover {
  background: #e2e8f0;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.spinning {
  animation: spin 0.8s linear infinite;
}
</style>
