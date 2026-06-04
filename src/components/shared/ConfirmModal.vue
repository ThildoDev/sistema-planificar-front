<template>
  <BaseModal @close="cancel">
    <template #header>
      <h3>{{ title }}</h3>
    </template>

    <template #body>
      <p>{{ message }}</p>
    </template>

    <template #footer>
      <button class="cancel" @click="cancel">Cancelar</button>
      <button class="confirm" @click="confirm">Confirmar</button>
    </template>
  </BaseModal>
</template>

<script setup>
import BaseModal from './BaseModal.vue'

defineProps({
  title: String,
  message: String
})

const emit = defineEmits(['confirm', 'cancel'])

const confirm = () => emit('confirm')
const cancel = () => emit('cancel')
</script>

<style scoped>
.cancel {
  background: #ccc;
  padding: 8px 14px;
  border-radius: 6px;
}
.confirm {
  background: #e74c3c;
  color: white;
  padding: 8px 14px;
  border-radius: 6px;
}
</style>
