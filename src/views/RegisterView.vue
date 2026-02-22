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

const register = async () => {
  errorMessage.value = null
  loading.value = true

  try {
    await auth.register(email.value, password.value)
  } catch (err) {
    errorMessage.value = err.message
  } finally {
    loading.value = false
  }
}

const goLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="login-container">
    <div class="left-panel">
      <h1>Haz visible tu emprendimiento 🚀</h1>
      <p>
        Bienvenido emprendedor. Publica tu negocio en nuestro directorio y permite que más personas
        te encuentren fácilmente.
      </p>
    </div>

    <div class="right-panel">
      <div class="form-box">
        <h2>Regístrate</h2>

        <p class="register-text">
          ¿Ya formas parte de nuestra comunidad?
          <span @click="goLogin">Ingresa</span>
        </p>

        <input v-model="email" type="email" placeholder="Email" />
        <input v-model="password" type="password" placeholder="Password" />

        <button @click="register" :disabled="loading">
          <span v-if="!loading">Crear mi cuenta</span>
          <span v-else class="loader"></span>
        </button>

        <p v-if="errorMessage" class="error">
          {{ errorMessage }}
        </p>
      </div>
    </div>
  </div>
</template>
