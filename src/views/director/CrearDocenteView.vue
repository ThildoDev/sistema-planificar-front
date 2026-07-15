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

    <div v-if="mostrarModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl border border-gray-200 shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
        <div class="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div class="bg-emerald-100 p-2 rounded-full text-emerald-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-bold text-gray-900">¡Docente Creado!</h2>
            <p class="text-xs text-gray-500">Credenciales listas para compartir</p>
          </div>
        </div>

        <div class="mt-4 space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200 text-sm">
          <div>
            <span class="block text-xs font-bold text-gray-500 uppercase">Nombre Completo</span>
            <span class="text-gray-950 font-medium">{{ datosDocenteCreado.nombreCompleto }}</span>
          </div>
          <div>
            <span class="block text-xs font-bold text-gray-500 uppercase">Usuario (Login)</span>
            <span class="text-gray-950 font-mono font-bold">{{ datosDocenteCreado.usuario }}</span>
          </div>
          <div>
            <span class="block text-xs font-bold text-gray-500 uppercase">Contraseña</span>
            <span class="text-gray-950 font-mono font-bold">{{ datosDocenteCreado.password }}</span>
          </div>
        </div>

        <div class="mt-6 flex flex-col gap-2">
          <button @click="copiarCredenciales" class="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            {{ textoBotonCopiar }}
          </button>

          <button @click="cerrarModal" class="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all border border-slate-200">
            Cerrar Ventana
          </button>
        </div>
      </div>
    </div>
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


const mostrarModal = ref(false)
const textoBotonCopiar = ref('Copiar datos para enviar')
const datosDocenteCreado = ref({
  nombreCompleto: '',
  usuario: '',
  password: ''
})

const registrar = async () => {
  try {
    const payload = {
      ...form.value,
      role: 'docente'
    }

    await api.post('/register', payload)

    datosDocenteCreado.value = {
      nombreCompleto: `${form.value.nombres} ${form.value.apellidos}`,
      usuario: form.value.email,
      password: form.value.password
    }

    toast.showToast('¡Docente registrado exitosamente!', 'success')

    mostrarModal.value = true

    Object.keys(form.value).forEach(k => form.value[k] = '')
  } catch (error) {
    console.error(error)
    toast.showToast('Error al intentar registrar al docente.', 'error')
  }
}

// copiar el texto al portapapeles y mostrar un toast de éxito
const copiarCredenciales = async () => {
  const textoCopiar = `Hola ${datosDocenteCreado.value.nombreCompleto}, te damos la bienvenida a PlanificAr. Aquí tienes tus credenciales de acceso como Docente:\n\n👤 Usuario: ${datosDocenteCreado.value.usuario}\n🔑 Contraseña: ${datosDocenteCreado.value.password}\n\n¡Que tengas un excelente día!`

  try {
    await navigator.clipboard.writeText(textoCopiar)
    textoBotonCopiar.value = '¡Copiado con Éxito! ✓'
    toast.showToast('Credenciales copiadas al portapapeles', 'success')
    setTimeout(() => {
      textoBotonCopiar.value = 'Copiar datos para enviar'
    }, 2500)
  } catch {
    toast.showToast('No se pudo copiar automáticamente.', 'error')
  }
}

const cerrarModal = () => {
  mostrarModal.value = false
}
</script>
