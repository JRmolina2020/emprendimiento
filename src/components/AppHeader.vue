<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/Auth'
import { useRouter, RouterLink } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const logout = async () => {
  await auth.logout()
}
</script>

<template>
  <header class="app-header">
    <div class="container">
      <div class="logo">🚀</div>

      <button class="menu-toggle" @click="toggleMenu">
        <span :class="{ 'bar-top': isMenuOpen }"></span>
        <span :class="{ 'bar-mid': isMenuOpen }"></span>
        <span :class="{ 'bar-bot': isMenuOpen }"></span>
      </button>

      <nav :class="{ 'nav-open': isMenuOpen }">
        <div class="nav-links">
          <RouterLink
            v-if="auth.role === 'admin'"
            to="/categorie"
            class="btn-vibrant"
            @click="isMenuOpen = false"
          >
            Categorías
          </RouterLink>

          <RouterLink to="/business" class="btn-vibrant" @click="isMenuOpen = false"
            >Negocios</RouterLink
          >
          <RouterLink to="/databusiness" class="btn-vibrant" @click="isMenuOpen = false"
            >Datos</RouterLink
          >

          <RouterLink
            v-if="auth.role === 'admin'"
            to="/admin"
            class="btn-vibrant"
            @click="isMenuOpen = false"
          >
            Admin
          </RouterLink>
        </div>

        <div class="auth-section">
          <span class="status-badge">Activo</span>
          <span class="user-email">{{ auth.user?.email }}</span>
          <button class="btn-logout" @click="logout">Cerrar sesión</button>
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');

/* Header Blanco y Minimalista */
.app-header {
  background: #ffffff;
  color: #1a1a1a;
  padding: 15px 30px; /* Un poco más de aire vertical */
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid #f0f0f0; /* Borde sutil como el del feed */
}

.container {
  max-width: 1400px; /* Expandido para más espacio */
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Logo Minimalista (Un cohete negro por ahora) */
.logo {
  font-size: 1.6rem;
  font-weight: 800;
  color: #000;
  cursor: pointer;
}

/* === CORRECCIÓN DE BOTONES: FONDO NEGRO, LETRA BLANCA === */
.btn-vibrant {
  background: #000; /* Negro sólido */
  color: #fff !important; /* Letra blanca pura */
  padding: 10px 24px;
  border-radius: 50px; /* Estilo cápsula */
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  border: none;
  display: inline-block;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn-vibrant:hover {
  transform: translateY(-2px);
  background: #222; /* Un gris muy oscuro al hover */
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

/* Badge "Activo" - Mantener verde pero más sutil */
.status-badge {
  color: #10b981; /* Verde esmeralda para el texto */
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
  background: transparent;
  border: 1px solid #10b981;
}

nav {
  display: flex;
  gap: 30px;
  align-items: center;
}

.nav-links {
  display: flex;
  gap: 12px;
}

.auth-section {
  display: flex;
  align-items: center;
  gap: 15px;
  padding-left: 20px;
  border-left: 1px solid #eee;
}

.user-email {
  font-size: 0.85rem;
  color: #666;
  font-weight: 500;
}

/* Botón Cerrar sesión - Borde negro, letra negra */
.btn-logout {
  background: transparent;
  color: #000;
  border: 1px solid #000;
  padding: 8px 18px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
  transition:
    background 0.2s,
    color 0.2s;
}

.btn-logout:hover {
  background: #000;
  color: #fff;
}

/* === RESPONSIVE - Manteniendo la lógica pero con nuevos colores === */
.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
}

.menu-toggle span {
  width: 25px;
  height: 2px;
  background: #000; /* Hamburguesa negra */
  border-radius: 2px;
  transition: 0.3s;
}

@media (max-width: 1024px) {
  .menu-toggle {
    display: flex;
  }

  nav {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: white;
    flex-direction: column;
    padding: 30px;
    gap: 30px;
    display: none;
    border-bottom: 1px solid #eee;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  }

  nav.nav-open {
    display: flex;
  }

  .nav-links {
    flex-direction: column;
    width: 100%;
    gap: 15px;
  }

  .btn-vibrant {
    width: 100%;
    padding: 12px;
  }

  .auth-section {
    width: 100%;
    flex-direction: column;
    border-left: none;
    border-top: 1px solid #eee;
    padding-top: 25px;
    padding-left: 0;
    gap: 20px;
    align-items: flex-start;
  }

  .user-email {
    width: 100%;
    text-align: left;
  }
}

/* Animación Hamburguesa (Igual) */
.bar-top {
  transform: rotate(45deg) translate(6px, 6px);
}
.bar-mid {
  opacity: 0;
}
.bar-bot {
  transform: rotate(-45deg) translate(6px, -6px);
}
</style>
