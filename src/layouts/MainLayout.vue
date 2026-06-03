<template>
  <div class="flex h-screen bg-[#f8fafc] font-sans antialiased text-gray-800">
    
    <aside class="w-64 bg-[#1e1e1e] text-gray-300 flex flex-col justify-between shadow-2xl border-r border-zinc-800">
      <div>
        <div class="h-16 flex items-center justify-center border-b border-zinc-800 px-6">
          <h1 class="text-xs uppercase tracking-widest font-semibold text-gray-400">
            ASDASDAD
          </h1>
        </div>

        <div class="flex flex-col items-center py-6 border-b border-zinc-800 bg-black/10">
          <div class="w-20 h-20 rounded-full overflow-hidden border-2 border-zinc-700 shadow-md mb-3">
            <img 
              src="https://via.placeholder.com/150" 
              alt="User Avatar" 
              class="w-full h-full object-cover"
            />
          </div>
          <p class="text-sm font-medium text-gray-200">nOMBRE DE USUARIO</p>
          
          <div class="flex gap-4 mt-3 text-gray-500">
            <button class="hover:text-amber-500 transition-colors">
              <span class="text-sm">⚙️</span>
            </button>
            <button @click="logout" class="hover:text-red-400 transition-colors">
              <span class="text-sm">❌</span>
            </button>
          </div>
        </div>

        <nav class="mt-4 px-2 space-y-1">
          <router-link 
            to="/docente/dashboard" 
            class="flex items-center justify-between px-4 py-3 rounded text-sm text-gray-400 hover:bg-zinc-800 hover:text-white transition-all duration-150 group"
            active-class="bg-zinc-800/80 text-white font-medium border-l-4 border-cyan-500 pl-3"
          >
            <div class="flex items-center gap-3">
              <span class="text-xs opacity-70 group-hover:scale-110 transition-transform">📊</span>
              <span>Dashboard</span>
            </div>
          </router-link>
          
          <router-link 
            to="/administration" 
            class="flex items-center justify-between px-4 py-3 rounded text-sm text-gray-400 hover:bg-zinc-800 hover:text-white transition-all duration-150 group"
            active-class="bg-zinc-800/80 text-white font-medium border-l-4 border-cyan-500 pl-3"
          >
            <div class="flex items-center gap-3">
              <span class="text-xs opacity-70 group-hover:scale-110 transition-transform">💼</span>
              <span>Administration</span>
            </div>
            <span class="text-[10px] text-gray-600">▼</span>
          </router-link>

          <router-link 
            to="/users" 
            class="flex items-center justify-between px-4 py-3 rounded text-sm text-gray-400 hover:bg-zinc-800 hover:text-white transition-all duration-150 group"
            active-class="bg-zinc-800/80 text-white font-medium border-l-4 border-cyan-500 pl-3"
          >
            <div class="flex items-center gap-3">
              <span class="text-xs opacity-70 group-hover:scale-110 transition-transform">👥</span>
              <span>Users</span>
            </div>
            <span class="text-[10px] text-gray-600">▼</span>
          </router-link>
          
          <router-link 
            to="/settings" 
            class="flex items-center justify-between px-4 py-3 rounded text-sm text-gray-400 hover:bg-zinc-800 hover:text-white transition-all duration-150 group"
            active-class="bg-zinc-800/80 text-white font-medium border-l-4 border-cyan-500 pl-3"
          >
            <div class="flex items-center gap-3">
              <span class="text-xs opacity-70 group-hover:scale-110 transition-transform">🌍</span>
              <span>Settings School</span>
            </div>
            <span class="text-[10px] text-gray-600">▼</span>
          </router-link>
        </nav>
      </div>

      <div class="p-4 border-t border-zinc-800 text-center">
        <p class="text-[10px] text-zinc-600 tracking-wider">PlanificAR v1.0</p>
      </div>
    </aside>

    <div class="flex-1 flex flex-col overflow-hidden">
      
      <header class="h-16 bg-[#0f0f12] flex items-center justify-between px-6 shadow-md z-10">
        <div class="flex items-center gap-4">
          <button class="text-gray-400 hover:text-white text-lg font-bold">
            ⋮
          </button>
        </div>

        <div class="flex items-center gap-3">
          <span class="text-xs text-zinc-500 font-medium">Ciclo Lectivo 2026</span>
        </div>
      </header>

      <main class="flex-1 overflow-x-hidden overflow-y-auto p-8 bg-[#f8fafc]">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>

    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  console.log('Cerrando sesión...')
  router.push('/login')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
<!-- <template>
  <div class="flex h-screen bg-gray-100 font-sans antialiased text-gray-800">

    <aside class="w-64 bg-indigo-900 text-white flex flex-col justify-between shadow-xl">
      <div>
        <div class="p-6 flex items-center gap-3 border-b border-indigo-800">
          <span class="text-2xl">📝</span>
          <h1 class="text-xl font-bold tracking-wider bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
            PlanificAR
          </h1>
        </div>

        <nav class="mt-6 px-4 space-y-1">
          <router-link
            to="/docente/dashboard"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-indigo-100 hover:bg-indigo-800 hover:text-white transition-colors duration-200"
            active-class="bg-indigo-800 text-white font-medium"
          >
            <span>📊</span> Dashboard
          </router-link>

          <router-link
            to="/planificaciones"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-indigo-100 hover:bg-indigo-800 hover:text-white transition-colors duration-200"
            active-class="bg-indigo-800 text-white font-medium"
          >
            <span>📁</span> Mis Planificaciones
          </router-link>

          <router-link
            to="/notificaciones"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-indigo-100 hover:bg-indigo-800 hover:text-white transition-colors duration-200"
          >
            <span>🔔</span> Notificaciones
          </router-link>
        </nav>
      </div>

      <div class="p-4 border-t border-indigo-800">
        <button
          @click="logout"
          class="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-300 hover:bg-red-950/40 hover:text-red-200 transition-colors duration-200 text-sm font-medium"
        >
          <span>🚪</span> Cerrar Sesión
        </button>
      </div>
    </aside>

    <div class="flex-1 flex flex-col overflow-hidden">

      <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10">
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-500">Ciclo Lectivo 2026</span>
        </div>

        <div class="flex items-center gap-3">
          <div class="text-right">
            <p class="text-sm font-semibold text-gray-700">Prof. Laura Martínez</p>
            <p class="text-xs text-indigo-600 font-medium capitalize">Rol: Docente</p>
          </div>
          <div class="w-10 h-10 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-lg font-bold text-indigo-700 shadow-inner">
            LM
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-x-hidden overflow-y-auto p-8">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>

    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  // Aquí limpiarías el token/store antes de redirigir
  console.log('Cerrando sesión...')
  router.push('/login')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> -->
