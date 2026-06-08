<!-- src/components/director/ObservacionForm.vue -->
<template>
  <div class="observacion-form" :class="`observacion-form--${modo}`">
    <!-- Header -->
    <div class="form-header">
      <component :is="modoConfig.icon" class="form-icon" />
      <div>
        <h3 class="form-titulo">{{ modoConfig.titulo }}</h3>
        <p class="form-subtitulo">{{ modoConfig.subtitulo }}</p>
      </div>
    </div>

    <form class="form-body" @submit.prevent="enviar">
      <!-- ── CATEGORÍA (radio requerido) ── -->
      <fieldset class="campo-fieldset">
        <legend class="campo-legend">Categoría <span class="req">*</span></legend>
        <div class="categorias-grid">
          <label
            v-for="cat in categorias"
            :key="cat.value"
            class="categoria-opcion"
            :class="{ 'categoria-opcion--activa': form.categoria === cat.value }"
          >
            <input
              v-model="form.categoria"
              type="radio"
              :value="cat.value"
              class="categoria-radio"
              @change="validarCampos"
            />
            <component :is="cat.icon" class="cat-icon" />
            <span class="cat-label">{{ cat.label }}</span>
          </label>
        </div>
        <!-- Error de validación de categoría -->
        <p v-if="errores.categoria" class="campo-error">
          {{ errores.categoria }}
        </p>
      </fieldset>

      <!-- ── TEXTAREA de observación ── -->
      <div class="campo-grupo">
        <label class="campo-label" for="obs-textarea">
          Observación <span class="req">*</span>
        </label>

        <div class="textarea-wrapper" :class="{ 'textarea-wrapper--error': errores.observacion }">
          <textarea
            id="obs-textarea"
            v-model="form.observacion"
            class="obs-textarea"
            :placeholder="modoConfig.placeholder"
            rows="6"
            maxlength="500"
            @input="validarCampos"
          />
          <!-- Contador en tiempo real -->
          <div class="contador" :class="claseContador">{{ form.observacion.length }}/500</div>
        </div>

        <!-- Barra de progreso de mínimo -->
        <div class="progreso-wrapper">
          <div
            class="progreso-barra"
            :style="{ width: `${progresoMinimo}%` }"
            :class="claseProgreso"
          />
        </div>

        <!-- Mensaje de progreso -->
        <p class="progreso-msg" :class="{ 'progreso-msg--ok': cumpleMinimo }">
          <template v-if="!cumpleMinimo">
            Mínimo 30 caracteres (faltan {{ 30 - form.observacion.length }} más)
          </template>
          <template v-else>
            <CheckCircle class="progreso-ok-icon" />
            Longitud suficiente
          </template>
        </p>

        <p v-if="errores.observacion" class="campo-error">
          {{ errores.observacion }}
        </p>
      </div>

      <!-- ── Error de backend (403 u otro) ── -->
      <div v-if="errorBackend" class="error-backend">
        <AlertCircle class="error-backend-icon" />
        <div>
          <p class="error-backend-titulo">Error al enviar</p>
          <p class="error-backend-msg">{{ errorBackend }}</p>
        </div>
      </div>

      <!-- ── Estado del formulario (resumen de validación) ── -->
      <div class="validacion-resumen">
        <div class="validacion-item" :class="{ ok: form.categoria }">
          <CheckCircle v-if="form.categoria" class="vitem-icon ok" />
          <Circle v-else class="vitem-icon" />
          Categoría seleccionada
        </div>
        <div class="validacion-item" :class="{ ok: cumpleMinimo }">
          <CheckCircle v-if="cumpleMinimo" class="vitem-icon ok" />
          <Circle v-else class="vitem-icon" />
          Observación con mínimo 30 caracteres
        </div>
      </div>

      <!-- ── Acciones ── -->
      <div class="form-acciones">
        <button type="button" class="btn-cancelar" :disabled="loading" @click="$emit('cancelar')">
          Cancelar
        </button>
        <button
          type="submit"
          class="btn-enviar"
          :class="`btn-enviar--${modo}`"
          :disabled="!formularioValido || loading"
          :title="!formularioValido ? 'Completá todos los campos requeridos' : ''"
        >
          <Loader2 v-if="loading" class="btn-icon spin" />
          <component :is="modoConfig.iconBoton" v-else class="btn-icon" />
          {{ loading ? 'Enviando...' : modoConfig.textoBoton }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import {
  MessageSquare,
  XCircle,
  CheckCircle,
  AlertCircle,
  Circle,
  Loader2,
  FileWarning,
  BookX,
  AlignLeft,
  AlertTriangle,
} from 'lucide-vue-next'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  /**
   * 'observacion' → solo observación sin cambiar estado
   * 'rechazo'     → rechaza con estado Rechazado
   */
  modo: {
    type: String,
    default: 'observacion',
    validator: (v) => ['observacion', 'rechazo'].includes(v),
  },
  /** Error del backend para mostrar (ej. 403) */
  backendError: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['enviar', 'cancelar'])

// ── Config por modo ──
const modoConfig = computed(() => {
  if (props.modo === 'rechazo') {
    return {
      titulo: 'Rechazar con observaciones',
      subtitulo: 'Detallá el motivo del rechazo. El docente recibirá estas observaciones.',
      placeholder:
        'Describí detalladamente por qué se rechaza la planificación y qué debe corregirse...',
      textoBoton: 'Rechazar planificación',
      icon: XCircle,
      iconBoton: XCircle,
    }
  }
  return {
    titulo: 'Enviar observación',
    subtitulo: 'Tu observación será registrada en el historial sin cambiar el estado.',
    placeholder:
      'Escribí tu observación sobre la planificación. Sé específico para que el docente pueda mejorarla...',
    textoBoton: 'Enviar observación',
    icon: MessageSquare,
    iconBoton: MessageSquare,
  }
})

// ── Categorías disponibles ──
const categorias = [
  {
    value: 'contenido',
    label: 'Contenido',
    icon: AlignLeft,
  },
  {
    value: 'metodologia',
    label: 'Metodología',
    icon: BookX,
  },
  {
    value: 'evaluacion',
    label: 'Evaluación',
    icon: FileWarning,
  },
  {
    value: 'formato',
    label: 'Formato',
    icon: AlertTriangle,
  },
]

// ── Estado del formulario ──
const form = ref({
  categoria: '',
  observacion: '',
})

const errores = ref({
  categoria: '',
  observacion: '',
})

const errorBackend = ref(props.backendError)

// Sincronizar error de backend con el prop
watch(
  () => props.backendError,
  (val) => {
    errorBackend.value = val
  },
)

// ── Validación en tiempo real ──
const MIN_CHARS = 30
const MAX_CHARS = 500

const cumpleMinimo = computed(() => form.value.observacion.length >= MIN_CHARS)

const progresoMinimo = computed(() =>
  Math.min(100, (form.value.observacion.length / MIN_CHARS) * 100),
)

const claseContador = computed(() => {
  const len = form.value.observacion.length
  if (len >= MAX_CHARS) return 'contador--limite'
  if (len >= MAX_CHARS * 0.9) return 'contador--advertencia'
  return ''
})

const claseProgreso = computed(() => {
  if (cumpleMinimo.value) return 'progreso-barra--ok'
  if (progresoMinimo.value > 50) return 'progreso-barra--medio'
  return 'progreso-barra--inicio'
})

const formularioValido = computed(() => form.value.categoria !== '' && cumpleMinimo.value)

function validarCampos() {
  // Categoría
  errores.value.categoria = form.value.categoria ? '' : 'Seleccioná una categoría'

  // Observación
  if (!form.value.observacion) {
    errores.value.observacion = 'La observación es obligatoria'
  } else if (form.value.observacion.length < MIN_CHARS) {
    errores.value.observacion = `Mínimo ${MIN_CHARS} caracteres`
  } else {
    errores.value.observacion = ''
  }

  // Limpiar error de backend al editar
  errorBackend.value = null
}

// ── Envío ──
function enviar() {
  validarCampos()
  if (!formularioValido.value || props.loading) return

  emit('enviar', {
    categoria: form.value.categoria,
    observacion: form.value.observacion,
  })
}
</script>

<style scoped>
/* ── Wrapper principal ── */
.observacion-form {
  background: #ffffff;
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.observacion-form--rechazo {
  border-color: #fecaca;
  background: #fff8f8;
}

/* Header */
.form-header {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

.form-icon {
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
  color: #6366f1;
  margin-top: 0.125rem;
}

.observacion-form--rechazo .form-icon {
  color: #ef4444;
}

.form-titulo {
  font-size: 1.0625rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.25rem;
}

.form-subtitulo {
  font-size: 0.8125rem;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
}

/* Body del form */
.form-body {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Fieldset categoría */
.campo-fieldset {
  border: none;
  padding: 0;
  margin: 0;
}

.campo-legend {
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 0.75rem;
  display: block;
}

.req {
  color: #ef4444;
  margin-left: 0.1rem;
}

.categorias-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.625rem;
}

@media (min-width: 640px) {
  .categorias-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.categoria-opcion {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.15s;
  background: #f8fafc;
}

.categoria-opcion:hover {
  border-color: #a5b4fc;
  background: #eef2ff;
}

.categoria-opcion--activa {
  border-color: #6366f1;
  background: #eef2ff;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.15);
}

.observacion-form--rechazo .categoria-opcion--activa {
  border-color: #ef4444;
  background: #fee2e2;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.15);
}

.categoria-radio {
  display: none;
}

.cat-icon {
  width: 1rem;
  height: 1rem;
  color: #6366f1;
  flex-shrink: 0;
}

.observacion-form--rechazo .cat-icon {
  color: #ef4444;
}

.cat-label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #475569;
}

/* Textarea */
.campo-grupo {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.campo-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
}

.textarea-wrapper {
  position: relative;
  border: 1.5px solid #e2e8f0;
  border-radius: 0.5rem;
  transition: border-color 0.15s;
  background: #fff;
  overflow: hidden;
}

.textarea-wrapper:focus-within {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.textarea-wrapper--error {
  border-color: #ef4444;
}

.obs-textarea {
  width: 100%;
  padding: 0.875rem;
  padding-bottom: 2rem; /* Espacio para el contador */
  border: none;
  resize: vertical;
  font-size: 0.9375rem;
  color: #1e293b;
  font-family: inherit;
  line-height: 1.6;
  background: transparent;
  box-sizing: border-box;
}

.obs-textarea:focus {
  outline: none;
}

.obs-textarea::placeholder {
  color: #cbd5e1;
}

/* Contador */
.contador {
  position: absolute;
  bottom: 0.5rem;
  right: 0.75rem;
  font-size: 0.75rem;
  color: #94a3b8;
  background: #fff;
  padding: 0 0.25rem;
  pointer-events: none;
}

.contador--advertencia {
  color: #d97706;
  font-weight: 600;
}

.contador--limite {
  color: #ef4444;
  font-weight: 700;
}

/* Barra de progreso */
.progreso-wrapper {
  height: 3px;
  background: #f1f5f9;
  border-radius: 9999px;
  overflow: hidden;
}

.progreso-barra {
  height: 100%;
  border-radius: 9999px;
  transition:
    width 0.2s ease,
    background-color 0.2s ease;
}

.progreso-barra--inicio {
  background: #f87171;
}
.progreso-barra--medio {
  background: #fbbf24;
}
.progreso-barra--ok {
  background: #22c55e;
}

/* Mensaje de progreso */
.progreso-msg {
  font-size: 0.8125rem;
  color: #94a3b8;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.progreso-msg--ok {
  color: #16a34a;
  font-weight: 500;
}

.progreso-ok-icon {
  width: 0.875rem;
  height: 0.875rem;
}

/* Errores de campo */
.campo-error {
  font-size: 0.8125rem;
  color: #ef4444;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Error backend */
.error-backend {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
}

.error-backend-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #ef4444;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.error-backend-titulo {
  font-weight: 700;
  color: #991b1b;
  margin: 0 0 0.2rem;
  font-size: 0.9rem;
}

.error-backend-msg {
  font-size: 0.8125rem;
  color: #b91c1c;
  margin: 0;
}

/* Resumen de validación */
.validacion-resumen {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 0.875rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  border: 1px solid #f1f5f9;
}

.validacion-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: #94a3b8;
  transition: color 0.15s;
}

.validacion-item.ok {
  color: #16a34a;
}

.vitem-icon {
  width: 0.9rem;
  height: 0.9rem;
  flex-shrink: 0;
}

.vitem-icon.ok {
  color: #22c55e;
}

/* Acciones */
.form-acciones {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.btn-cancelar {
  padding: 0.625rem 1.25rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background: #fff;
  color: #475569;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-cancelar:hover:not(:disabled) {
  border-color: #94a3b8;
  color: #1e293b;
}

.btn-enviar {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-enviar--observacion {
  background: #6366f1;
  color: #fff;
}

.btn-enviar--observacion:hover:not(:disabled) {
  background: #4f46e5;
}

.btn-enviar--rechazo {
  background: #ef4444;
  color: #fff;
}

.btn-enviar--rechazo:hover:not(:disabled) {
  background: #dc2626;
}

.btn-enviar:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none !important;
}

.btn-icon {
  width: 1rem;
  height: 1rem;
}

.spin {
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
