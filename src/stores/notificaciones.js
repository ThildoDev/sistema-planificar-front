import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNotificacionesStore = defineStore('notificaciones', () => {
  const lista = ref([])

  // Contador dinámico de notificaciones sin leer para el globito rojo
  const unreadCount = computed(() => lista.value.filter(n => !n.leida).length)

  // Función para inyectar una nueva alerta en el historial
  function agregarNotificacion(mensaje, tipo = 'info') {
    lista.value.unshift({
      id: Date.now(),
      mensaje,
      tipo,
      fecha: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      leida: false
    })
  }

  // Limpia el contador rojo al abrir el desplegable de la campana
  function marcarTodasComoLeidas() {
    lista.value.forEach(n => n.leida = true)
  }

  // Elimina una notificación específica
  function eliminarNotificacion(id) {
    lista.value = lista.value.filter(n => n.id !== id)
  }

  return {
    lista,
    unreadCount,
    agregarNotificacion,
    marcarTodasComoLeidas,
    eliminarNotificacion
  }
})
