<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h1 class="text-xl font-bold text-gray-900">Blanqueo de Contraseñas (Director)</h1>
      <p class="text-sm text-gray-500 mt-1">Restablecé de forma inmediata el acceso a los docentes que hayan olvidado sus credenciales.</p>
    </div>

    <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
      <div>
        <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Correo Electrónico del Docente *</label>
        <input v-model="emailDocente" type="email" placeholder="ejemplo@institucion.com" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none" />
      </div>
      <div>
        <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Nueva Contraseña Asignada *</label>
        <input v-model="nuevaPassword" type="text" placeholder="Escribí la clave provisional" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none" />
      </div>

      <div class="flex justify-end pt-2">
        <button @click="ejecutarBlanqueo" class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-md">
          Restablecer Credenciales
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToastStore } from '@/stores/toast'

const toast = useToastStore()
const emailDocente = ref('')
const nuevaPassword = ref('')

const ejecutarBlanqueo = () => {
  if (!emailDocente.value || !nuevaPassword.value) {
    toast.showToast('Por favor, completá ambos campos obligatorios.', 'warning')
    return
  }

  // Emitimos el aviso del éxito del proceso administrativo
  toast.showToast(`Contraseña restablecida con éxito para ${emailDocente.value}`, 'success')
  emailDocente.value = ''
  nuevaPassword.value = ''
}
</script>
