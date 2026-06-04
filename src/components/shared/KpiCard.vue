<template>
  <div class="kpi-card">
    <div class="icon">
      <component :is="icon" />
    </div>
    <div class="info">
      <h3>{{ title }}</h3>
      <p>{{ value }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: [String, Number],
  icon: Object
})
</script>

<style scoped>
.kpi-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  gap: 15px;
  align-items: center;
}
.icon {
  font-size: 28px;
}
</style>
