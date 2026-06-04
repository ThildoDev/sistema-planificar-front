// src/stores/toast.js
import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', {
  state: () => ({
    toasts: []
  }),

  actions: {
    showToast(message, type = 'info') {
      const id = Date.now()

      this.toasts.push({ id, message, type })

      setTimeout(() => {
        this.toasts = this.toasts.filter(t => t.id !== id)
      }, 4000)
    }
  }
})
