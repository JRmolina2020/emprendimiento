<script setup>
import '@/assets/auth.css'
import { ref } from 'vue'
import { useAuthStore } from '@/stores/Auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref(null)
const loading = ref(false)

const login = async () => {
  errorMessage.value = null
  loading.value = true

  try {
    await auth.login(email.value, password.value)
  } catch (err) {
    errorMessage.value = err.message
  } finally {
    loading.value = false
  }
}

const goRegister = () => {
  router.push('/register')
}
</script>

<template>
  <div class="login-container">
    <!-- Panel izquierdo -->
    <div class="left-panel">
      <h1>Haz visible tu <br />emprendimiento 👋</h1>
      <p>
        Registra tu negocio, aumenta tu visibilidad y permite que más clientes te encuentren de
        forma rápida y sencilla.
      </p>
    </div>

    <!-- Panel derecho -->
    <div class="right-panel">
      <div class="form-box">
        <h2>¡Bienvenido de nuevo!</h2>

        <p class="register-text">
          ¿Aún no tienes una cuenta?
          <span @click="goRegister">Regístrate ahora</span>
        </p>

        <input v-model="email" type="email" placeholder="Email" />

        <input v-model="password" type="password" placeholder="Password" />

        <button @click="login" :disabled="loading">
          <span v-if="!loading">Login Now</span>
          <span v-else class="loader"></span>
        </button>

        <p v-if="errorMessage" class="error">
          {{ errorMessage }}
        </p>
      </div>
    </div>
  </div>
</template>
