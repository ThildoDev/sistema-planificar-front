import { defineStore } from 'pinia'

/**
 * Store de Revisión de Planificaciones
 * Gestiona el estado de la planificación actualmente en revisión,
 * su historial de estados y el proceso de decisión del director.
 */
export const useRevisionStore = defineStore('revision', {
  state: () => ({
    // ─── Planificación en revisión ───────────────────────────────
    planificacion: null, // Objeto completo de planificacion_anual
    estadosAnual: [], // Array de estados_anual ordenados por fecha
    area: null, // Objeto area { id, area, tipo }

    // ─── Listado de planificaciones recibidas ────────────────────
    planificaciones: [], // Array del GET /api/planificaciones
    total: 0, // Total para paginación futura

    // ─── Filtros activos ─────────────────────────────────────────
    filtros: {
      area_id: null,
      estado: '',
      tipo: '',
      docente_id: null,
      fecha_desde: '',
      fecha_hasta: '',
    },

    // ─── UI States ───────────────────────────────────────────────
    cargando: false, // Loading general
    cargandoPlanificacion: false,
    enviandoDecision: false, // Aprobar / Rechazar en proceso
    error: null, // Mensaje de error actual
    errorDecision: null, // Error específico de decisión (ej: 403)

    // ─── Decisión del director ───────────────────────────────────
    decision: {
      tipo: null, // 'aprobar' | 'rechazar' | null
      observacion: '',
      categoria: '',
    },
  }),

  getters: {
    /**
     * Último estado de la planificación (el más reciente).
     * Los estados se asumen ordenados desc por fecha desde el backend.
     */
    estadoActual: (state) => {
      if (!state.estadosAnual.length) return null
      return state.estadosAnual[0]
    },

    /**
     * Verifica si la planificación está en un estado que permite revisión.
     * Solo 'Pendiente' y 'En Proceso' son revisables.
     */
    puedeRevisar: (state) => {
      const estadoActual = state.estadosAnual[0]?.estado
      return ['Pendiente', 'En Proceso'].includes(estadoActual)
    },

    /**
     * Planificaciones filtradas por estado para la tabla.
     */
    planificacionesFiltradas: (state) => {
      if (!state.filtros.estado) return state.planificaciones
      return state.planificaciones.filter(
        (p) => p.estados_anual?.[0]?.estado === state.filtros.estado,
      )
    },

    /**
     * Indica si el formulario de observación es válido para enviar.
     */
    observacionValida: (state) => {
      return (
        state.decision.observacion.length >= 30 &&
        state.decision.observacion.length <= 500 &&
        state.decision.categoria !== ''
      )
    },
  },

  actions: {
    // ─── SET FILTROS ─────────────────────────────────────────────
    setFiltro(campo, valor) {
      this.filtros[campo] = valor
    },

    resetFiltros() {
      this.filtros = {
        area_id: null,
        estado: '',
        tipo: '',
        docente_id: null,
        fecha_desde: '',
        fecha_hasta: '',
      }
    },

    // ─── SET PLANIFICACIONES ─────────────────────────────────────
    setPlanificaciones(data) {
      this.planificaciones = data
      this.total = data.length
    },

    // ─── SET PLANIFICACIÓN ACTIVA ─────────────────────────────────
    setPlanificacion(data) {
      this.planificacion = data
      this.estadosAnual = data.estados_anual
        ? [...data.estados_anual].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        : []
      this.area = data.area || null
    },

    // ─── RESET REVISIÓN ──────────────────────────────────────────
    resetRevision() {
      this.planificacion = null
      this.estadosAnual = []
      this.area = null
      this.error = null
      this.errorDecision = null
      this.decision = { tipo: null, observacion: '', categoria: '' }
    },

    // ─── DECISIÓN ────────────────────────────────────────────────
    setDecisionTipo(tipo) {
      this.decision.tipo = tipo
    },

    setObservacion(texto) {
      this.decision.observacion = texto
    },

    setCategoria(categoria) {
      this.decision.categoria = categoria
    },

    resetDecision() {
      this.decision = { tipo: null, observacion: '', categoria: '' }
      this.errorDecision = null
    },

    // ─── AGREGAR ESTADO AL HISTORIAL (optimistic update) ─────────
    agregarEstado(nuevoEstado) {
      this.estadosAnual.unshift(nuevoEstado)
    },

    // ─── ERRORS ──────────────────────────────────────────────────
    setError(mensaje) {
      this.error = mensaje
    },

    setErrorDecision(mensaje) {
      this.errorDecision = mensaje
    },

    clearErrors() {
      this.error = null
      this.errorDecision = null
    },
  },

  persist: false, // Nunca persistir planificaciones sensibles
})
