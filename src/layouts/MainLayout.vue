<template>
  <div class="flex h-screen bg-slate-50 overflow-hidden">

    <aside
      class="flex flex-col w-64 bg-white border-r border-slate-100 flex-shrink-0 z-30"
      style="box-shadow: 1px 0 16px rgba(0,0,0,0.04);"
    >
      <div class="flex items-center gap-3 px-5 py-5 border-b border-slate-100">
        <div
          class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style="background: linear-gradient(135deg, #1e4fa8, #2563eb);"
        >
          <GraduationCap :size="19" class="text-white" />
        </div>
        <div>
          <p class="font-extrabold text-slate-800 text-base leading-tight tracking-wide">PlanificAR</p>
          <p class="text-xs text-slate-400 font-medium tracking-wider">Gestión Pedagógica</p>
        </div>
      </div>

      <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 pb-2 pt-1">
          Menú Principal
        </p>

        <template v-if="authStore.userRole === 'docente'">
          <NavItem v-for="item in navDocente" :key="item.to" v-bind="item" />
        </template>

        <template v-else-if="authStore.userRole === 'director'">
          <NavItem v-for="item in navDirector" :key="item.to" v-bind="item" />
        </template>

        <template v-else-if="authStore.userRole === 'admin'">
          <NavItem v-for="item in navAdmin" :key="item.to" v-bind="item" />
        </template>

        <div class="h-px bg-slate-100 mx-2 my-2"></div>
        <NavItem :icon="Settings" label="Configuración" to="/configuracion" />
      </nav>

      <div class="px-3 pb-4 border-t border-slate-100 pt-3">
        <div class="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-50 ring-1 ring-slate-100">
          <div
            class="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
            :style="{ background: avatarGradient }"
          >
            {{ userInitials }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-slate-800 truncate">{{ authStore.user?.name }}</p>
            <p class="text-xs text-slate-400 truncate flex items-center gap-1">
              <Shield :size="10" />
              {{ authStore.user?.roleLabel || authStore.userRole }}
            </p>
          </div>
        </div>
      </div>
    </aside>

    <div class="flex flex-col flex-1 overflow-hidden">

      <header
        class="flex items-center gap-4 px-6 py-3.5 bg-white border-b border-slate-100 flex-shrink-0 z-20"
        style="box-shadow: 0 1px 12px rgba(0,0,0,0.04);"
      >
        <div class="flex-1 max-w-sm relative">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search :size="15" class="text-slate-400" />
          </span>
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Buscar planificación, docente..."
            class="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50
                   text-slate-800 placeholder-slate-400
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white
                   transition-all duration-200"
          />
        </div>

        <div class="flex-1"></div>

        <div class="relative" ref="notificationDropdownRef">
          <button
            @click="toggleNotifications"
            class="relative w-10 h-10 rounded-xl flex items-center justify-center
                   text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors focus:outline-none"
            title="Notificaciones"
          >
            <Bell :size="19" />
            <span
              v-if="notificacionesStore.unreadCount > 0"
              class="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1
                     bg-red-500 text-white text-[10px] font-bold rounded-full
                     flex items-center justify-center leading-none animate-pulse"
            >
              {{ notificacionesStore.unreadCount }}
            </span>
          </button>

          <div
            v-if="showNotifications"
            class="absolute right-0 mt-2 w-80 bg-white border border-slate-100 rounded-xl shadow-xl py-1 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
          >
            <div class="px-4 py-2.5 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
              <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Notificaciones</span>
              <button @click="notificacionesStore.marcarTodasComoLeidas()" class="text-xxs font-semibold text-blue-600 hover:text-blue-800">Marcar leídas</button>
            </div>
            <div class="max-h-64 overflow-y-auto divide-y divide-slate-50">
              <p v-if="notificacionesStore.lista.length === 0" class="text-xs text-slate-400 text-center py-6">No tenés alertas pendientes.</p>
              <div
                v-for="noti in notificacionesStore.lista"
                :key="noti.id"
                class="p-3 text-xs flex gap-2.5 items-start transition-colors"
                :class="!noti.leida ? 'bg-blue-50/20' : ''"
              >
                <span class="mt-0.5">{{ noti.tipo === 'success' ? '✅' : '⚠️' }}</span>
                <div class="flex-1">
                  <p class="text-slate-700 font-medium leading-normal">{{ noti.mensaje }}</p>
                  <span class="text-[10px] text-slate-400 block mt-1 font-semibold">{{ noti.fecha }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="w-px h-7 bg-slate-200"></div>

        <div class="flex items-center gap-2.5">
          <div
            class="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white flex-shrink-0"
            :style="{ background: avatarGradient }"
          >
            {{ userInitials }}
          </div>
          <div class="hidden sm:block">
            <p class="text-sm font-semibold text-slate-800 leading-tight">
              {{ authStore.user?.prefix || 'Prof.' }} {{ authStore.user?.name?.split(' ').slice(-1)[0] }}
            </p>
            <p class="text-[11px] text-slate-400 leading-tight">{{ authStore.user?.roleLabel || authStore.userRole }}</p>
          </div>
          <button
            @click="handleLogout"
            class="w-8 h-8 ml-1 rounded-lg flex items-center justify-center
                   text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
            title="Cerrar sesión"
          >
            <LogOut :size="16" />
          </button>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto bg-slate-50 p-6">
        <RouterView />
      </main>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  GraduationCap, Search, Bell, LogOut, Settings, Shield,
  // Docente
  LayoutDashboard, FilePlus, FolderOpen, BookOpen, TrendingUp,
  // Director
  ClipboardList, UserPlus, Users,
  // Admin
  KeyRound, UserSearch, BarChart2,
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useNotificacionesStore } from '@/stores/notificaciones' // 🟢 Conectamos el store de la campana

const router = useRouter()
const authStore = useAuthStore()
const notificacionesStore = useNotificacionesStore()

const searchQuery = ref('')
const showNotifications = ref(false)
const notificationDropdownRef = ref(null)

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  if (showNotifications.value) {
    notificacionesStore.marcarTodasComoLeidas()
  }
}

function handleOutsideClick(e) {
  if (notificationDropdownRef.value && !notificationDropdownRef.value.contains(e.target)) {
    showNotifications.value = false
  }
}
onMounted(() => document.addEventListener('mousedown', handleOutsideClick))
onUnmounted(() => document.removeEventListener('mousedown', handleOutsideClick))

async function handleLogout() {
  try {
    await authStore.logout()
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  } finally {
    await router.replace('/login')
  }
}

const userInitials = computed(() => {
  const name = authStore.user?.name || ''
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
})

const ROLE_GRADIENTS = {
  docente:  'linear-gradient(135deg, #1e4fa8, #3b82f6)',
  director: 'linear-gradient(135deg, #065f46, #10b981)',
  admin:    'linear-gradient(135deg, #7c3aed, #a78bfa)',
}
const avatarGradient = computed(() => ROLE_GRADIENTS[authStore.userRole] || ROLE_GRADIENTS.docente)

const navDocente = [
  { icon: LayoutDashboard, label: 'Mi Panel',            to: '/planificaciones' },
  { icon: FilePlus,        label: 'Crear Planificación', to: '/planificaciones/nueva' },
  { icon: FolderOpen,      label: 'Mis Planificaciones', to: '/planificaciones' },
]

const navDirector = [
  { icon: ClipboardList,   label: 'Planificaciones Recibidas', to: '/revisiones' },
  { icon: UserPlus,        label: 'Crear Docente',             to: '/docentes/crear' },
  { icon: KeyRound,        label: 'Blanqueo Contraseña',        to: '/usuarios/reset' },
]

const navAdmin = [
  { icon: LayoutDashboard, label: 'Panel Principal',    to: '/dashboard' },
  { icon: UserPlus,        label: 'Crear Usuario',      to: '/usuarios/crear' },
  { icon: KeyRound,        label: 'Blanqueo Contraseña', to: '/usuarios/reset' },
  { icon: UserSearch,      label: 'Listado Usuarios',   to: '/usuarios' },
]
</script>

<script>
import { defineComponent, h } from 'vue'
import { RouterLink, useLink } from 'vue-router'

export const NavItem = defineComponent({
  name: 'NavItem',
  props: {
    icon: { type: [Object, Function], required: true },
    label: { type: String, required: true },
    to: { type: String, required: true },
  },
  setup(props) {
    const { isActive } = useLink({ to: computed(() => props.to) })
    return { isActive }
  },
  render() {
    const active = this.isActive
    return h(
      RouterLink,
      {
        to: this.to,
        class: [
          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group',
          active
            ? 'bg-blue-50 text-blue-700 font-semibold'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
        ],
      },
      () => [
        h(this.icon, {
          size: 17,
          class: active ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600',
        }),
        h('span', { class: 'flex-1' }, this.label),
        active ? h('span', { class: 'w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0' }) : null,
      ]
    )
  },
})
</script>
<style>
.text-xxs { font-size: 0.65rem; }
</style>
