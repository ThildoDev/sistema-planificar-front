<template>
  <div class="empty">
    <div class="icon">
      <slot name="icon" />
    </div>
    <h3>{{ title }}</h3>
    <p>{{ message }}</p>

    <div class="action">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  message: String
})
</script>

<style scoped>
.empty {
  text-align: center;
  padding: 40px;
  color: #666;
}
.icon {
  font-size: 40px;
  margin-bottom: 10px;
}
.action {
  margin-top: 20px;
}
</style>
