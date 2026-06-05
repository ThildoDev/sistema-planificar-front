import { defineStore } from 'pinia'
import api from '@/plugins/axios'
import { useToastStore } from '@/stores/toast'

export const usePlanificacionStore = defineStore('planificacion', {
  state: () => ({
    items: [],
    loading: false
  }),

  actions: {
    async fetchAll() {
      const toast = useToastStore()
      this.loading = true

      try {
        const { data } = await api.get('/planificaciones')
        this.items = data
      } catch (error) {
        toast.showToast('Error al cargar planificaciones', 'error')
      } finally {
        this.loading = false
      }
    },

    async create(payload) {
      const toast = useToastStore()

      try {
        const { data } = await api.post('/planificaciones', payload)
        this.items.push(data)
        toast.showToast('Planificación creada con éxito', 'success')
      } catch (error) {
        toast.showToast('No se pudo crear la planificación', 'error')
        throw error
      }
    }
  }
})
