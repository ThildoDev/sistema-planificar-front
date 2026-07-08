<template>

  <form @submit.prevent="handleSubmit" class="space-y-6 animate-in fade-in duration-200">
  <div class="bg-black text-green-400 p-4 rounded-xl text-xs font-mono my-4 max-h-40 overflow-y-auto">
  <p class="font-bold border-b border-green-800 pb-1 mb-1 text-white">🔍 DATOS RECIBIDOS EN EL FORMULARIO:</p>
  <pre>IsEdit: {{ isEdit }}</pre>
  <pre>CargadoInicial: {{ cargadoInicial }}</pre>
  <pre>Saberes en form: "{{ form.saberes }}"</pre>
  <pre>Datos crudos completos: {{ initialData }}</pre>
</div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-100 p-4 rounded-xl border border-slate-200 shadow-sm text-xs">
      <div>
        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Área / Espacio Curricular (Fijo) 🔒</label>
        <select
          v-model="form.areas_id"
          :disabled="isEdit"
          :class="isEdit ? 'bg-slate-50 text-slate-400 cursor-not-allowed select-none border-slate-200' : 'bg-white text-gray-900 border-gray-300'"
          class="w-full border rounded-lg px-3 py-2 text-sm outline-none transition-all font-medium"
        >
          <option value="" disabled>Seleccione un área...</option>
          <option v-for="a in listaAreas" :key="a.id" :value="a.id">{{ a.area }} ({{ a.tipo }})</option>
        </select>
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tipo de Planificación (Fijo) 🔒</label>
        <input
          v-model="form.tipo_planificacion"
          type="text"
          disabled
          class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none bg-slate-50 text-slate-400 font-semibold cursor-not-allowed select-none transition-all"
        />
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Fecha Límite de Presentación *</label>
        <input v-model="form.fecha_presentacion" type="date" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white" />
      </div>
    </div>

    <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs shadow-sm">
      <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Asignación de Cursado / Ciclo Lectivo *</label>
      <select v-model="form.persona_cargo_cursado_id" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none bg-white font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
        <option value="" disabled>Seleccione el cursado...</option>
        <option v-for="c in listaCursados" :key="c.id" :value="c.id">Año Lectivo: {{ c.anio_lectivo }}</option>
      </select>
    </div>

    <div class="space-y-5">
      <div class="space-y-1.5">
        <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider">Saberes y Ejes Temáticos del Área *</label>
        <div class="quill-wrapper">
          <QuillEditor v-if="cargadoInicial" :key="editorKey" v-model:value="form.saberes" contentType="html" :options="editorOptions" theme="snow" />
        </div>
      </div>

      <div class="space-y-1.5">
        <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider">Aprendizajes Esperados *</label>
        <div class="quill-wrapper">
          <QuillEditor v-if="cargadoInicial" :key="editorKey" v-model:value="form.aprendizajes_esperados" contentType="html" :options="editorOptions" theme="snow" />
        </div>
      </div>

      <div class="space-y-1.5">
        <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider">Criterios de Evaluación Específicos *</label>
        <div class="quill-wrapper">
          <QuillEditor v-if="cargadoInicial" :key="editorKey" v-model:value="form.criterios" contentType="html" :options="editorOptions" theme="snow" />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider">Diagnóstico Técnico del Grupo</label>
          <div class="quill-wrapper">
            <QuillEditor v-if="cargadoInicial" :key="editorKey" v-model:value="form.diagnostico" contentType="html" :options="editorOptions" theme="snow" />
          </div>
        </div>
        <div class="space-y-1.5">
          <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider">Bibliografía Aplicada</label>
          <div class="quill-wrapper">
            <QuillEditor v-if="cargadoInicial" :key="editorKey" v-model:value="form.bibliografia" contentType="html" :options="editorOptions" theme="snow" />
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-end gap-3 pt-4 border-t border-slate-100 bg-gray-50/50 p-4 rounded-xl">
      <button type="button" @click="$emit('cancel')" class="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors">Cancelar</button>

      <button
        type="button"
        @click.stop="handleSubmit"
        class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-600/10 transition-colors"
      >
        Guardar Modificaciones
      </button>
    </div>

  </form>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import api from '@/plugins/axios'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const props = defineProps({
  initialData: { type: Object, default: () => null },
  isEdit: { type: Boolean, default: false }
})

const emit = defineEmits(['submit', 'cancel'])

const listaAreas = ref([])
const listaCursados = ref([])
const cargadoInicial = ref(false)
const editorKey = ref(0)

const form = ref({
  fecha_presentacion: new Date().toISOString().split('T')[0],
  areas_id: '',
  persona_cargo_cursado_id: '',
  saberes: '<p></p>',
  aprendizajes_esperados: '<p></p>',
  criterios: '<p></p>',
  diagnostico: '<p></p>',
  bibliografia: '<p></p>',
  tipo_planificacion: 'Anual'
})


watch(() => props.initialData, (newData) => {
    if (!props.isEdit) {
      cargadoInicial.value = true
      return
    }

    if (props.isEdit && newData) {
      const source = newData
      const contenido = source.contenido || source

      if (source.fecha_presentacion) {
        const fechaRaw = String(source.fecha_presentacion)
        form.value.fecha_presentacion = fechaRaw.split('T')[0]
      } else {
        form.value.fecha_presentacion = new Date().toISOString().split('T')[0]
      }

      form.value.areas_id = source.areas_id || ''
      form.value.persona_cargo_cursado_id = source.persona_cargo_cursado_id || ''
      form.value.tipo_planificacion = source.tipo_planificacion || 'Anual'

      const limpiarTexto = (texto) => {
        if (!texto) return '<p></p>'
        const limpio = String(texto).trim()

        if (
          limpio === '—' ||
          limpio === '-' ||
          limpio === '' ||
          limpio === '<p>—</p>' ||
          limpio === '<p>-</p>' ||
          limpio === '<p><br></p>' ||
          limpio === '<p></p>'
        ) {
          return '<p></p>'
        }
        return texto
      }

      form.value.saberes = limpiarTexto(contenido.saberes)
      form.value.aprendizajes_esperados = limpiarTexto(contenido.aprendizajes_esperados)
      form.value.criterios = limpiarTexto(contenido.criterios)
      form.value.diagnostico = limpiarTexto(contenido.diagnostico)
      form.value.bibliografia = limpiarTexto(contenido.bibliografia)

      cargadoInicial.value = true

      nextTick(() => {
        editorKey.value++
      })
    }
  }, { immediate: true, deep: true })

onMounted(async () => {
  try {
    const resAreas = await api.get('/areas')
    listaAreas.value = resAreas.data.data || resAreas.data || []

    const resCursados = await api.get('/cursados')
    listaCursados.value = resCursados.data.data || resCursados.data || []
  } catch (err) {
    console.error("Error al cargar catálogos institucionales:", err)
  }
})

const handleSubmit = () => {
  if (!form.value.areas_id || !form.value.persona_cargo_cursado_id) {
    alert("⚠️ ALERTA: Debes seleccionar obligatoriamente un 'Área' y un 'Cursado'...");
    return;
  }

  // 🧼 Purgado simple: si está vacío real, enviamos string de texto vacío normal
  const limpiarSalida = (htmlString) => {
    if (!htmlString) return '';
    const textoLimpio = String(htmlString).trim();

    if (
      textoLimpio === '—' ||
      textoLimpio === '-' ||
      textoLimpio === '' ||
      textoLimpio === '<p><br></p>' ||
      textoLimpio === '<p></p>'
    ) {
      return '';
    }
    return htmlString;
  };

  const payload = {
    fecha_presentacion: form.value.fecha_presentacion,
    areas_id: form.value.areas_id,
    persona_cargo_cursado_id: form.value.persona_cargo_cursado_id,
    saberes: limpiarSalida(form.value.saberes),
    aprendizajes_esperados: limpiarSalida(form.value.aprendizajes_esperados),
    criterios: limpiarSalida(form.value.criterios),
    diagnostico: limpiarSalida(form.value.diagnostico),
    bibliografia: limpiarSalida(form.value.bibliografia),
    tipo_planificacion: form.value.tipo_planificacion
  }

  emit('submit', payload)
}

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
  placeholder: 'Redacte el development didáctico aquí...'
}
</script>

<style>
.quill-wrapper .ql-toolbar.ql-snow { border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem; border-color: #cbd5e1; background-color: #f8fafc; }
.quill-wrapper .ql-container.ql-snow { border-bottom-left-radius: 0.5rem; border-bottom-right-radius: 0.5rem; border-color: #cbd5e1; min-height: 180px; font-size: 0.875rem; }
</style>
