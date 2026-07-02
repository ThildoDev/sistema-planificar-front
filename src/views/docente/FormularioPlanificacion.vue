<template>
  <div class="max-w-5xl mx-auto space-y-6 pb-12">
    <div class="flex items-center justify-between bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div>
        <button @click="volver" class="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 mb-1">
          ← Volver a mis planificaciones
        </button>
        <h1 class="text-xl font-bold text-gray-900">Redactar Planificación Anual</h1>
        <p class="text-sm text-gray-500">Completá los datos requeridos. Los campos institucionales se auto-asignan por seguridad.</p>
      </div>
    </div>

    <div v-if="planificacionStore.error || errorLocal" class="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-3">
      <span>⚠️</span>
      <p class="font-medium">{{ planificacionStore.error || errorLocal }}</p>
    </div>

    <div class="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-inner grid grid-cols-1 md:grid-cols-3 gap-6 opacity-80">
      <div>
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Docente Asignado</label>
        <input :value="docenteNombreCompleto" type="text" disabled class="w-full border border-gray-300 bg-gray-100 rounded-lg px-4 py-2.5 text-sm text-gray-600 font-medium cursor-not-allowed select-none outline-none shadow-sm" />
      </div>
      <div>
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Institucional</label>
        <input :value="authStore.user?.email" type="text" disabled class="w-full border border-gray-300 bg-gray-100 rounded-lg px-4 py-2.5 text-sm text-gray-600 font-medium cursor-not-allowed select-none outline-none shadow-sm" />
      </div>
      <div>
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Rol del Usuario</label>
        <input :value="authStore.user?.role" type="text" disabled class="w-full border border-gray-300 bg-gray-100 rounded-lg px-4 py-2.5 text-sm text-gray-600 font-medium uppercase tracking-wider cursor-not-allowed select-none outline-none shadow-sm" />
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">

      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">

        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Espacio Curricular / Área *</label>
          <select v-model="form.areas_id" required class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white font-medium text-gray-800">
            <option value="" disabled>Seleccione un área...</option>
            <option v-for="area in listaAreas" :key="area.id" :value="area.id">
              {{ area.area }} ({{ area.tipo }})
            </option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Ciclo / Cursado Asignado *</label>
          <select v-model="form.cursado_id" required class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white font-medium text-gray-800">
            <option value="" disabled>Seleccione el periodo...</option>
            <option v-for="item in listaCursados" :key="item.id" :value="item.id">
              Año: {{ item.anio_lectivo }} (Inicia: {{ item.fecha_inicio }})
            </option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Fecha de Presentación *</label>
          <input v-model="form.fecha_presentacion" type="date" required class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-medium text-gray-800" />
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">

        <div class="space-y-2">
          <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Saberes / Ejes Centrales y Unidades *</label>
          <div class="quill-wrapper">
            <QuillEditor v-model:content="form.saberes" contentType="html" :options="editorOptions" theme="snow" />
          </div>
        </div>

        <div class="space-y-2">
          <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Aprendizajes Esperados *</label>
          <div class="quill-wrapper">
            <QuillEditor v-model:content="form.aprendizajes_esperados" contentType="html" :options="editorOptions" theme="snow" />
          </div>
        </div>

        <div class="space-y-2">
          <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Criterios de Evaluación *</label>
          <div class="quill-wrapper">
            <QuillEditor v-model:content="form.criterios" contentType="html" :options="editorOptions" theme="snow" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
          <div class="space-y-2">
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Diagnóstico Inicial</label>
            <div class="quill-wrapper">
              <QuillEditor v-model:content="form.diagnostico" contentType="html" :options="editorOptions" theme="snow" />
            </div>
          </div>
          <div class="space-y-2">
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Bibliografía Sugerida</label>
            <div class="quill-wrapper">
              <QuillEditor v-model:content="form.bibliografia" contentType="html" :options="editorOptions" theme="snow" />
            </div>
          </div>
        </div>

      </div>

      <div class="flex justify-end gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
        <button type="button" @click="volver" class="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors">
          Cancelar
        </button>
        <button type="submit" :disabled="planificacionStore.loading" class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-lg shadow-blue-600/10">
          <span v-if="planificacionStore.loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          Guardar Propuesta Pedagógica
        </button>
      </div>

    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePlanificacionStore } from '@/stores/planificacion'
import { useAuthStore } from '@/stores/auth' // Importamos tu store de sesión
import api from '@/plugins/axios' // Tu conector centralizado de Axios
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const router = useRouter()
const planificacionStore = usePlanificacionStore()
const authStore = useAuthStore()

// Estados reactivos locales para los selectores
const listaAreas = ref([])
const listaCursados = ref([])
const errorLocal = ref(null)

const form = ref({
  fecha_presentacion: new Date().toISOString().split('T')[0],
  areas_id: '',
  cursado_id: '',
  saberes: '',
  aprendizajes_esperados: '',
  criterios: '',
  diagnostico: '',
  bibliografia: ''
})

// Mapeamos el nombre real del docente desde el user o sus datos locales
const docenteNombreCompleto = computed(() => {
  if (authStore.user?.name) {
    return authStore.user.name
  }
  return 'Docente Conectado'
})

// Carga asíncrona de datos desde el backend real de Laravel al montar la vista
onMounted(async () => {
  try {
    errorLocal.value = null

    // 1. Buscamos las áreas mapeadas
    const resAreas = await api.get('/areas')
    listaAreas.value = Array.isArray(resAreas.data) ? resAreas.data : resAreas.data.data || []

    // 2. Buscamos los cursados mapeados
    const resCursados = await api.get('/cursados')
    listaCursados.value = Array.isArray(resCursados.data) ? resCursados.data : resCursados.data.data || []

  } catch (err) {
    console.error("Error al poblar selectores:", err)
    errorLocal.value = "No se pudieron sincronizar los catálogos institucionales de Laravel."
  }
})

// Cinta de herramientas completa de Quill
const editorOptions = {
  modules: {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['table'],
      ['clean']
    ]
  },
  placeholder: 'Comience a detallar el desarrollo pedagógico aquí...'
}

const volver = () => {
  router.push('/planificaciones') // Tu dashboard unificado
}

const handleSubmit = async () => {
  try {
    errorLocal.value = null
    await planificacionStore.createPlanificacion(form.value)
    volver()
  } catch (err) {
    console.error("Fallo al persistir la planificación estructurada:", err)
  }
}
</script>

<style>
.quill-wrapper .ql-toolbar.ql-snow {
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  border-color: #d1d5db;
  background-color: #f9fafb;
}
.quill-wrapper .ql-container.ql-snow {
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  border-color: #d1d5db;
  min-height: 200px;
  font-size: 0.875rem;
}
</style>
