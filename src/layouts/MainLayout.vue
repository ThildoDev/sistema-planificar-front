<template>
  <div class="flex h-screen bg-slate-50 overflow-hidden">

    <!-- ══════════════════════════════════════════════
         SIDEBAR LATERAL FIJO
    ══════════════════════════════════════════════ -->
    <aside
      class="flex flex-col w-64 bg-white border-r border-slate-100 flex-shrink-0 z-30"
      style="box-shadow: 1px 0 16px rgba(0,0,0,0.04);"
    >

      <!-- Logo superior -->
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

      <!-- Navegación dinámica por rol -->
      <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">

        <!-- Etiqueta de sección -->
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 pb-2 pt-1">
          Menú Principal
        </p>

        <!-- ── Docente ── -->
        <template v-if="authStore.userRole === 'docente'">
          <NavItem v-for="item in navDocente" :key="item.to" v-bind="item" />
        </template>

        <!-- ── Director ── -->
        <template v-else-if="authStore.userRole === 'director'">
          <NavItem v-for="item in navDirector" :key="item.to" v-bind="item" />
        </template>

        <!-- ── Admin ── -->
        <template v-else-if="authStore.userRole === 'admin'">
          <NavItem v-for="item in navAdmin" :key="item.to" v-bind="item" />
        </template>

        <!-- Separador -->
        <div class="h-px bg-slate-100 mx-2 my-2"></div>

        <!-- Configuración (todos los roles) -->
        <NavItem :icon="Settings" label="Configuración" to="/configuracion" />

      </nav>

      <!-- ── Tarjeta perfil de usuario (base fija del sidebar) ── -->
      <div class="px-3 pb-4 border-t border-slate-100 pt-3">
        <div class="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-50 ring-1 ring-slate-100">

          <!-- Avatar con iniciales -->
          <div
            class="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
            :style="{ background: avatarGradient }"
          >
            {{ userInitials }}
          </div>

          <!-- Datos -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-slate-800 truncate">{{ authStore.user?.name }}</p>
            <p class="text-xs text-slate-400 truncate flex items-center gap-1">
              <Shield :size="10" />
              {{ authStore.user?.roleLabel }}
            </p>
          </div>

          <!-- Menú de rol-switcher rápido (solo dev) -->
          <div class="relative" ref="roleSwitcherRef">
            <button
              @click="showRoleSwitcher = !showRoleSwitcher"
              class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400
                     hover:bg-slate-200 hover:text-slate-600 transition-colors"
              title="Cambiar rol (demo)"
            >
              <ChevronUp v-if="showRoleSwitcher" :size="14" />
              <ChevronDown v-else :size="14" />
            </button>

            <!-- Dropdown de roles -->
            <div
              v-if="showRoleSwitcher"
              class="absolute bottom-full right-0 mb-2 w-36 bg-white rounded-xl shadow-xl
                     border border-slate-100 py-1 z-50"
            >
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1.5">
                Demo / Rol
              </p>
              <button
                v-for="role in ['docente', 'director', 'admin']"
                :key="role"
                @click="switchRole(role)"
                class="w-full text-left px-3 py-2 text-sm capitalize transition-colors"
                :class="authStore.userRole === role
                  ? 'text-blue-600 font-semibold bg-blue-50'
                  : 'text-slate-700 hover:bg-slate-50'"
              >
                {{ role }}
              </button>
            </div>
          </div>

        </div>
      </div>

    </aside>

    <!-- ══════════════════════════════════════════════
         ÁREA PRINCIPAL (Header + Contenido)
    ══════════════════════════════════════════════ -->
    <div class="flex flex-col flex-1 overflow-hidden">

      <!-- ── Header Superior Sticky ── -->
      <header
        class="flex items-center gap-4 px-6 py-3.5 bg-white border-b border-slate-100 flex-shrink-0 z-20"
        style="box-shadow: 0 1px 12px rgba(0,0,0,0.04);"
      >

        <!-- Búsqueda general -->
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

        <!-- Spacer -->
        <div class="flex-1"></div>

        <!-- Notificaciones -->
        <button
          class="relative w-10 h-10 rounded-xl flex items-center justify-center
                 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          title="Notificaciones"
        >
          <Bell :size="19" />
          <span
            v-if="authStore.user?.notifications > 0"
            class="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1
                   bg-red-500 text-white text-[10px] font-bold rounded-full
                   flex items-center justify-center leading-none"
          >
            {{ authStore.user.notifications > 9 ? '9+' : authStore.user.notifications }}
          </span>
        </button>

        <!-- Separador vertical -->
        <div class="w-px h-7 bg-slate-200"></div>

        <!-- IdentidadCard compacta -->
        <div class="flex items-center gap-2.5">

          <!-- Avatar compacto -->
          <div
            class="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white flex-shrink-0"
            :style="{ background: avatarGradient }"
          >
            {{ userInitials }}
          </div>

          <!-- Nombre + Rol -->
          <div class="hidden sm:block">
            <p class="text-sm font-semibold text-slate-800 leading-tight">
              {{ authStore.user?.prefix }} {{ authStore.user?.name.split(' ').slice(-1)[0] }}
            </p>
            <p class="text-[11px] text-slate-400 leading-tight">{{ authStore.user?.roleLabel }}</p>
          </div>

          <!-- Botón logout -->
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

      <!-- ── Área de contenido central dinámica ── -->
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
  ChevronDown, ChevronUp,
  // Docente
  LayoutDashboard, FilePlus, FolderOpen, BookOpen, TrendingUp,
  // Director
  ClipboardList, UserPlus, Users,
  // Admin
  KeyRound, UserSearch,
  BarChart2,
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// ── Búsqueda ──
const searchQuery = ref('')

// ── Role switcher dropdown ──
const showRoleSwitcher = ref(false)
const roleSwitcherRef = ref(null)

// function switchRole(role) {
//   authStore.switchRole(role)
//   showRoleSwitcher.value = false
// }
function switchRole(role) {
  authStore.switchRole(role)
  showRoleSwitcher.value = false
  router.push('/')
}

// Cierra dropdown al hacer click afuera
function handleOutsideClick(e) {
  if (roleSwitcherRef.value && !roleSwitcherRef.value.contains(e.target)) {
    showRoleSwitcher.value = false
  }
}
onMounted(() => document.addEventListener('mousedown', handleOutsideClick))
onUnmounted(() => document.removeEventListener('mousedown', handleOutsideClick))

// ── Logout ──
function handleLogout() {
  authStore.logout()
  router.push('/login')
}

// ── Avatar ──
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

// ──────────────────────────────────────────────
//  MENÚS DE NAVEGACIÓN
// ──────────────────────────────────────────────

const navDocente = [
  { icon: LayoutDashboard, label: 'Mi Panel',            to: '/docente/dashboard' },
  { icon: FilePlus,        label: 'Crear Planificación', to: '/docente/planificaciones/crear' },
  { icon: FolderOpen,      label: 'Mis Planificaciones', to: '/docente/planificaciones' },
  { icon: BookOpen,        label: 'Libro de Temas',        to: '/docente/libro-temas' },
  { icon: TrendingUp,      label: 'Mi Avance',             to: '/docente/avance' },
]

const navDirector = [
  { icon: LayoutDashboard, label: 'Panel Principal',          to: '/dashboard' },
  { icon: ClipboardList,   label: 'Planificaciones Recibidas', to: '/revisiones' },
  { icon: UserPlus,        label: 'Crear Docente',            to: '/docentes/crear' },
  { icon: Users,           label: 'Mis Docentes',             to: '/docentes' },
  { icon: BarChart2,       label: 'Reportes',                 to: '/reportes' },
]

const navAdmin = [
  { icon: LayoutDashboard, label: 'Panel Principal',    to: '/dashboard' },
  { icon: UserPlus,        label: 'Crear Usuario',      to: '/usuarios/crear' },
  { icon: KeyRound,        label: 'Blanqueo Contraseña', to: '/usuarios/reset' },
  { icon: UserSearch,      label: 'Listado Usuarios',   to: '/usuarios' },
]
</script>

<!-- NavItem — componente inline para cada enlace del menú -->
<script>
// Definición del sub-componente NavItem (reutilizable y colocado en el mismo archivo)
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
        active
          ? h('span', {
              class: 'w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0',
            })
          : null,
      ]
    )
  },
})
</script>
