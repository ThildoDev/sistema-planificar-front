// src/composables/useToast.js
import { ref } from 'vue'

// Estado global del toast (singleton compartido)
const toasts = ref([])
let nextId = 0

/**
 * Composable para notificaciones toast.
 * Uso: const { showToast } = useToast()
 * showToast('Mensaje', 'success' | 'error' | 'warning' | 'info')
 */
export function useToast() {
  /**
   * Muestra un toast con auto-cierre.
   * @param {string} message
   * @param {'success'|'error'|'warning'|'info'} type
   * @param {number} duration - ms (default 3500)
   */
  function showToast(message, type = 'info', duration = 3500) {
    const id = ++nextId
    toasts.value.push({ id, message, type })
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  function removeToast(id) {
    const idx = toasts.value.findIndex((t) => t.id === id)
    if (idx !== -1) toasts.value.splice(idx, 1)
  }

  return { toasts, showToast, removeToast }
}
