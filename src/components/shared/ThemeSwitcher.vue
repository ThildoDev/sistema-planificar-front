<template>
  <div class="theme-switcher fade-in">
    <select v-model="theme" @change="applyTheme">
      <option value="light">🌞 Claro</option>
      <option value="dark">🌙 Oscuro</option>
      <option value="ambient">🌤 Intermedio</option>

      <option disabled>──────────</option>

      <option value="pastel">🎨 Pastel</option>
      <option value="corporate">🏢 Corporativo</option>
      <option value="futuristic">🚀 Futurista</option>

      <option disabled>──────────</option>

      <option value="argentina">🇦🇷 Argentina</option>
    </select>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const theme = ref('light')

onMounted(() => {
  const saved = localStorage.getItem('theme')
  theme.value = saved || 'light'
  document.documentElement.setAttribute('data-theme', theme.value)
})

const applyTheme = () => {
  document.documentElement.setAttribute('data-theme', theme.value)
  localStorage.setItem('theme', theme.value)
}
</script>

<style scoped>
.theme-switcher {
  display: inline-block;
}

select {
  padding: 10px 14px;
  border-radius: var(--radius);
  border: 1px solid #cbd5e1;
  background: var(--bg-soft);
  color: var(--text);
  font-size: 14px;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--shadow);
}

select:hover {
  transform: translateY(-2px);
}

option {
  background: var(--bg-soft);
  color: var(--text);
}
</style>
