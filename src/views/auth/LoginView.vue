<template>
  <div class="login-wrapper">
    <div class="login-card">
      <div class="login-header">
        <h1>SGE Pedagógico</h1>
        <p>Introduce tus credenciales para acceder al sistema</p>
      </div>

      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="form-group">
          <label for="email">Correo Electrónico / Usuario</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="ejemplo@escuela.edu.ar"
            required
            :disabled="authStore.loading"
          />
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="••••••••"
            required
            :disabled="authStore.loading"
          />
        </div>

        <div v-if="authStore.error" class="error-badge">
          {{ authStore.error }}
        </div>

        <button type="submit" class="submit-btn" :disabled="authStore.loading">
          <span v-if="authStore.loading">Validando credenciales...</span>
          <span v-else>Iniciar Sesión</span>
        </button>
      </form>

      <div class="login-footer">
        <p>
          Cuentas de prueba: <strong>docente@escuela.edu.ar</strong> o
          <strong>director@escuela.edu.ar</strong> (Clave: 123456)
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: '',
    }
  },
  setup() {
    // Inicializamos el store global de autenticación
    const authStore = useAuthStore()
    return { authStore }
  },
  methods: {
    async handleSubmit() {
      try {
        // Envia los datos al store de Pinia
        const user = await this.authStore.login(this.email, this.password)

        // RECONOCIMIENTO AUTOMÁTICO DE ROL PARA REDIRECCIÓN
        if (user.role === 'director') {
          this.$router.push('/director/dashboard')
        } else if (user.role === 'docente') {
          this.$router.push('/docente/dashboard')
        }
      } catch (error) {
        // El error ya es capturado y manejado por el store visualmente
        console.error('Error de login interceptado:', error.message)
      }
    },
  },
}
</script>

<style scoped>
.login-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-color: #f1f5f9;
  font-family: sans-serif;
}
.login-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  max-width: 420px;
  width: 100%;
}
.login-header h1 {
  color: #1e293b;
  font-size: 1.7rem;
  margin-bottom: 6px;
  text-align: center;
}
.login-header p {
  color: #64748b;
  font-size: 0.88rem;
  margin-bottom: 28px;
  text-align: center;
}
.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #334155;
}
.form-group input {
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}
.form-group input:focus {
  border-color: #2563eb;
}
.error-badge {
  background-color: #fef2f2;
  color: #ef4444;
  padding: 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  border: 1px solid #fecaca;
  line-height: 1.3;
}
.submit-btn {
  background-color: #2563eb;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background-color 0.2s;
  margin-top: 8px;
}
.submit-btn:hover {
  background-color: #1d4ed8;
}
.submit-btn:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}
.login-footer {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
  font-size: 0.78rem;
  color: #64748b;
  text-align: center;
}
</style>
