<template>
  <form class="plan-form" @submit.prevent="handleSubmit" novalidate>
    <!-- Row 1: Área + Tipo + Fecha -->
    <div class="form-grid form-grid-3">
      <div class="form-group" :class="{ 'form-group--error': errors.area_curricular }">
        <label class="form-label" for="area_curricular">
          Área Curricular <span class="required">*</span>
        </label>
        <select
          id="area_curricular"
          v-model="form.area_curricular"
          class="form-control"
          :class="{ 'input-error': errors.area_curricular }"
        >
          <option value="">— Seleccioná un área —</option>
          <option v-for="area in AREAS" :key="area" :value="area">{{ area }}</option>
        </select>
        <span v-if="errors.area_curricular" class="error-msg">
          <AlertCircle :size="12" /> {{ errors.area_curricular }}
        </span>
      </div>

      <div class="form-group" :class="{ 'form-group--error': errors.tipo_planificacion }">
        <label class="form-label" for="tipo_planificacion">
          Tipo de Planificación <span class="required">*</span>
        </label>
        <select
          id="tipo_planificacion"
          v-model="form.tipo_planificacion"
          class="form-control"
          :class="{ 'input-error': errors.tipo_planificacion }"
        >
          <option value="">— Seleccioná el tipo —</option>
          <option value="Anual">Anual</option>
          <option value="Trimestral">Trimestral</option>
        </select>
        <span v-if="errors.tipo_planificacion" class="error-msg">
          <AlertCircle :size="12" /> {{ errors.tipo_planificacion }}
        </span>
      </div>

      <div class="form-group" :class="{ 'form-group--error': errors.fecha_presentacion }">
        <label class="form-label" for="fecha_presentacion">
          Fecha de Presentación <span class="required">*</span>
        </label>
        <input
          id="fecha_presentacion"
          type="date"
          v-model="form.fecha_presentacion"
          class="form-control"
          :class="{ 'input-error': errors.fecha_presentacion }"
        />
        <span v-if="errors.fecha_presentacion" class="error-msg">
          <AlertCircle :size="12" /> {{ errors.fecha_presentacion }}
        </span>
      </div>
    </div>

    <!-- Textareas section -->
    <div v-for="field in textareaFields" :key="field.key" class="form-group" :class="{ 'form-group--error': errors[field.key] }">
      <div class="textarea-label-row">
        <label class="form-label" :for="field.key">
          {{ field.label }} <span class="required">*</span>
        </label>
        <span class="char-counter" :class="charCounterClass(form[field.key], field.max)">
          {{ form[field.key]?.length || 0 }} / {{ field.max }}
        </span>
      </div>
      <textarea
        :id="field.key"
        v-model="form[field.key]"
        class="form-control form-textarea"
        :class="{ 'input-error': errors[field.key] }"
        :placeholder="field.placeholder"
        :maxlength="field.max"
        rows="4"
      ></textarea>
      <span v-if="errors[field.key]" class="error-msg">
        <AlertCircle :size="12" /> {{ errors[field.key] }}
      </span>
    </div>

    <!-- Hidden docente ID info -->
    <div class="form-info-row">
      <div class="form-info-chip">
        <User :size="13" />
        <span>Docente: <strong>{{ authStore.user?.name }}</strong></span>
      </div>
      <div class="form-info-chip">
        <Hash :size="13" />
        <span>ID: <strong>{{ authStore.user?.id }}</strong></span>
      </div>
    </div>

    <!-- Actions -->
    <div class="form-actions">
      <button type="button" class="btn-secondary" @click="$emit('cancel')">
        <X :size="15" />
        Cancelar
      </button>
      <button type="submit" class="btn-primary">
        <Send :size="15" />
        {{ isEdit ? 'Guardar Cambios' : 'Guardar y Enviar' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { AlertCircle, User, Hash, X, Send } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const AREAS = [
  'Matemática',
  'Lengua y Literatura',
  'Ciencias Naturales',
  'Ciencias Sociales',
  'Educación Física',
  'Educación Artística',
  'Tecnología',
  'Inglés',
  'Formación Ética y Ciudadana',
  'Informática'
]

const textareaFields = [
  {
    key: 'diagnostico_grupo',
    label: 'Diagnóstico del Grupo',
    placeholder: 'Describí las características generales del grupo, nivel de desempeño, necesidades detectadas...',
    max: 1500
  },
  {
    key: 'aprendizajes_esperados',
    label: 'Aprendizajes Esperados',
    placeholder: 'Indicá qué se espera que los alumnos aprendan al finalizar el período...',
    max: 1500
  },
  {
    key: 'saberes_contenidos',
    label: 'Saberes / Contenidos',
    placeholder: 'Listá los contenidos curriculares a trabajar, organizados por ejes temáticos...',
    max: 2000
  },
  {
    key: 'criterios_evaluacion',
    label: 'Criterios de Evaluación',
    placeholder: 'Describí de qué forma se evaluará el aprendizaje de los alumnos...',
    max: 1500
  },
  {
    key: 'bibliografia',
    label: 'Bibliografía',
    placeholder: 'Referenciá los libros, cuadernillos, recursos digitales y materiales a utilizar...',
    max: 1000
  }
]

const props = defineProps({
  initialData: {
    type: Object,
    default: null
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

const authStore = useAuthStore()

const form = reactive({
  area_curricular: '',
  tipo_planificacion: '',
  fecha_presentacion: '',
  diagnostico_grupo: '',
  aprendizajes_esperados: '',
  saberes_contenidos: '',
  criterios_evaluacion: '',
  bibliografia: '',
  persona_cargo_cursado_id: authStore.user?.id
})

const errors = reactive({})

// Populate form when editing
watch(() => props.initialData, (data) => {
  if (data) {
    Object.keys(form).forEach(key => {
      if (data[key] !== undefined) form[key] = data[key]
    })
  }
}, { immediate: true })

function charCounterClass(value, max) {
  const len = value?.length || 0
  if (len >= max) return 'char-counter--full'
  if (len >= max * 0.85) return 'char-counter--warning'
  return ''
}

function validate() {
  Object.keys(errors).forEach(k => delete errors[k])
  let valid = true

  if (!form.area_curricular) { errors.area_curricular = 'Seleccioná un área curricular.'; valid = false }
  if (!form.tipo_planificacion) { errors.tipo_planificacion = 'Seleccioná el tipo de planificación.'; valid = false }
  if (!form.fecha_presentacion) { errors.fecha_presentacion = 'Indicá la fecha de presentación.'; valid = false }
  if (!form.diagnostico_grupo?.trim()) { errors.diagnostico_grupo = 'El diagnóstico del grupo es requerido.'; valid = false }
  if (!form.aprendizajes_esperados?.trim()) { errors.aprendizajes_esperados = 'Los aprendizajes esperados son requeridos.'; valid = false }
  if (!form.saberes_contenidos?.trim()) { errors.saberes_contenidos = 'Los saberes/contenidos son requeridos.'; valid = false }
  if (!form.criterios_evaluacion?.trim()) { errors.criterios_evaluacion = 'Los criterios de evaluación son requeridos.'; valid = false }
  if (!form.bibliografia?.trim()) { errors.bibliografia = 'La bibliografía es requerida.'; valid = false }

  return valid
}

function handleSubmit() {
  if (!validate()) {
    // Scroll to first error
    setTimeout(() => {
      const el = document.querySelector('.input-error')
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 50)
    return
  }
  emit('submit', { ...form })
}
</script>

<style scoped>
.plan-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-grid {
  display: grid;
  gap: 1rem;
}

.form-grid-3 {
  grid-template-columns: repeat(3, 1fr);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: #374151;
  letter-spacing: 0.01em;
}

.required {
  color: #ef4444;
  margin-left: 2px;
}

.form-control {
  padding: 0.6rem 0.85rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #1a202c;
  background: #ffffff;
  transition: border-color 0.15s, box-shadow 0.15s;
  outline: none;
  font-family: inherit;
}

.form-control:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59,130,246,0.12);
}

.form-control::placeholder { color: #94a3b8; }

.input-error {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 3px rgba(239,68,68,0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  line-height: 1.6;
}

.textarea-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.char-counter {
  font-size: 0.73rem;
  color: #94a3b8;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}

.char-counter--warning { color: #d97706; }
.char-counter--full { color: #ef4444; font-weight: 700; }

.error-msg {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  color: #ef4444;
  font-weight: 500;
}

.form-info-row {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.form-info-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.75rem;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  font-size: 0.78rem;
  color: #64748b;
}

.form-info-chip strong { color: #1a202c; }

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 0.5rem;
  border-top: 1px solid #f1f5f9;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.65rem 1.25rem;
  background: #1e3a5f;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
  box-shadow: 0 2px 8px rgba(30,58,95,0.25);
}

.btn-primary:hover {
  background: #2d5282;
  transform: translateY(-1px);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.65rem 1.1rem;
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-secondary:hover { background: #e2e8f0; }

@media (max-width: 768px) {
  .form-grid-3 { grid-template-columns: 1fr; }
}
</style>
