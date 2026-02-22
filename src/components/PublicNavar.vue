<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const go = (route) => {
  router.push(`/${route}`)
}
</script>

<template>
  <!-- Barra superior -->
  <div class="top-banner">🚀 Conecta con los mejores emprendimientos de tu ciudad</div>

  <!-- Navbar -->
  <nav class="main-navbar">
    <div class="container navbar-content">
      <!-- Logo -->
      <div class="brand" @click="go('')">
        <span class="logo-icon">📂</span>
        Directorio de Emprendimientos
      </div>

      <!-- Botones -->
      <div class="nav-actions">
        <button class="btn-register" @click="go('login')">Iniciar sesión</button>

        <button class="btn-register" @click="go('register')">Regístrate</button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* 🔥 Barra superior con degradado oscuro */
.top-banner {
  background: linear-gradient(90deg, #111827, #1f2937);
  color: #f9fafb;
  text-align: center;
  padding: 10px 0;
  font-size: 14px;
  letter-spacing: 0.5px;
}

/* 🔥 Navbar glass con degradado */
.main-navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(12px);
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.8));
  padding: 18px 0;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
}

/* Contenido */
.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Logo */
.brand {
  font-weight: 700;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(90deg, #8e44ad, #2ecc71);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: 0.3s ease;
}

.brand:hover {
  transform: translateY(-2px);
}

.logo-icon {
  font-size: 22px;
}

/* Botones */
.nav-actions {
  display: flex;
  gap: 14px;
}

/* Login elegante */
.btn-login {
  background: transparent;
  border: 1px solid #d1d5db;
  padding: 7px 18px;
  border-radius: 25px;
  font-weight: 500;
  cursor: pointer;
  transition: 0.3s ease;
}

.btn-login:hover {
  background: #f3f4f6;
  transform: translateY(-2px);
}

/* Register llamativo */
.btn-register {
  background: linear-gradient(135deg, #8e44ad, #2ecc71);
  border: none;
  color: white;
  padding: 8px 22px;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s ease;
  box-shadow: 0 8px 20px rgba(142, 68, 173, 0.3);
}

.btn-register:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(46, 204, 113, 0.4);
}
</style>
