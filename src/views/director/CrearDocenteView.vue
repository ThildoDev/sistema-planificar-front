<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h1 class="text-xl font-bold text-gray-900">Registrar Nuevo Docente</h1>
      <p class="text-sm text-gray-500 mt-1">Dá de alta una nueva persona y su credencial de usuario en la base de datos.</p>
    </div>

    <form @submit.prevent="registrar" class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Nombres *</label>
          <input v-model="form.nombres" type="text" required class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none" />
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Apellidos *</label>
          <input v-model="form.apellidos" type="text" required class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none" />
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">DNI / Documento *</label>
          <input v-model="form.dni" type="text" required class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none" />
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Teléfono *</label>
          <input v-model="form.telefono" type="text" required class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none" />
        </div>
        <div class="sm:col-span-2">
          <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Dirección Física *</label>
          <input v-model="form.direccion" type="text" required class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none" />
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Fecha Nacimiento *</label>
          <input v-model="form.fecha_nacimiento" type="date" required class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none" />
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Nombre de Usuario (Login) *</label>
          <input v-model="form.name" type="text" required class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none" />
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">E-mail Institucional *</label>
          <input v-model="form.email" type="email" required class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none" />
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Contraseña Inicial *</label>
          <input v-model="form.password" type="password" required placeholder="Mínimo 8 caracteres" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none" />
        </div>
      </div>

      <div class="flex justify-end gap-3 pt-2">
        <button type="submit" class="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-md">
          Crear y Sincronizar Docente
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToastStore } from '@/stores/toast'
import api from '@/plugins/axios'

const toast = useToastStore()

const form = ref({
  nombres: '', apellidos: '', dni: '', telefono: '',
  direccion: '', fecha_nacimiento: '', name: '', email: '', password: ''
})

const registrar = async () => {
  try {
    // Le pegamos directo al endpoint público de tu AuthController que lee los campos mapeados
    await api.post('/register', form.value)
    toast.showToast('¡Docente registrado exitosamente en Laravel!', 'success')
    // Reset del formulario
    Object.keys(form.value).forEach(k => form.value[k] = '')
  } catch (err) {
    toast.showToast('Error al intentar registrar al docente.', 'error')
  }
}
</script>
