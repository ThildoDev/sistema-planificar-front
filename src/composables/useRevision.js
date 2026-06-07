import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRevisionStore } from '@/stores/revision'
import DirectorRepository from '@/repositories/DirectorRepository'

/**
 * useRevision
 * Composable que orquesta toda la lógica de revisión de planificaciones.
 * Conecta DirectorRepository → Store → Vistas/Componentes.
 *
 * @returns {Object} API pública del composable
 */
export function useRevision() {
  const store = useRevisionStore()
  const router = useRouter()

  // ─── ESTADO REACTIVO DESDE EL STORE ─────────────────────────────
  const planificaciones = computed(() => store.planificaciones)
  const planificacion = computed(() => store.planificacion)
  const estadosAnual = computed(() => store.estadosAnual)
  const estadoActual = computed(() => store.estadoActual)
  const area = computed(() => store.area)
  const filtros = computed(() => store.filtros)
  const cargando = computed(() => store.cargando)
  const cargandoPlanificacion = computed(() => store.cargandoPlanificacion)
  const enviandoDecision = computed(() => store.enviandoDecision)
  const error = computed(() => store.error)
  const errorDecision = computed(() => store.errorDecision)
  const puedeRevisar = computed(() => store.puedeRevisar)
  const observacionValida = computed(() => store.observacionValida)
  const decision = computed(() => store.decision)

  // ─── CARGAR LISTADO ──────────────────────────────────────────────

  /**
   * Carga todas las planificaciones con los filtros activos.
   */
  async function cargarPlanificaciones() {
    store.cargando = true
    store.clearErrors()

    try {
      // Construir params limpiando valores vacíos
      const params = Object.fromEntries(
        Object.entries(store.filtros).filter(([, v]) => v !== null && v !== '' && v !== undefined),
      )

      const { data } = await DirectorRepository.getPlanificaciones(params)

      // El backend puede devolver { data: [] } o []
      const lista = Array.isArray(data) ? data : (data.data ?? [])
      store.setPlanificaciones(lista)
    } catch (err) {
      const mensaje =
        err.response?.data?.message || 'Error al cargar planificaciones. Intente nuevamente.'
      store.setError(mensaje)
      console.error('[useRevision] cargarPlanificaciones:', err)
    } finally {
      store.cargando = false
    }
  }

  // ─── CARGAR PLANIFICACIÓN INDIVIDUAL ────────────────────────────

  /**
   * Carga una planificación completa por ID para revisión.
   * Incluye área, historial de estados y datos del docente.
   * @param {number|string} id
   */
  async function cargarPlanificacion(id) {
    store.cargandoPlanificacion = true
    store.clearErrors()
    store.resetRevision()

    try {
      const { data } = await DirectorRepository.getPlanificacion(id)

      // El backend puede envolver en { data: {} }
      const planData = data.data ?? data
      store.setPlanificacion(planData)
    } catch (err) {
      if (err.response?.status === 404) {
        store.setError('Planificación no encontrada.')
      } else if (err.response?.status === 403) {
        store.setError('No tiene permisos para ver esta planificación.')
      } else {
        store.setError(err.response?.data?.message || 'Error al cargar la planificación.')
      }
      console.error('[useRevision] cargarPlanificacion:', err)
    } finally {
      store.cargandoPlanificacion = false
    }
  }

  // ─── APROBAR PLANIFICACIÓN ───────────────────────────────────────

  /**
   * Aprueba la planificación activa y redirige al dashboard.
   * Actualiza el historial de estados de forma optimista.
   */
  async function aprobarPlanificacion() {
    if (!store.planificacion?.id) return
    store.enviandoDecision = true
    store.clearErrors()

    try {
      const { data } = await DirectorRepository.aprobarPlanificacion(store.planificacion.id)

      // Agregar el nuevo estado al historial
      const nuevoEstado = data.estado ?? {
        id: Date.now(),
        estado: 'Aprobado',
        fecha: new Date().toISOString(),
      }
      store.agregarEstado(nuevoEstado)

      return { success: true, mensaje: 'Planificación aprobada exitosamente.' }
    } catch (err) {
      const mensaje = _handleDecisionError(err)
      store.setErrorDecision(mensaje)
      return { success: false, mensaje }
    } finally {
      store.enviandoDecision = false
    }
  }

  // ─── RECHAZAR PLANIFICACIÓN ──────────────────────────────────────

  /**
   * Rechaza la planificación con observación y categoría obligatorias.
   * @returns {{ success: boolean, mensaje: string }}
   */
  async function rechazarPlanificacion() {
    if (!store.planificacion?.id) return
    if (!store.observacionValida) {
      store.setErrorDecision(
        'La observación debe tener al menos 30 caracteres y una categoría seleccionada.',
      )
      return { success: false, mensaje: store.errorDecision }
    }

    store.enviandoDecision = true
    store.clearErrors()

    try {
      const payload = {
        categoria: store.decision.categoria,
        observacion: store.decision.observacion,
      }

      const { data } = await DirectorRepository.rechazarPlanificacion(
        store.planificacion.id,
        payload,
      )

      const nuevoEstado = data.estado ?? {
        id: Date.now(),
        estado: 'Rechazado',
        fecha: new Date().toISOString(),
      }
      store.agregarEstado(nuevoEstado)

      return { success: true, mensaje: 'Planificación rechazada.' }
    } catch (err) {
      const mensaje = _handleDecisionError(err)
      store.setErrorDecision(mensaje)
      return { success: false, mensaje }
    } finally {
      store.enviandoDecision = false
    }
  }

  // ─── FILTROS ─────────────────────────────────────────────────────

  function aplicarFiltro(campo, valor) {
    store.setFiltro(campo, valor)
    cargarPlanificaciones()
  }

  function resetearFiltros() {
    store.resetFiltros()
    cargarPlanificaciones()
  }

  // ─── DECISIÓN ────────────────────────────────────────────────────

  function seleccionarDecision(tipo) {
    store.setDecisionTipo(tipo)
  }

  function actualizarObservacion(texto) {
    store.setObservacion(texto)
  }

  function actualizarCategoria(categoria) {
    store.setCategoria(categoria)
  }

  function cancelarDecision() {
    store.resetDecision()
  }

  // ─── HELPERS PRIVADOS ────────────────────────────────────────────

  function _handleDecisionError(err) {
    if (err.response?.status === 403) {
      return 'No tiene permisos para realizar esta acción.'
    }
    if (err.response?.status === 422) {
      const errores = err.response.data?.errors
      if (errores) {
        return Object.values(errores).flat().join(' ')
      }
    }
    return err.response?.data?.message || 'Error al procesar la decisión. Intente nuevamente.'
  }

  // ─── API PÚBLICA ─────────────────────────────────────────────────
  return {
    // Estado
    planificaciones,
    planificacion,
    estadosAnual,
    estadoActual,
    area,
    filtros,
    cargando,
    cargandoPlanificacion,
    enviandoDecision,
    error,
    errorDecision,
    puedeRevisar,
    observacionValida,
    decision,

    // Acciones de listado
    cargarPlanificaciones,
    aplicarFiltro,
    resetearFiltros,

    // Acciones de revisión
    cargarPlanificacion,
    aprobarPlanificacion,
    rechazarPlanificacion,

    // Control de decisión
    seleccionarDecision,
    actualizarObservacion,
    actualizarCategoria,
    cancelarDecision,
  }
}
