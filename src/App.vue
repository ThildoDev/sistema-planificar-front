<script setup>
import { RouterView } from 'vue-router'
import ToastNotification from '@/components/shared/ToastNotification.vue'
</script>

<template>
  <RouterView />

  <ToastNotification />
</template>

<style>
html,
body,
#app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: #f8fafc; /* Equivale a bg-slate-50 */
}
</style>
