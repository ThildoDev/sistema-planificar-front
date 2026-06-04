<template>
  <div class="overlay" @click="closeOnOverlay">
    <div class="modal" @click.stop>
      <header class="modal-header">
        <slot name="header" />
      </header>

      <section class="modal-body">
        <slot name="body" />
      </section>

      <footer class="modal-footer">
        <slot name="footer" />
      </footer>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'

const emit = defineEmits(['close'])

const closeOnOverlay = () => emit('close')

const handleEsc = (e) => {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => window.addEventListener('keydown', handleEsc))
onBeforeUnmount(() => window.removeEventListener('keydown', handleEsc))
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal {
  background: white;
  width: 450px;
  border-radius: 10px;
  overflow: hidden;
}
.modal-header,
.modal-footer {
  padding: 15px;
  background: #f5f5f5;
}
.modal-body {
  padding: 20px;
}
</style>
