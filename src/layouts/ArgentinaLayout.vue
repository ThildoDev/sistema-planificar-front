<template>
  <div class="layout-argentina">
    <SidebarArgentina class="sidebar" />

    <div class="main">
      <NavbarArgentina class="navbar" />

      <div class="content fade-in">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup>
import SidebarArgentina from '@/components/layout/SidebarArgentina.vue'
import NavbarArgentina from '@/components/layout/NavbarArgentina.vue'
</script>

<style scoped>
.layout-argentina {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  width: 240px;
  flex-shrink: 0;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--bg);
}

.navbar {
  flex-shrink: 0;
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

@media (max-width: 900px) {
  .sidebar {
    display: none;
  }

  .layout-argentina {
    flex-direction: column;
  }
}
</style>
