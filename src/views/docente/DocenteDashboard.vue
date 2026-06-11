<template>
  <div class="space-y-6">

    <!-- Cabecera de la vista -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">
          Buenos días, {{ authStore.user?.name?.split(' ')[0] }} 👋
        </h1>
        <p class="text-sm text-slate-500 mt-0.5">Acá podés ver el estado de todas tus planificaciones.</p>
      </div>
      <RouterLink
        to="/planificaciones/crear"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white
               transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
               hover:-translate-y-0.5"
        style="background: linear-gradient(135deg, #1e4fa8, #2563eb); box-shadow: 0 4px 12px rgba(37,99,235,0.3);"
      >
        <FilePlus :size="16" />
        Nueva Planificación
      </RouterLink>
    </div>

    <!-- ── KPI Cards ── -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div
        v-for="kpi in kpiCards"
        :key="kpi.label"
        class="bg-white rounded-2xl p-5 border border-slate-100 flex items-center gap-4
               hover:shadow-md transition-shadow duration-200"
        style="box-shadow: 0 1px 4px rgba(0,0,0,0.04);"
      >
        <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
             :class="kpi.iconBg">
          <component :is="kpi.icon" :size="22" :class="kpi.iconColor" />
        </div>
        <div>
          <p class="text-2xl font-extrabold text-slate-900 leading-tight">{{ kpi.value }}</p>
          <p class="text-xs text-slate-500 font-medium">{{ kpi.label }}</p>
        </div>
      </div>
    </div>

    <!-- ── Tabla de Planificaciones ── -->
    <div class="bg-white rounded-2xl border border-slate-100 overflow-hidden"
         style="box-shadow: 0 1px 4px rgba(0,0,0,0.04);">
      <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <h2 class="text-sm font-bold text-slate-800 flex items-center gap-2">
          <FolderOpen :size="15" class="text-slate-400" />
          Mis Planificaciones
        </h2>
        <span class="text-xs text-slate-400">{{ planificaciones.length }} registros</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-100 text-left">
              <th class="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-widest">#</th>
              <th class="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Área</th>
              <th class="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Tipo</th>
              <th class="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Fecha</th>
              <th class="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Estado</th>
              <th class="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Avance</th>
              <th class="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(plan, i) in planificaciones"
              :key="plan.id"
              class="border-b border-slate-50 hover:bg-slate-50/60 transition-colors"
            >
              <td class="px-5 py-3.5 text-slate-400 font-medium text-xs">{{ i + 1 }}</td>
              <td class="px-5 py-3.5 font-semibold text-slate-700">{{ plan.area }}</td>
              <td class="px-5 py-3.5">
                <span class="text-xs px-2.5 py-1 rounded-lg font-semibold"
                      :class="plan.tipo === 'Anual'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-violet-50 text-violet-700'">
                  {{ plan.tipo }}
                </span>
              </td>
              <td class="px-5 py-3.5 text-slate-500 text-xs">{{ formatDate(plan.fecha) }}</td>
              <td class="px-5 py-3.5">
                <EstadoBadge :estado="plan.estado" />
              </td>
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-2 min-w-[90px]">
                  <div class="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      class="h-full rounded-full transition-all duration-500"
                      :class="plan.avance >= 70 ? 'bg-emerald-500' : plan.avance >= 40 ? 'bg-amber-400' : 'bg-slate-300'"
                      :style="{ width: plan.avance + '%' }"
                    ></div>
                  </div>
                  <span class="text-xs font-semibold text-slate-500 w-8 text-right">{{ plan.avance }}%</span>
                </div>
              </td>
              <td class="px-5 py-3.5">
                <div class="flex gap-1.5">
                  <button class="w-7 h-7 rounded-lg flex items-center justify-center
                                 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          title="Ver">
                    <Eye :size="13" />
                  </button>
                  <button v-if="plan.estado !== 'APROBADA'"
                          class="w-7 h-7 rounded-lg flex items-center justify-center
                                 text-slate-400 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                          title="Editar">
                    <Pencil :size="13" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { FilePlus, FolderOpen, FileText, BookOpen, TrendingUp, Eye, Pencil } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { mockPlanificacionesDocente, computeKpisDocente, ESTADO_CONFIG } from '@/stores/auth'
import EstadoBadge from '@/components/docente/StatusBadgeAnual.vue'

const authStore = useAuthStore()
const planificaciones = mockPlanificacionesDocente
const kpis = computeKpisDocente(planificaciones)

const kpiCards = [
  { label: 'Total Planificaciones', value: kpis.total,          icon: FileText,  iconBg: 'bg-blue-50',    iconColor: 'text-blue-600' },
  { label: 'Clases Registradas',    value: kpis.clases,         icon: BookOpen,  iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  { label: '% Avance Curricular',   value: kpis.avancePromedio + '%', icon: TrendingUp, iconBg: 'bg-violet-50', iconColor: 'text-violet-600' },
]

function formatDate(d) {
  return new Date(d).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>
