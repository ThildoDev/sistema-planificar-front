<template>
  <div :class="['spinner-container', { overlay }]">
    <div class="spinner"></div>
  </div>
</template>

<script setup>
defineProps({
  overlay: { type: Boolean, default: false }
})
</script>

<style scoped>
.spinner-container {
  display: flex;
  justify-content: center;
  padding: 20px;
}
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(255,255,255,0.7);
  align-items: center;
}
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #ddd;
  border-top-color: #3498db;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
