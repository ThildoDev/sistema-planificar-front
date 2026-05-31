import { ref } from 'vue'
import { useUsuariosStore } from '@/stores/usuarios'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

/**
 * useUsuarios
 * Composable que expone la lógica de gestión de usuarios
 * al módulo Admin y Director.
 */
export function useUsuarios() {
  const store = useUsuariosStore()
  const authStore = useAuthStore()

  const {
    usuarios,
    loading,
    loadingAction,
    error,
    successMsg,
    totalUsuarios,
    totalDocentes,
    totalDirectores,
  } = storeToRefs(store)

  // ─── Roles disponibles según el rol del usuario logueado ─────────────────
  const rolesDisponibles = computed(() => {
    const currentRole = authStore.userRole
    if (currentRole === 'admin') {
      return [
        { value: 'admin', label: 'Administrador' },
        { value: 'director', label: 'Director' },
        { value: 'docente', label: 'Docente' },
        { value: 'user', label: 'Usuario común' },
      ]
    }
    if (currentRole === 'director') {
      return [
        { value: 'docente', label: 'Docente' },
        { value: 'user', label: 'Usuario común' },
      ]
    }
    return []
  })

  // ─── Filtro local de búsqueda ─────────────────────────────────────────────
  const searchQuery = ref('')
  const filterRole = ref('todos')

  const usuariosFiltrados = computed(() => {
    return usuarios.value.filter((u) => {
      const matchRole = filterRole.value === 'todos' || u.role === filterRole.value
      const matchSearch =
        !searchQuery.value ||
        u.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.value.toLowerCase())
      return matchRole && matchSearch
    })
  })

  return {
    // Estado del store
    usuarios,
    usuariosFiltrados,
    loading,
    loadingAction,
    error,
    successMsg,
    // Getters
    totalUsuarios,
    totalDocentes,
    totalDirectores,
    rolesDisponibles,
    // Filtros locales
    searchQuery,
    filterRole,
    // Acciones del store
    fetchUsuarios: store.fetchUsuarios,
    crearUsuario: store.crearUsuario,
    asignarRol: store.asignarRol,
    resetPassword: store.resetPassword,
    clearMessages: store.clearMessages,
  }
}
