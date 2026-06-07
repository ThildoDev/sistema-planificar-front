<!-- src/components/director/PlanificacionReadOnly.vue -->
<template>
  <div class="planificacion-readonly">
    <div class="seccion-header">
      <FileText class="seccion-icon" />
      <h2 class="seccion-titulo">Contenido de la Planificación</h2>
      <span class="seccion-badge">Solo lectura</span>
    </div>

    <!-- Grilla de campos -->
    <div class="campos-grid">
      <!-- Diagnóstico -->
      <div class="campo campo--completo">
        <div class="campo-header">
          <ClipboardList class="campo-icon" />
          <span class="campo-label">Diagnóstico del grupo</span>
        </div>
        <div class="campo-contenido">
          {{ planificacion.diagnostico || 'Sin diagnóstico registrado' }}
        </div>
      </div>

      <!-- Aprendizajes esperados -->
      <div class="campo campo--completo">
        <div class="campo-header">
          <Target class="campo-icon campo-icon--blue" />
          <span class="campo-label">Aprendizajes esperados</span>
          <span class="campo-hint">(Objetivos)</span>
        </div>
        <div class="campo-contenido">
          {{ planificacion.aprendizajes_esperados || 'No especificado' }}
        </div>
      </div>

      <!-- Saberes -->
      <div class="campo campo--completo">
        <div class="campo-header">
          <BookOpen class="campo-icon campo-icon--green" />
          <span class="campo-label">Saberes</span>
          <span class="campo-hint">(Contenidos / Unidades)</span>
        </div>
        <div class="campo-contenido">
          {{ planificacion.saberes || 'No especificado' }}
        </div>
      </div>

      <!-- Criterios de evaluación -->
      <div class="campo campo--completo">
        <div class="campo-header">
          <CheckSquare class="campo-icon campo-icon--purple" />
          <span class="campo-label">Criterios de evaluación</span>
        </div>
        <div class="campo-contenido">
          {{ planificacion.criterios || 'No especificado' }}
        </div>
      </div>

      <!-- Bibliografía -->
      <div class="campo campo--mitad">
        <div class="campo-header">
          <Library class="campo-icon campo-icon--orange" />
          <span class="campo-label">Bibliografía</span>
        </div>
        <div class="campo-contenido">
          {{ planificacion.bibliografia || 'No especificada' }}
        </div>
      </div>

      <!-- Metadatos -->
      <div class="campo campo--mitad">
        <div class="campo-header">
          <Info class="campo-icon campo-icon--gray" />
          <span class="campo-label">Datos del área</span>
        </div>
        <div class="campo-contenido campo-meta">
          <div class="meta-item">
            <span class="meta-key">Área:</span>
            <span class="meta-value">
              {{ planificacion.area?.area || '—' }}
            </span>
          </div>
          <div v-if="planificacion.area?.tipo" class="meta-item">
            <span class="meta-key">Tipo de área:</span>
            <span class="meta-value">{{ planificacion.area.tipo }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-key">Tipo de plan:</span>
            <span class="meta-value">
              {{ planificacion.tipo_planificacion || '—' }}
            </span>
          </div>
          <div class="meta-item">
            <span class="meta-key">Presentación:</span>
            <span class="meta-value">{{ fechaFormateada }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Aviso de solo lectura -->
    <div class="aviso-readonly">
      <Lock class="aviso-icon" />
      <span>
        Esta sección es de solo lectura. Los campos no son editables en la vista de revisión.
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  FileText,
  ClipboardList,
  Target,
  BookOpen,
  CheckSquare,
  Library,
  Info,
  Lock,
} from 'lucide-vue-next'

const props = defineProps({
  planificacion: {
    type: Object,
    required: true,
  },
})

const fechaFormateada = computed(() => {
  if (!props.planificacion.fecha_presentacion) return '—'
  return new Date(props.planificacion.fecha_presentacion).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
})
</script>

<style scoped>
.planificacion-readonly {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Header sección */
.seccion-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f1f5f9;
}

.seccion-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #6366f1;
}

.seccion-titulo {
  font-size: 1.0625rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  flex: 1;
}

.seccion-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.625rem;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 9999px;
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
}

/* Grid de campos */
.campos-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.campo--completo {
  grid-column: 1 / -1;
}

.campo--mitad {
  grid-column: span 1;
}

@media (max-width: 640px) {
  .campos-grid {
    grid-template-columns: 1fr;
  }
  .campo--mitad {
    grid-column: 1 / -1;
  }
}

/* Campo individual */
.campo {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1rem;
  /* Sin inputs editables — solo display */
  user-select: text;
}

.campo-header {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.campo-icon {
  width: 1rem;
  height: 1rem;
  color: #94a3b8;
  flex-shrink: 0;
}

.campo-icon--blue {
  color: #3b82f6;
}
.campo-icon--green {
  color: #22c55e;
}
.campo-icon--purple {
  color: #a855f7;
}
.campo-icon--orange {
  color: #f97316;
}
.campo-icon--gray {
  color: #94a3b8;
}

.campo-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.campo-hint {
  font-size: 0.75rem;
  color: #94a3b8;
  font-style: italic;
}

/* Contenido del campo */
.campo-contenido {
  font-size: 0.9375rem;
  color: #1e293b;
  line-height: 1.65;
  white-space: pre-wrap;
  /* Sin pointer-events edit — solo lectura */
  cursor: default;
}

/* Metadatos */
.campo-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.meta-item {
  display: flex;
  gap: 0.5rem;
  align-items: baseline;
}

.meta-key {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #94a3b8;
  white-space: nowrap;
}

.meta-value {
  font-size: 0.9rem;
  color: #1e293b;
  font-weight: 500;
}

/* Aviso readonly */
.aviso-readonly {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  color: #94a3b8;
}

.aviso-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  color: #cbd5e1;
}
</style>
