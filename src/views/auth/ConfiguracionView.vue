<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h1 class="text-xl font-bold text-gray-900">Configuración de Mi Perfil</h1>
      <p class="text-sm text-gray-500 mt-1">Actualizá tu información personal y credenciales de acceso institucional.</p>
    </div>

    <form @submit.prevent="guardarDatos" class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Nombre Completo</label>
          <input v-model="perfil.name" type="text" required class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Correo Electrónico</label>
          <input v-model="perfil.email" type="email" required class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
        </div>
      </div>

      <div class="border-t border-gray-100 pt-4">
        <h3 class="text-sm font-bold text-gray-800 mb-3">Cambiar Contraseña</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Nueva Contraseña</label>
            <input v-model="perfil.password" type="password" placeholder="Mínimo 8 caracteres" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
          </div>
        </div>
      </div>

      <div class="flex justify-end pt-2">
        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-md">
          Guardar Cambios
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'

const authStore = useAuthStore()
const toast = useToastStore()

const perfil = ref({
  name: authStore.user?.name || '',
  email: authStore.user?.email || '',
  password: ''
})

const guardarDatos = () => {
  if (authStore.user) {
    authStore.user.name = perfil.value.name
    authStore.user.email = perfil.value.email
  }
  toast.showToast('¡Perfil actualizado con éxito en el sistema!', 'success')
}
</script>
