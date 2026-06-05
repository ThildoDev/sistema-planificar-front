<template>
  <div class="pagination">
    <button :disabled="page === 1" @click="prevPage">«</button>
    <span>Página {{ page }} de {{ totalPages }}</span>
    <button :disabled="page === totalPages" @click="nextPage">»</button>
  </div>
</template>

<script setup>
defineProps({
  page: Number,
  totalPages: Number
})
const emit = defineEmits(['update:page'])
const prevPage = () => emit('update:page', Math.max(1, page - 1))
const nextPage = () => emit('update:page', Math.min(totalPages, page + 1))
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}
button {
  background: #3498db;
  color: white;
  border-radius: 6px;
  padding: 6px 12px;
}
button:disabled {
  background: #ccc;
}
</style>
