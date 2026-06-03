<template>
  <div class="login-container">
    <h1 class="title">Iniciar sesión</h1>

   <form @submit.prevent="submitLogin" class="login-form">
      <div class="form-group">
        <label>Email</label>
        <input v-model="email" type="email" required />
      </div>

      <div class="form-group">
        <label>Contraseña</label>
        <input v-model="password" type="password" required/>
      </div>

      <p v-if="error" class="error-msg">{{ error }}</p>

      <button type="submit" :disabled="loading">
        <span v-if="loading">Cargando...</span>
        <span v-else>Ingresar</span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import useAuth from '@/composables/useAuth'

const { login, loading, error } = useAuth()

const email = ref('')
const password = ref('')

const submitLogin = async () => {
  await login(email.value, password.value)
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 80px auto;
  padding: 30px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}
.title {
  text-align: center;
  margin-bottom: 20px;
}
.form-group {
  margin-bottom: 15px;
}
.error-msg {
  color: red;
  margin-bottom: 10px;
}
button {
  width: 100%;
  padding: 10px;
}
</style>
