<script setup>
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
    // Redirigir al dashboard o home tras registro exitoso
    router.push('/')
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
  <div class="auth-wrapper">
    <div class="auth-container">
      <div class="left-panel">
        <div class="brand">VALLE<span>EMPRENDE</span></div>
        <div class="content">
          <h1>Haz visible tu <br />emprendimiento 🚀</h1>
          <p>
            Bienvenido emprendedor. Publica tu negocio en nuestro directorio y permite que más
            personas te encuentren fácilmente en toda la región.
          </p>
        </div>
        <div class="footer-note">Únete a la red de talento local más grande.</div>
      </div>

      <div class="right-panel">
        <div class="form-box">
          <header class="form-header">
            <h2>Crea tu cuenta</h2>
            <p class="login-prompt">
              ¿Ya formas parte de nuestra comunidad?
              <span @click="goLogin">Ingresa aquí</span>
            </p>
          </header>

          <div class="input-group">
            <label>Correo electrónico</label>
            <input v-model="email" type="email" placeholder="tu@email.com" />
          </div>

          <div class="input-group">
            <label>Contraseña</label>
            <input v-model="password" type="password" placeholder="Mínimo 6 caracteres" />
          </div>

          <button class="btn-primary" @click="register" :disabled="loading">
            <span v-if="!loading">Comenzar ahora</span>
            <span v-else class="loader"></span>
          </button>

          <p v-if="errorMessage" class="error-msg">
            {{ errorMessage }}
          </p>

          <p class="terms">
            Al registrarte, aceptas nuestros <strong>Términos y Condiciones</strong>.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

/* Reset y Contenedor Principal */
.auth-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
  font-family: 'Inter', sans-serif;
  padding: 20px;
}

.auth-container {
  width: 100%;
  max-width: 1000px;
  height: 650px;
  display: flex;
  background: #fff;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.05);
}

/* PANEL IZQUIERDO */
.left-panel {
  flex: 1;
  background-color: #000;
  color: #fff;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.brand {
  font-weight: 800;
  letter-spacing: -0.5px;
  font-size: 1.2rem;
}
.brand span {
  font-weight: 300;
  color: #888;
}

.left-panel h1 {
  font-size: 2.5rem;
  font-weight: 600;
  line-height: 1.1;
  margin-bottom: 20px;
}

.left-panel p {
  color: #aaa;
  font-size: 1.1rem;
  line-height: 1.6;
}

.footer-note {
  font-size: 0.8rem;
  color: #555;
}

/* PANEL DERECHO */
.right-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
}

.form-box {
  width: 100%;
  max-width: 340px;
}

.form-header h2 {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #111;
}

.login-prompt {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 40px;
}

.login-prompt span {
  color: #000;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
}

/* Inputs */
.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  font-size: 0.8rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

input {
  width: 100%;
  padding: 14px 18px;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  background-color: #f9f9f9;
  font-size: 0.95rem;
  outline: none;
  transition: 0.2s;
}

input:focus {
  background-color: #fff;
  border-color: #000;
}

/* Botón Principal */
.btn-primary {
  width: 100%;
  padding: 16px;
  margin-top: 10px;
  border-radius: 12px;
  border: none;
  background-color: #000;
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background-color: #222;
  transform: translateY(-1px);
}

.terms {
  font-size: 0.75rem;
  color: #999;
  text-align: center;
  margin-top: 25px;
  line-height: 1.4;
}

.error-msg {
  color: #e63946;
  font-size: 0.85rem;
  margin-top: 20px;
  text-align: center;
}

/* Loader */
.loader {
  width: 20px;
  height: 20px;
  border: 2px solid #fff;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 900px) {
  .left-panel {
    display: none;
  }
  .auth-container {
    max-width: 450px;
    height: auto;
    padding: 40px 20px;
  }
  .right-panel {
    padding: 0;
  }
}
</style>
