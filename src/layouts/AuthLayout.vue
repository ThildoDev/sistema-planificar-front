<template>
  <div class="auth-layout">
    <main class="auth-content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.auth-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f5f6fa;
}
.auth-content {
  width: 100%;
  max-width: 420px;
}
</style>
