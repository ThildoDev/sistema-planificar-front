<template>
  <div class="layout">
    <AppSidebar />
    <div class="content">
      <AppNavbar />
      <main class="page">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import AppSidebar from '@/components/shared/AppSidebar.vue'
import AppNavbar from '@/components/shared/AppNavbar.vue'
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
}
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.page {
  padding: 20px;
  overflow-y: auto;
}
</style>
