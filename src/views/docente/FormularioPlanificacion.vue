<template>
  <div class="max-w-5xl mx-auto space-y-6 pb-12">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-xl border border-gray-200 shadow-sm gap-4">
      <div>
        <button @click="volver" class="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 mb-1">
          ← Volver al Dashboard
        </button>
        <h1 class="text-xl font-bold text-gray-900">Estructurar Planificación Anual Unificada</h1>
        <p class="text-sm text-gray-500">Agregá múltiples áreas y revisá la integración total antes de sincronizar con el servidor central.</p>
      </div>

      <div class="flex bg-gray-100 p-1 rounded-lg border border-gray-200 self-start sm:self-center">
        <button
          type="button"
          @click="modoVista = 'redaccion'"
          :class="modoVista === 'redaccion' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'"
          class="px-4 py-1.5 rounded-md text-xs font-bold transition-all"
        >
          📝 Redactar Áreas
        </button>
        <button
          type="button"
          @click="modoVista = 'previsualizacion'"
          :class="modoVista === 'previsualizacion' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'"
          class="px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1"
        >
          👁️ Previsualizar Todo ({{ areasAgregadas.length }})
        </button>
      </div>
    </div>

    <div v-if="errorLocal || planificacionStore.error" class="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-3">
      <span>⚠️</span>
      <p class="font-medium">{{ errorLocal || planificacionStore.error }}</p>
    </div>

    <div class="bg-gray-50 p-5 rounded-xl border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4 opacity-80 text-xs">
      <div>
        <span class="block font-bold text-gray-400 uppercase tracking-wider mb-1">Docente</span>
        <p class="font-semibold text-gray-700 bg-gray-100 border border-gray-200 rounded-lg px-3 py-2">{{ authStore.user?.name || 'Docente Activo' }}</p>
      </div>
      <div>
        <span class="block font-bold text-gray-400 uppercase tracking-wider mb-1">Periodo Escolar</span>
        <p class="font-semibold text-gray-700 bg-gray-100 border border-gray-200 rounded-lg px-3 py-2">Ciclo Lectivo 2026</p>
      </div>
      <div>
        <span class="block font-bold text-gray-400 uppercase tracking-wider mb-1">Estado de Carga</span>
        <p class="font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 uppercase tracking-wide">Borrador Temporal Local</p>
      </div>
    </div>

    <div v-if="modoVista === 'redaccion'" class="space-y-6">

      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Seleccionar Área / Espacio *</label>
          <select v-model="areaForm.areas_id" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white font-medium">
            <option value="" disabled>Seleccione un área...</option>
            <option v-for="a in listaAreas" :key="a.id" :value="a.id">{{ a.area }} ({{ a.tipo }})</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Asignación de Cursado *</label>
          <select v-model="areaForm.cursado_id" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white font-medium">
            <option value="" disabled>Seleccione el cursado...</option>
            <option v-for="c in listaCursados" :key="c.id" :value="c.id">Año Lectivo: {{ c.anio_lectivo }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Fecha Límite de Presentación *</label>
          <input v-model="areaForm.fecha_presentacion" type="date" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-medium" />
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        <div class="space-y-2">
          <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Saberes y Ejes Temáticos del Área *</label>
          <div class="quill-wrapper">
            <QuillEditor v-model:content="areaForm.saberes" contentType="html" :options="editorOptions" theme="snow" />
          </div>
        </div>

        <div class="space-y-2">
          <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Aprendizajes Esperados *</label>
          <div class="quill-wrapper">
            <QuillEditor v-model:content="areaForm.aprendizajes_esperados" contentType="html" :options="editorOptions" theme="snow" />
          </div>
        </div>

        <div class="space-y-2">
          <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Criterios de Evaluación Específicos *</label>
          <div class="quill-wrapper">
            <QuillEditor v-model:content="areaForm.criterios" contentType="html" :options="editorOptions" theme="snow" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div class="space-y-2">
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Diagnóstico Técnico del Grupo</label>
            <div class="quill-wrapper">
              <QuillEditor v-model:content="areaForm.diagnostico" contentType="html" :options="editorOptions" theme="snow" />
            </div>
          </div>
          <div class="space-y-2">
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Bibliografía Aplicada</label>
            <div class="quill-wrapper">
              <QuillEditor v-model:content="areaForm.bibliografia" contentType="html" :options="editorOptions" theme="snow" />
            </div>
          </div>
        </div>

        <div class="flex justify-end pt-2">
          <button
            type="button"
            @click="agregarAreaTemporal"
            class="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-md shadow-green-600/10 flex items-center gap-1.5"
          >
            ➕ Añadir Área a la Planificación Anual
          </button>
        </div>
      </div>

      <div v-if="areasAgregadas.length > 0" class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider">Estructura Actual Solapada en Memoria</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div v-for="(item, index) in areasAgregadas" :key="index" class="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div class="flex items-center gap-2.5">
              <span class="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">{{ index + 1 }}</span>
              <div>
                <p class="text-sm font-bold text-gray-800">{{ obtenerNombreArea(item.areas_id) }}</p>
                <p class="text-xxs font-semibold text-gray-400 uppercase tracking-wider">Presentación: {{ item.fecha_presentacion }}</p>
              </div>
            </div>
            <button type="button" @click="removerAreaTemporal(index)" class="text-red-500 hover:text-red-700 text-sm font-bold px-2 py-1">&times;</button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-8 animate-in fade-in duration-200">
      <div class="border-b border-gray-100 pb-4 flex justify-between items-center">
        <div>
          <h2 class="text-lg font-bold text-gray-900">Vista Previa del Documento Anual</h2>
          <p class="text-xs text-gray-500">Así es cómo visualizará el Director de Estudios la estructura pedagógica integrada.</p>
        </div>
        <span class="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xxs font-bold uppercase tracking-wider">Vista de Preevaluación</span>
      </div>

      <div v-if="areasAgregadas.length === 0" class="py-12 text-center text-gray-400 font-medium text-sm">
        No has añadido ningún área todavía. Regresa a la pestaña de redacción para añadir contenido.
      </div>

      <div v-else class="space-y-12 divide-y divide-gray-100">
        <div v-for="(item, idx) in areasAgregadas" :key="idx" :class="idx > 0 ? 'pt-8' : ''" class="space-y-4">
          <div class="flex items-center gap-3">
            <span class="px-2.5 py-1 bg-gray-900 text-white rounded-lg text-xs font-black">ÁREA {{ idx + 1 }}</span>
            <h3 class="text-base font-extrabold text-slate-800">{{ obtenerNombreArea(item.areas_id) }}</h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div class="bg-slate-50/50 p-4 rounded-xl border border-gray-100 space-y-2">
              <h4 class="text-xs font-bold text-blue-600 uppercase tracking-wider">📚 Saberes y Contenidos Coorporativos</h4>
              <div class="prose prose-sm text-gray-700 font-normal" v-html="item.saberes"></div>
            </div>
            <div class="bg-slate-50/50 p-4 rounded-xl border border-gray-100 space-y-2">
              <h4 class="text-xs font-bold text-emerald-600 uppercase tracking-wider">🎯 Aprendizajes de Competencia Esperados</h4>
              <div class="prose prose-sm text-gray-700 font-normal" v-html="item.aprendizajes_esperados"></div>
            </div>
          </div>

          <div class="bg-slate-50/30 p-4 rounded-xl border border-gray-100 text-sm space-y-2">
            <h4 class="text-xs font-bold text-purple-600 uppercase tracking-wider">📋 Criterios de Evaluación e Instrumentos</h4>
            <div class="prose prose-sm text-gray-700 font-normal" v-html="item.criterios"></div>
          </div>

          <div v-if="item.diagnostico || item.bibliografia" class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-500 italic">
            <div v-if="item.diagnostico"><strong>Diagnóstico de origen:</strong> <span v-html="item.diagnostico"></span></div>
            <div v-if="item.bibliografia"><strong>Referencias:</strong> <span v-html="item.bibliografia"></span></div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-end gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
      <button type="button" @click="volver" class="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors">
        Cancelar Todo
      </button>
      <button
        type="button"
        @click="confirmarGuardadoCompleto"
        :disabled="areasAgregadas.length === 0 || planificacionStore.loading"
        class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-lg shadow-blue-600/10"
      >
        <span v-if="planificacionStore.loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        Confirmar y Guardar Planificación  ({{ areasAgregadas.length }} Áreas)
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePlanificacionStore } from '@/stores/planificacion'
import { useAuthStore } from '@/stores/auth'
import api from '@/plugins/axios'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const router = useRouter()
const route = useRoute()
const planificacionStore = usePlanificacionStore()
const authStore = useAuthStore()

const modoVista = ref('redaccion')
const listaAreas = ref([])
const listaCursados = ref([])
const errorLocal = ref(null)

// 🔑 Forzador de reactividad para limpiar Quill sin dejar residuos en el DOM
const editorKey = ref(0)

// Detectar si estamos editando un registro existente
const esEdicion = computed(() => !!route.params.id)

// 📦 Arreglo que acumula las áreas
const areasAgregadas = ref([])

// Formulario limpio para redactar o editar
const areaForm = ref({
  fecha_presentacion: new Date().toISOString().split('T')[0],
  areas_id: '',
  cursado_id: '',
  saberes: '',
  aprendizajes_esperados: '',
  criterios: '',
  diagnostico: '',
  bibliografia: ''
})

onMounted(async () => {
  try {
    errorLocal.value = null

    const resAreas = await api.get('/areas')
    listaAreas.value = Array.isArray(resAreas.data) ? resAreas.data : resAreas.data.data || []

    const resCursados = await api.get('/cursados')
    listaCursados.value = Array.isArray(resCursados.data) ? resCursados.data : resCursados.data.data || []

    if (esEdicion.value) {
      const idPlanificacion = route.params.id
      const res = await api.get(`/planificaciones/${idPlanificacion}`)
      const p = res.data

      // Seteamos el formulario garantizando strings limpios
      areaForm.value = {
        id: p.id,
        fecha_presentacion: p.fecha_presentacion ? String(p.fecha_presentacion).split('T')[0] : new Date().toISOString().split('T')[0],
        areas_id: p.areas_id,
        cursado_id: p.persona_cargo_cursado_id,
        saberes: p.saberes || '',
        aprendizajes_esperados: p.aprendizajes_esperados || '',
        criterios: p.criterios || '',
        diagnostico: p.diagnostico || '',
        bibliografia: p.bibliografia || ''
      }

      areasAgregadas.value = [{ ...areaForm.value }]

      // 🟢 FORZAMOS A VUE A RE-RENDERIZAR LAS INSTANCIAS DE QUILL CON LOS DATOS TRÍDOS DE LARAVEL
      nextTick(() => {
        editorKey.value++
      })
    }
  } catch (err) {
    console.error("Fallo de sincronización:", err)
    errorLocal.value = "Error de enlace al sincronizar o recuperar los datos desde Laravel."
  }
})

// Función para solapar/acoplar el área actual al listado en memoria
const agregarAreaTemporal = () => {
  if (esEdicion.value) {
    // Si estamos editando, actualizamos directamente el bloque en el listado acumulativo
    areasAgregadas.value[0] = { ...areaForm.value }
    modoVista.value = 'previsualizacion'
    return
  }

  if (!areaForm.value.areas_id || !areaForm.value.cursado_id || !areaForm.value.saberes) {
    errorLocal.value = "Por favor, completa los campos del área y escribe el contenido antes de acoplar."
    return
  }

  const duplicado = areasAgregadas.value.some(a => a.areas_id === areaForm.value.areas_id)
  if (duplicado) {
    errorLocal.value = "Este espacio curricular ya se encuentra solapado en la propuesta anual actual."
    return
  }

  errorLocal.value = null
  areasAgregadas.value.push({ ...areaForm.value })

  // Reseteo del formulario aplicando destrucción limpia de los Quill Editors mediante cambios de Key
  areaForm.value.areas_id = ''
  areaForm.value.saberes = ''
  areaForm.value.aprendizajes_esperados = ''
  areaForm.value.criterios = ''
  areaForm.value.diagnostico = ''
  areaForm.value.bibliografia = ''

  nextTick(() => {
    editorKey.value++ // Rompe y reconstruye instancias Quill totalmente vacías
  })
}

const removerAreaTemporal = (index) => {
  if (esEdicion.value) return // Impedir remover el bloque único si estamos editando
  areasAgregadas.value.splice(index, 1)
}

const obtenerNombreArea = (id) => {
  const areaObj = listaAreas.value.find(a => a.id === id)
  return areaObj ? areaObj.area : `Área #${id}`
}

// Recibimos el objeto "datosActualizados" desde el emit del formulario hijo
const confirmarGuardadoCompleto = async (datosActualizados = null) => {
  if (!esEdicion.value && areasAgregadas.value.length === 0) return

  try {
    errorLocal.value = null
    planificacionStore.loading = true

    if (esEdicion.value) {
      // Usamos prioritariamente los datos del formulario si vienen en el evento, sino el bloque inicial
      const origen = datosActualizados || areasAgregadas.value[0]
      const idPlanificacion = route.params.id

      await api.put(`/planificaciones/${idPlanificacion}`, {
        fecha_presentacion: origen.fecha_presentacion,
        areas_id: origen.areas_id,
        persona_cargo_cursado_id: origen.persona_cargo_cursado_id || origen.cursado_id,
        tipo_planificacion: 'Anual',
        saberes: origen.saberes,
        aprendizajes_esperados: origen.aprendizajes_esperados,
        criterios: origen.criterios,
        bibliografia: origen.bibliografia || 'Sin especificar',
        diagnostico: origen.diagnostico || 'Sin especificar'
      })
    } else {
      // MODO CREACIÓN (Bucle secuencial masivo)
      for (const bloque of areasAgregadas.value) {
        await planificacionStore.createPlanificacion({
          fecha_presentacion: bloque.fecha_presentacion,
          areas_id: bloque.areas_id,
          persona_cargo_cursado_id: bloque.cursado_id,
          tipo_planificacion: 'Anual',
          saberes: bloque.saberes,
          aprendizajes_esperados: bloque.aprendizajes_esperados,
          criterios: bloque.criterios,
          bibliografia: bloque.bibliografia || 'Sin especificar',
          diagnostico: bloque.diagnostico || 'Sin especificar'
        })
      }
    }

    volver()
  } catch (err) {
    console.error("Fallo en la sincronización final con la Base de Datos:", err)
    errorLocal.value = "Ocurrió un error al intentar guardar los bloques en el servidor. Revisa las columnas de validación."
  } finally {
    planificacionStore.loading = false
  }
}

const editorOptions = {
  modules: {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['clean']
    ]
  },
  placeholder: 'Comience a detallar el desarrollo pedagógico aquí con formato enriquecido...'
}

const volver = () => {
  router.push('/planificaciones')
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
  min-height: 190px;
  font-size: 0.875rem;
}
/* Utilidad estilística para las etiquetas v-html de previsualización */
.prose ul { list-style-type: disk; padding-left: 1.25rem; }
.prose ol { list-style-type: decimal; padding-left: 1.25rem; }
.prose strong { font-weight: 700; }
.text-xxs { font-size: 0.65rem; }
</style>
