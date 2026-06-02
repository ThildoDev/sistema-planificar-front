// import api from '@/plugins/axios'

// /**
//  * DocenteRepository
//  * Encapsula las peticiones HTTP del módulo del Docente.
//  */
// class DocenteRepository {
//   /**
//    * Obtiene las planificaciones del docente autenticado.
//    * GET /api/planificaciones
//    */
//   async getPlanificaciones() {
//     const response = await api.get('/planificaciones')
//     return response.data
//   }
    // async storePlanificacion(formData) {
    // const response = await api.post('/planificaciones', formData)
    // return response.data
  // }
// }

// export default new DocenteRepository()


/**
 * DocenteRepository
 * Simula las respuestas del backend antes de la integración real.
 */
class DocenteRepository {
  async getPlanificaciones() {
    // Simulamos un retraso de red de 1.2 segundos
    await new Promise(resolve => setTimeout(resolve, 1200))

    // Cambiá entre los conjuntos de datos de abajo para probar distintos escenarios:

    // ESCENARIO A: Con datos cargados (Para ver KPIs y Acciones de la tabla)
    return [
      { id: 101, area: 'Matemática', tipo: 'Anual', fecha: '2026-03-02', estados_anual: 'Aprobado' },
      { id: 102, area: 'Prácticas del Lenguaje', tipo: 'Mensual', fecha: '2026-05-15', estados_anual: 'Pendiente' },
      { id: 103, area: 'Ciencias Naturales', tipo: 'Secuencia', fecha: '2026-04-10', estados_anual: 'Observado' },
      { id: 104, area: 'Ciencias Sociales', tipo: 'Anual', fecha: '2026-02-28', estados_anual: 'A corregir' }
    ]

    // ESCENARIO B: Vacío (Para probar el Empty State)
    // return []

    // ESCENARIO C: Error (Descomentá la línea de abajo para probar el Banner de Error)
    // throw new Error('Error interno del servidor (500).')
  }
}

export default new DocenteRepository()
