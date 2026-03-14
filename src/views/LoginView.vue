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

const login = async () => {
  errorMessage.value = null
  loading.value = true

  try {
    await auth.login(email.value, password.value)
    // Redirigir al home tras login exitoso si es necesario
    router.push('/')
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
  <div class="login-wrapper">
    <div class="login-container">
      <div class="left-panel">
        <div class="brand">VALLE<span>EMPRENDE</span></div>
        <div class="content">
          <h1>Haz visible tu <br />emprendimiento 👋</h1>
          <p>
            Registra tu negocio, aumenta tu visibilidad y permite que más clientes te encuentren de
            forma rápida y sencilla.
          </p>
        </div>
      </div>

      <div class="right-panel">
        <div class="form-box">
          <header class="form-header">
            <h2>¡Bienvenido de nuevo!</h2>
            <p class="register-text">
              ¿Aún no tienes una cuenta?
              <span @click="goRegister">Regístrate ahora</span>
            </p>
          </header>

          <div class="input-group">
            <label>Correo electrónico</label>
            <input v-model="email" type="email" placeholder="ejemplo@correo.com" />
          </div>

          <div class="input-group">
            <label>Contraseña</label>
            <input v-model="password" type="password" placeholder="••••••••" />
          </div>

          <button class="btn-login" @click="login" :disabled="loading">
            <span v-if="!loading">Ingresar ahora</span>
            <span v-else class="loader"></span>
          </button>

          <p v-if="errorMessage" class="error-msg">
            {{ errorMessage }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

/* Contenedor principal para centrar todo */
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
  font-family: 'Inter', sans-serif;
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 1000px;
  height: 650px;
  display: flex;
  background: #fff;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.05);
}

/* PANEL IZQUIERDO - Estilo elegante y oscuro */
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
  max-width: 380px;
}

.footer-note {
  font-size: 0.8rem;
  color: #555;
}

/* PANEL DERECHO - Formulario Minimalista */
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

.register-text {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 40px;
}

.register-text span {
  color: #000;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
}

/* Inputs con estilo moderno */
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
  transition: all 0.2s ease;
  outline: none;
}

input:focus {
  background-color: #fff;
  border-color: #000;
  box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.03);
}

/* Botón de acción principal */
.btn-login {
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
  transition:
    transform 0.2s ease,
    background-color 0.2s ease;
}

.btn-login:hover:not(:disabled) {
  background-color: #222;
  transform: translateY(-1px);
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-msg {
  color: #e63946;
  font-size: 0.85rem;
  margin-top: 20px;
  text-align: center;
}

/* Loader simple */
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

/* Responsive para tablets y móviles */
@media (max-width: 900px) {
  .left-panel {
    display: none;
  }
  .login-container {
    max-width: 450px;
    height: auto;
    padding: 40px 20px;
  }
  .right-panel {
    padding: 0;
  }
}
</style>
