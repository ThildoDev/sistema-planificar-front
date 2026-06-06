<template>
  <div class="dashboard-argentina fade-in">

    <!-- Título -->
    <h1 class="title">🏆 Dashboard Argentina Edition</h1>
    <p class="subtitle">Bienvenida Cynthia — Seleccioná una sección para comenzar</p>

    <!-- Tarjetas principales -->
    <div class="cards-grid">
      <div class="card stat-card">
        <div class="icon">📘</div>
        <h3>Planificaciones</h3>
        <p class="number">{{ stats.planificaciones }}</p>
      </div>

      <div class="card stat-card">
        <div class="icon">✔️</div>
        <h3>Aprobadas</h3>
        <p class="number">{{ stats.aprobadas }}</p>
      </div>

      <div class="card stat-card">
        <div class="icon">⏳</div>
        <h3>Pendientes</h3>
        <p class="number">{{ stats.pendientes }}</p>
      </div>

      <div class="card stat-card">
        <div class="icon">👥</div>
        <h3>Usuarios</h3>
        <p class="number">{{ stats.usuarios }}</p>
      </div>
    </div>

    <!-- Sección inferior -->
    <div class="bottom-section">
      <div class="card info-card">
        <h2>⚽ Actividad reciente</h2>
        <ul>
          <li v-for="item in actividad" :key="item.id">
            {{ item.texto }}
          </li>
        </ul>
      </div>

      <div class="card info-card">
        <h2>📅 Próximas fechas</h2>
        <ul>
          <li v-for="item in fechas" :key="item.id">
            {{ item.fecha }} — {{ item.evento }}
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const stats = ref({
  planificaciones: 18,
  aprobadas: 12,
  pendientes: 6,
  usuarios: 27
})

const actividad = ref([
  { id: 1, texto: "Nueva planificación cargada por el docente Pérez" },
  { id: 2, texto: "El director Gómez aprobó una planificación" },
  { id: 3, texto: "Se agregó un nuevo usuario al sistema" }
])

const fechas = ref([
  { id: 1, fecha: "10/06", evento: "Entrega de planificaciones" },
  { id: 2, fecha: "15/06", evento: "Revisión del director" },
  { id: 3, fecha: "20/06", evento: "Aprobaciones finales" }
])
</script>

<style scoped>
.dashboard-argentina {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* Títulos */
.title {
  font-size: 32px;
  font-weight: 800;
  color: var(--text);
}

.subtitle {
  font-size: 16px;
  color: var(--text-light);
  margin-top: -10px;
}

/* Grid de tarjetas */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

/* Tarjetas estadísticas */
.stat-card {
  text-align: center;
  padding: 24px;
  border-radius: var(--radius);
  background: var(--bg-soft);
  box-shadow: var(--shadow);
  transition: var(--transition);
  position: relative;
  overflow: hidden;
}

/* Brillo dorado del campeón */
.stat-card::after {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    120deg,
    transparent,
    rgba(255,215,0,0.25),
    transparent
  );
  animation: gold-shine 4s infinite;
}

@keyframes gold-shine {
  0% { left: -100%; }
  50% { left: 150%; }
  100% { left: 150%; }
}

.stat-card .icon {
  font-size: 32px;
  margin-bottom: 10px;
}

.stat-card .number {
  font-size: 28px;
  font-weight: 800;
  color: var(--primary);
}

/* Sección inferior */
.bottom-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}

.info-card {
  padding: 24px;
}

.info-card h2 {
  margin-bottom: 12px;
  color: var(--text);
}

.info-card ul {
  list-style: none;
  padding: 0;
}

.info-card li {
  padding: 8px 0;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  color: var(--text-light);
}
</style>
