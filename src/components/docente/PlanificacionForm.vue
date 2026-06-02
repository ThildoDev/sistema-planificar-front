<template>
  <div class="form-card">
    <form @submit.prevent="handlePreSubmit" novalidate>
      <div class="form-grid">

        <div class="form-group" :class="{ 'has-error': errors.area }">
          <label class="form-label">Área Curricular *</label>
          <select v-model="form.area" class="form-input select-input" :disabled="loading">
            <option value="">Seleccione un área...</option>
            <option v-for="area in areasCurriculares" :key="area" :value="area">
              {{ area }}
            </option>
          </select>
          <span v-if="errors.area" class="field-error">{{ errors.area }}</span>
        </div>

        <div class="form-group" :class="{ 'has-error': errors.tipo }">
          <label class="form-label">Tipo de Planificación *</label>
          <select v-model="form.tipo" class="form-input select-input" :disabled="loading">
            <option value="">Seleccione tipo...</option>
            <option value="Anual">Anual</option>
            <option value="Trimestral">Trimestral</option>
          </select>
          <span v-if="errors.tipo" class="field-error">{{ errors.tipo }}</span>
        </div>

        <div class="form-group" :class="{ 'has-error': errors.fecha }">
          <label class="form-label">Fecha de Presentación *</label>
          <input
            v-model="form.fecha"
            type="date"
            class="form-input"
            :disabled="loading"
          />
          <span v-if="errors.fecha" class="field-error">{{ errors.fecha }}</span>
        </div>

      </div>

      <div class="textarea-section">

        <div class="form-group" :class="{ 'has-error': errors.diagnostico }">
          <div class="label-wrapper">
            <label class="form-label">Diagnóstico del Grupo *</label>
            <span class="char-counter">{{ form.diagnostico.length }} / 2000</span>
          </div>
          <textarea
            v-model="form.diagnostico"
            maxlength="2000"
            placeholder="Describa brevemente la realidad áulica y el punto de partida del grupo..."
            class="form-textarea"
            :disabled="loading"
          ></textarea>
          <span v-if="errors.diagnostico" class="field-error">{{ errors.diagnostico }}</span>
        </div>

        <div class="form-group" :class="{ 'has-error': errors.aprendizajes }">
          <div class="label-wrapper">
            <label class="form-label">Aprendizajes Esperados *</label>
            <span class="char-counter">{{ form.aprendizajes.length }} / 3000</span>
          </div>
          <textarea
            v-model="form.aprendizajes"
            maxlength="3000"
            placeholder="Objetivos fundamentales y metas de logro esperadas..."
            class="form-textarea"
            :disabled="loading"
          ></textarea>
          <span v-if="errors.aprendizajes" class="field-error">{{ errors.aprendizajes }}</span>
        </div>

        <div class="form-group" :class="{ 'has-error': errors.saberes }">
          <div class="label-wrapper">
            <label class="form-label">Saberes / Contenidos *</label>
            <span class="char-counter">{{ form.saberes.length }} / 4000</span>
          </div>
          <textarea
            v-model="form.saberes"
            maxlength="4000"
            placeholder="Ejes de contenidos curriculares a dictar..."
            class="form-textarea"
            :disabled="loading"
          ></textarea>
          <span v-if="errors.saberes" class="field-error">{{ errors.saberes }}</span>
        </div>

        <div class="form-group" :class="{ 'has-error': errors.evaluacion }">
          <div class="label-wrapper">
            <label class="form-label">Criterios de Evaluación *</label>
            <span class="char-counter">{{ form.evaluacion.length }} / 2000</span>
          </div>
          <textarea
            v-model="form.evaluacion"
            maxlength="2000"
            placeholder="Estrategias, indicadores e instrumentos de evaluación..."
            class="form-textarea"
            :disabled="loading"
          ></textarea>
          <span v-if="errors.evaluacion" class="field-error">{{ errors.evaluacion }}</span>
        </div>

        <div class="form-group" :class="{ 'has-error': errors.bibliografia }">
          <div class="label-wrapper">
            <label class="form-label">Bibliografía *</label>
            <span class="char-counter">{{ form.bibliografia.length }} / 1000</span>
          </div>
          <textarea
            v-model="form.bibliografia"
            maxlength="1000"
            placeholder="Materiales de consulta tanto para el docente como para el estudiante..."
            class="form-textarea"
            :disabled="loading"
          ></textarea>
          <span v-if="errors.bibliografia" class="field-error">{{ errors.bibliografia }}</span>
        </div>

      </div>

      <div class="form-actions">
        <button
          type="button"
          class="btn-secondary"
          @click="handleCancelar"
          :disabled="loading"
        >
          <ArrowLeft :size="16" /> Volver
        </button>
        <button
          type="submit"
          class="btn-primary"
          :disabled="loading"
        >
          <Save :size="16" /> Salvar Datos
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { ArrowLeft, Save } from 'lucide-vue-next'

defineProps({
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['submit', 'cancelar'])

// Mock de las 10 Áreas Curriculares del sistema
const areasCurriculares = [
  'Matemática', 'Prácticas del Lenguaje', 'Ciencias Naturales', 'Ciencias Sociales',
  'Inglés', 'Educación Física', 'Educación Artística (Plástica)',
  'Educación Artística (Música)', 'Tecnología', 'Formación Ética y Ciudadana'
]

const form = reactive({
  area: '',
  tipo: '',
  fecha: '',
  diagnostico: '',
  aprendizajes: '',
  saberes: '',
  evaluacion: '',
  bibliografia: ''
})

const errors = reactive({
  area: '',
  tipo: '',
  fecha: '',
  diagnostico: '',
  aprendizajes: '',
  saberes: '',
  evaluacion: '',
  bibliografia: ''
})

function validate() {
  let valid = true
  // Resetear estados de error
  Object.keys(errors).forEach(key => errors[key] = '')

  if (!form.area) { errors.area = 'El área curricular es obligatoria.'; valid = false; }
  if (!form.tipo) { errors.tipo = 'Debe seleccionar el tipo de planificación.'; valid = false; }
  if (!form.fecha) { errors.fecha = 'La fecha de presentación es requerida.'; valid = false; }

  // Validar textareas requeridas
  if (!form.diagnostico) { errors.diagnostico = 'El diagnóstico es requerido.'; valid = false; }
  if (!form.aprendizajes) { errors.aprendizajes = 'Los aprendizajes esperados son obligatorios.'; valid = false; }
  if (!form.saberes) { errors.saberes = 'La grilla de contenidos/saberes no puede estar vacía.'; valid = false; }
  if (!form.evaluacion) { errors.evaluacion = 'Los criterios de evaluación son requeridos.'; valid = false; }
  if (!form.bibliografia) { errors.bibliografia = 'La bibliografía de soporte es obligatoria.'; valid = false; }

  return valid
}

function handlePreSubmit() {
  if (!validate()) return
  // Emitimos los datos limpios si la validación pasa al 100%
  emit('submit', { ...form })
}

function handleCancelar() {
  emit('cancelar')
}
</script>

<style scoped>
.form-card {
  background: #fff;
  border-radius: 12px;
  padding: 1.75rem;
  border: 1px solid #e2e8f0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.textarea-section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.label-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.char-counter {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 500;
}

.form-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #374151;
}

.form-input {
  width: 100%;
  height: 40px;
  padding: 0 0.875rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #0f172a;
  background: #f8fafc;
  outline: none;
  transition: border-color 0.2s, background-color 0.2s;
}

.select-input {
  cursor: pointer;
}

.form-textarea {
  width: 100%;
  min-height: 100px;
  padding: 0.75rem 0.875rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #0f172a;
  background: #f8fafc;
  outline: none;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s, background-color 0.2s;
}

.form-input:focus,
.form-textarea:focus {
  border-color: #2563eb;
  background: #fff;
}

.has-error .form-input,
.has-error .form-textarea {
  border-color: #ef4444;
  background: #fef2f2;
}

.field-error {
  font-size: 0.75rem;
  color: #ef4444;
  font-weight: 500;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 2rem;
  padding-top: 1.25rem;
  border-top: 1px solid #f1f5f9;
}

.btn-primary,
.btn-secondary {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.55rem 1.25rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #2563eb;
  color: #fff;
}
.btn-primary:hover:not(:disabled) {
  background: #1d4ed8;
}

.btn-secondary {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
}
.btn-secondary:hover:not(:disabled) {
  background: #e2e8f0;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
