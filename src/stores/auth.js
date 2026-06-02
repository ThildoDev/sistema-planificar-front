// AUTH DE PRUEBA DATOS HARDCODEADOS PARA SIMULAR UN USUARIO LOGUEADO, CON ROL DOCENTE.
// ESTE STORE SE USARÁ EN LOS COMPONENTES PARA CONTROLAR EL ACCESO A FUNCIONALIDADES SEGÚN EL ROL DEL USUARIO.
// SI ES NECESARIO, PODÉS MODIFICAR EL OBJETO USER PARA SIMULAR OTROS ROLES (ADMIN, DIRECTOR) O USUARIOS NO LOGUEADOS (USER: NULL).
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // Simulación del estado del usuario actualmente logueado
  const user = ref({
    id: 1,
    name: 'Ana García',
    email: 'agarcia@escuela.edu.ar',
    role: 'docente' // Podés cambiarlo a 'admin' o 'director' para probar tus componentes
  })

  // Getter para obtener el rol, igual a como lo lee tu useUsuarios.js
  const userRole = computed(() => user.value?.role || 'user')

  // Helpers que usarás en el futuro cuando conectes el backend
  function logout() {
    user.value = null
  }

  return {
    user,
    userRole,
    logout
  }
})
