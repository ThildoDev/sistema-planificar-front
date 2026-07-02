<template>
  <div class="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">

    <div
      class="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden bg-blue-600 text-white"
    >
      <div
        class="absolute inset-0 opacity-10 pointer-events-none"
        style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 24px 24px;"
      ></div>

      <div class="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-blue-500/30 blur-2xl pointer-events-none"></div>
      <div class="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-blue-700/40 blur-3xl pointer-events-none"></div>

      <div class="flex items-center gap-3.5 relative z-10">
        <div class="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg">
          <GraduationCap :size="24" class="text-white" />
        </div>
        <div>
          <h1 class="font-black text-xl tracking-wide leading-tight">PlanificAR</h1>
          <p class="text-xs text-blue-200 font-medium tracking-wider">Sistema de Gestión de Planificación Pedagógica</p>
        </div>
      </div>

      <div class="max-w-xl my-auto relative z-10 space-y-5">
        <h2 class="text-4xl xl:text-5xl font-extrabold tracking-tight leading-[1.15]">
          Transformando la <br>educación con tecnología
        </h2>
        <p class="text-blue-100 text-base xl:text-lg leading-relaxed font-normal opacity-90">
          Planificá, gestioná y hacé seguimiento de tu actividad pedagógica de manera simple, colaborativa y eficiente.
        </p>
      </div>

      <div class="flex flex-wrap gap-2.5 pt-6 border-t border-white/10 relative z-10">
        <span class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm text-xs font-semibold tracking-wide border border-white/5">
          <span>📑</span> Planificaciones
        </span>
        <span class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm text-xs font-semibold tracking-wide border border-white/5">
          <span>👥</span> Colaboración
        </span>
        <span class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm text-xs font-semibold tracking-wide border border-white/5">
          <span>📊</span> Seguimiento
        </span>
        <span class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm text-xs font-semibold tracking-wide border border-white/5">
          <span>✅</span> Aprobaciones
        </span>
      </div>
    </div>

    <div class="w-full lg:w-1/2 flex flex-col justify-between bg-white px-6 py-8 sm:p-12 md:p-20 relative">

      <div class="hidden sm:block"></div>

      <div class="w-full max-w-md mx-auto space-y-8">
        <div class="space-y-2 text-left">
          <h3 class="text-3xl font-extrabold text-slate-800 tracking-tight">Bienvenido</h3>
          <p class="text-sm text-slate-400 font-medium">Sistema de Gestión Pedagógica</p>
        </div>

        <div v-if="errorMsg" class="p-4 rounded-xl bg-rose-50 border border-rose-100 text-sm text-rose-600 font-medium animate-fade-in">
          ⚠️ {{ errorMsg }}
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-5">

          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Correo electrónico
            </label>
            <div class="relative">
              <input
                v-model="email"
                type="email"
                required
                placeholder="usuario@escuela.edu.ar"
                class="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-150"
              />
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Contraseña
            </label>
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="••••••••••••"
                class="w-full pl-4 pr-11 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-150"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Eye v-if="!showPassword" :size="18" />
                <EyeOff v-else :size="18" />
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between pt-1">
            <label class="flex items-center gap-2.5 cursor-pointer select-none group">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="w-4 h-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500/30 transition-all cursor-pointer"
              />
              <span class="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors">
                Recordar mi sesión
              </span>
            </label>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-3 px-5 rounded-xl transition-all duration-150 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
          >
            <span v-if="!isLoading" class="flex items-center justify-center gap-2">
              INICIAR SESIÓN
              <ArrowRight :size="16" />
            </span>
            <span v-else class="flex items-center gap-2">
              <Loader2 :size="16" class="animate-spin" />
              Autenticando...
            </span>
          </button>

        </form>
      </div>

      <div class="text-center pt-8 border-t border-slate-100 sm:border-none">
        <p class="text-xs font-medium text-slate-400 tracking-wide">
          © 2026 PlanificAR — Todos los derechos reservados
        </p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

// Importación de iconos de Lucide (asegurate de tenerlos si los usas en el template)
import { GraduationCap, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const isLoading = ref(false)
const errorMsg = ref('')

const handleSubmit = async () => {
  isLoading.value = true
  errorMsg.value = ''

  try {
    // Envía las credenciales reales hacia la base de datos mediante el store conectado
    await authStore.login(email.value, password.value)

    // Si la autenticación es exitosa, redirige al home
    router.push('/')
  } catch (err) {
    // Realizamos un mapeo seguro de lo que responde Laravel
    if (err.response && err.response.data) {
      // Intenta capturar la propiedad 'Errors' (en mayúscula) o el 'message' que envía el backend
      const backendData = err.response.data
      errorMsg.value = backendData.message || backendData.Errors || 'Credenciales inválidas. Comprobá tu usuario y contraseña.'
    } else {
      errorMsg.value = 'No se pudo establecer conexión con el servidor. Verificá que el backend esté encendido.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>
