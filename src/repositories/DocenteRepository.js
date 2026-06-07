// src/repositories/DocenteRepository.js
// Simula llamadas HTTP con delay artificial para probar Skeleton Loaders

const DELAY_MS = 1200

const mockPlanificaciones = [
  {
    id: 1,
    area_curricular: 'Matemática',
    tipo_planificacion: 'Anual',
    fecha_presentacion: '2024-03-15',
    estado: 'Aprobado',
    persona_cargo_cursado_id: 1,
    diagnostico_grupo: 'Grupo de 25 alumnos con nivel heterogéneo. Mayoría domina operaciones básicas.',
    aprendizajes_esperados: 'Resolución de problemas con números naturales hasta el millón. Fracciones y decimales.',
    saberes_contenidos: 'Numeración: sistema decimal. Operaciones: multiplicación y división. Medidas de longitud.',
    criterios_evaluacion: 'Participación, resolución de situaciones problemáticas, trabajos prácticos y evaluaciones escritas.',
    bibliografia: 'Libro de texto oficial. Cuadernillos del Ministerio de Educación. Recursos digitales.',
    observaciones_directivo: null,
    created_at: '2024-03-10T10:00:00Z',
    updated_at: '2024-03-20T14:30:00Z',
    historial: [
      { fecha: '2024-03-10T10:00:00Z', estado: 'Pendiente', usuario: 'Ana García', nota: 'Planificación creada' },
      { fecha: '2024-03-20T14:30:00Z', estado: 'Aprobado', usuario: 'Dir. Martínez', nota: 'Aprobada sin observaciones' }
    ]
  },
  {
    id: 2,
    area_curricular: 'Lengua y Literatura',
    tipo_planificacion: 'Trimestral',
    fecha_presentacion: '2024-04-01',
    estado: 'Pendiente',
    persona_cargo_cursado_id: 1,
    diagnostico_grupo: 'Alumnos con dificultades en comprensión lectora. Se detectaron 5 casos de rezago.',
    aprendizajes_esperados: 'Producción de textos narrativos y descriptivos. Comprensión lectora de textos literarios.',
    saberes_contenidos: 'Tipos textuales. Gramática: sustantivos y adjetivos. Ortografía acentual.',
    criterios_evaluacion: 'Producción escrita, lectura oral expresiva, comprensión lectora y ortografía.',
    bibliografia: 'Antología literaria 4to grado. Gramática práctica. Diccionario escolar.',
    observaciones_directivo: null,
    created_at: '2024-03-28T09:15:00Z',
    updated_at: '2024-03-28T09:15:00Z',
    historial: [
      { fecha: '2024-03-28T09:15:00Z', estado: 'Pendiente', usuario: 'Ana García', nota: 'Planificación creada' }
    ]
  },
  {
    id: 3,
    area_curricular: 'Ciencias Naturales',
    tipo_planificacion: 'Anual',
    fecha_presentacion: '2024-03-20',
    estado: 'A Corregir',
    persona_cargo_cursado_id: 1,
    diagnostico_grupo: 'Grupo motivado. Se realizó diagnóstico inicial con buena participación general.',
    aprendizajes_esperados: 'Comprensión del cuerpo humano. Ecosistemas locales. Ciclo del agua.',
    saberes_contenidos: 'Sistemas del cuerpo humano. Flora y fauna regional. Cambios del estado del agua.',
    criterios_evaluacion: 'Observación, experimentación, cuaderno de ciencias y evaluaciones conceptuales.',
    bibliografia: 'Libro de Ciencias Naturales 4to. Guías de laboratorio. Videos educativos.',
    observaciones_directivo: 'Revisar los criterios de evaluación. Agregar más actividades de experimentación directa y vincular con los NAP del ciclo.',
    created_at: '2024-03-18T11:20:00Z',
    updated_at: '2024-03-25T16:00:00Z',
    historial: [
      { fecha: '2024-03-18T11:20:00Z', estado: 'Pendiente', usuario: 'Ana García', nota: 'Planificación creada' },
      { fecha: '2024-03-25T16:00:00Z', estado: 'A Corregir', usuario: 'Dir. Martínez', nota: 'Revisar criterios de evaluación y vincular con NAP.' }
    ]
  },
  {
    id: 4,
    area_curricular: 'Ciencias Sociales',
    tipo_planificacion: 'Trimestral',
    fecha_presentacion: '2024-04-05',
    estado: 'Rechazado',
    persona_cargo_cursado_id: 1,
    diagnostico_grupo: 'Grupo diverso. Interés marcado por temas locales e historia regional.',
    aprendizajes_esperados: 'Conocimiento de la organización política del país. Historia argentina siglo XIX.',
    saberes_contenidos: 'Organización política: municipio, provincia, nación. Revolución de Mayo. Independencia.',
    criterios_evaluacion: 'Trabajos en grupo, mapas conceptuales, líneas de tiempo y evaluaciones individuales.',
    bibliografia: 'Historia Argentina para 4to. Atlas escolar. Fuentes primarias digitalizadas.',
    observaciones_directivo: 'La planificación no se ajusta al diseño curricular jurisdiccional vigente. Debe reformularse completamente.',
    created_at: '2024-04-02T08:00:00Z',
    updated_at: '2024-04-08T10:45:00Z',
    historial: [
      { fecha: '2024-04-02T08:00:00Z', estado: 'Pendiente', usuario: 'Ana García', nota: 'Planificación creada' },
      { fecha: '2024-04-08T10:45:00Z', estado: 'Rechazado', usuario: 'Dir. Martínez', nota: 'No se ajusta al diseño curricular vigente.' }
    ]
  }
]

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const DocenteRepository = {
  async getPlanificaciones(docenteId) {
    await delay(DELAY_MS)
    // Para probar el Empty State, cambiar el return a: return []
    return mockPlanificaciones.filter(p => p.persona_cargo_cursado_id === docenteId)
  },

  async getPlanificacionById(id) {
    await delay(DELAY_MS)
    const found = mockPlanificaciones.find(p => p.id === Number(id))
    if (!found) throw new Error('Planificación no encontrada')
    return { ...found }
  },

  async createPlanificacion(payload) {
    await delay(DELAY_MS)
    const newPlan = {
      ...payload,
      id: Date.now(),
      estado: 'Pendiente',
      observaciones_directivo: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      historial: [
        { fecha: new Date().toISOString(), estado: 'Pendiente', usuario: 'Ana García', nota: 'Planificación creada' }
      ]
    }
    mockPlanificaciones.push(newPlan)
    return newPlan
  },

  async updatePlanificacion(id, payload) {
    await delay(DELAY_MS)
    const idx = mockPlanificaciones.findIndex(p => p.id === Number(id))
    if (idx === -1) throw new Error('Planificación no encontrada')
    mockPlanificaciones[idx] = {
      ...mockPlanificaciones[idx],
      ...payload,
      updated_at: new Date().toISOString()
    }
    return mockPlanificaciones[idx]
  },

  async deletePlanificacion(id) {
    await delay(DELAY_MS)
    const idx = mockPlanificaciones.findIndex(p => p.id === Number(id))
    if (idx === -1) throw new Error('Planificación no encontrada')
    mockPlanificaciones.splice(idx, 1)
    return { success: true }
  }
}
