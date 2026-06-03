
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

export default function useAuth() {
  const auth = useAuthStore()
  const router = useRouter()

  const login = async (email, password) => {
    const ok = await auth.login({ email, password })

    if (!ok) return false

    // Redirección por rol
    switch (auth.userRole) {
      case 'docente':
        router.push('/docente/dashboard')
        break
      case 'director':
        router.push('/director/dashboard')
        break
      case 'admin':
        router.push('/admin/dashboard')
        break
      default:
        router.push('/')
    }

    return true
  }

  const logout = () => {
    auth.logout()
  }

  return {
    login,
    logout,
    loading: computed(() => auth.loading),
    error: computed(() => auth.error),
    user: computed(() => auth.user),
    role: computed(() => auth.userRole),
    isAuthenticated: computed(() => auth.isAuthenticated)
  }
}
