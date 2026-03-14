<script setup>
import { ref, onMounted, watch } from 'vue'
import { useBusinessStore } from '@/stores/businnessStore'
import { useCategoryStore } from '@/stores/categoryStore'
import { useAuthStore } from '@/stores/Auth'

const businessStore = useBusinessStore()
const categoryStore = useCategoryStore()
const authStore = useAuthStore()

// --- ESTADOS DE LA PÁGINA ---
const search = ref('')
const selectedCategory = ref(null)
const defaultImage = '/imagp.jpg'
let debounceTimeout = null

// --- ESTADOS DEL MODAL ---
const showAuthModal = ref(false)
const authMode = ref('login')
const email = ref('')
const password = ref('')
const loadingAuth = ref(false)
const errorMessage = ref(null)

onMounted(() => {
  businessStore.fetchPublicBusinesses()
  categoryStore.fetchAllCategories()
})

watch([search, selectedCategory], ([newSearch, newCat]) => {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    businessStore.fetchPublicBusinesses(newSearch, newCat)
  }, 400)
})

const openModal = (mode) => {
  authMode.value = mode
  showAuthModal.value = true
  errorMessage.value = null
  email.value = ''
  password.value = ''
}

const handleAuth = async () => {
  errorMessage.value = null
  loadingAuth.value = true
  try {
    if (authMode.value === 'login') {
      await authStore.login(email.value, password.value)
    } else {
      await authStore.register(email.value, password.value)
    }
    showAuthModal.value = false
  } catch (err) {
    errorMessage.value = err.message
  } finally {
    loadingAuth.value = false
  }
}
</script>

<template>
  <div class="app-container">
    <nav class="top-nav">
      <div class="nav-inner">
        <div class="logo">VALLE<span>EMPRENDE</span></div>
        <div class="nav-links">
          <button @click="openModal('login')" class="btn-login-nav">Entrar</button>
          <button @click="openModal('register')" class="btn-register-nav">Registrarme</button>
        </div>
      </div>
    </nav>

    <main class="main-layout">
      <aside class="sidebar-categories">
        <div class="sidebar-header">
          <h2>Categorías</h2>
        </div>

        <div class="categories-list">
          <button
            @click="selectedCategory = null"
            :class="['category-item', { active: selectedCategory === null }]"
          >
            Todas
          </button>

          <button
            v-for="cat in categoryStore.categories"
            :key="cat.id"
            @click="selectedCategory = cat.id"
            :class="['category-item', { active: selectedCategory === cat.id }]"
          >
            {{ cat.name }}
          </button>
        </div>
      </aside>

      <section class="feed-content">
        <header class="content-header">
          <h1 class="title-thin">Lo mejor de nuestra tierra, hecho para ti</h1>
          <div class="search-container">
            <input
              v-model="search"
              type="text"
              placeholder="¿Qué estás buscando hoy?"
              class="capsule-input"
            />
          </div>
        </header>

        <div v-if="businessStore.loading" class="loading-state">
          <div class="spinner"></div>
        </div>

        <div v-else class="business-grid">
          <div v-for="item in businessStore.businesses" :key="item.id" class="business-card">
            <div class="card-media">
              <div class="avatar-wrapper">
                <img :src="item.image_url || defaultImage" alt="Logo" class="avatar-img" />
              </div>
              <div class="location-tag">{{ item.city }}</div>
            </div>
            <div class="card-info">
              <h3 class="business-title">{{ item.name }}</h3>
              <p class="business-desc">{{ item.phone }}</p>
              <div class="card-footer">
                <a v-if="item.instagram" :href="item.instagram" target="_blank" class="ig-link"
                  >Instagram ↗</a
                >
                <button v-else class="btn-card-action">Ver detalles</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <Transition name="fade">
      <div v-if="showAuthModal" class="modal-overlay" @click.self="showAuthModal = false">
        <div class="modal-content">
          <button class="close-btn" @click="showAuthModal = false">&times;</button>

          <div class="auth-form">
            <h2>{{ authMode === 'login' ? '¡Bienvenido!' : 'Únete a nosotros' }}</h2>
            <p class="auth-subtitle">
              {{ authMode === 'login' ? '¿No tienes cuenta?' : '¿Ya eres miembro?' }}
              <span @click="authMode = authMode === 'login' ? 'register' : 'login'">
                {{ authMode === 'login' ? 'Crea una' : 'Inicia sesión' }}
              </span>
            </p>

            <div class="input-group">
              <label>Correo electrónico</label>
              <input v-model="email" type="email" placeholder="email@ejemplo.com" />
            </div>

            <div class="input-group">
              <label>Contraseña</label>
              <input v-model="password" type="password" placeholder="••••••••" />
            </div>

            <button class="btn-auth-submit" @click="handleAuth" :disabled="loadingAuth">
              <span v-if="!loadingAuth">{{
                authMode === 'login' ? 'Iniciar Sesión' : 'Registrarme Ahora'
              }}</span>
              <span v-else class="loader"></span>
            </button>

            <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;800&display=swap');

.app-container {
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #fff;
}

/* --- NAVEGACIÓN --- */
.top-nav {
  height: 75px;
  border-bottom: 1px solid #f2f2f2;
  display: flex;
  align-items: center;
  padding: 0 2.5rem;
}
.nav-inner {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}
.logo {
  font-weight: 800;
  font-size: 1.2rem;
  color: #000;
}
.logo span {
  font-weight: 300;
  color: #888;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

/* Botón Entrar (Texto Negro) */
.btn-login-nav {
  background: transparent;
  border: none;
  color: #000;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 8px 12px;
}

/* Botón Registrarme (Negro Sólido) */
.btn-register-nav {
  background: #000;
  color: #fff;
  border: none;
  padding: 10px 24px;
  border-radius: 25px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn-register-nav:hover {
  opacity: 0.8;
}

/* --- LAYOUT Y SIDEBAR --- */
.main-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}
.sidebar-categories {
  width: 250px;
  border-right: 1px solid #f2f2f2;
  background: #fff;
}
.sidebar-header {
  padding: 2.5rem 1.5rem 1rem;
}
.sidebar-header h2 {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #bbb;
  letter-spacing: 1.5px;
}

.categories-list {
  padding: 1rem;
}
.category-item {
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 5px;
  border: none;
  background: transparent;
  text-align: left;
  font-size: 0.95rem;
  color: #666;
  cursor: pointer;
  border-radius: 12px;
  transition: 0.2s;
}
.category-item:hover {
  background: #f5f5f5;
  color: #000;
}
.category-item.active {
  background: #000 !important;
  color: #fff !important;
}

/* --- CONTENIDO --- */
.feed-content {
  flex: 1;
  overflow-y: auto;
  padding: 3rem;
  background: #fff;
}
.title-thin {
  font-size: 2.8rem;
  font-weight: 300;
  text-align: center;
  margin-bottom: 2rem;
}
.capsule-input {
  display: block;
  width: 100%;
  max-width: 500px;
  margin: 0 auto 3rem;
  padding: 16px 25px;
  border-radius: 30px;
  border: 1px solid #eee;
  background: #f9f9f9;
  outline: none;
  font-size: 1rem;
}

/* --- GRID Y CARDS --- */
.business-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}
.business-card {
  border: 1px solid #f0f0f0;
  border-radius: 20px;
  overflow: hidden;
}
.card-media {
  height: 180px;
  background: #fbfbfb;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.avatar-img {
  width: 80px;
  height: 80px;
  object-fit: contain;
}
.location-tag {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #fff;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.card-info {
  padding: 1.5rem;
  text-align: center;
}
.business-title {
  font-size: 1.2rem;
  margin: 10px 0;
}
.btn-card-action {
  width: 100%;
  padding: 12px;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
}
.ig-link {
  color: #000;
  font-weight: 300;
  text-decoration: none;
}

/* --- MODAL --- */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
}
.modal-content {
  background: #fff;
  padding: 40px;
  border-radius: 25px;
  width: 90%;
  max-width: 400px;
  position: relative;
}
.auth-form h2 {
  font-weight: 700;
  margin-bottom: 10px;
  color: #000;
}
.auth-subtitle span {
  color: #000;
  font-weight: 700;
  text-decoration: underline;
  cursor: pointer;
}

.input-group {
  margin-bottom: 20px;
  text-align: left;
}
.input-group label {
  display: block;
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 8px;
}
.input-group input {
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid #eee;
  background: #f9f9f9;
}

/* Botón del Modal (Siempre visible, Negro Sólido) */
.btn-auth-submit {
  width: 100%;
  padding: 16px;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 10px;
  transition: transform 0.1s;
}
.btn-auth-submit:active {
  transform: scale(0.98);
}

.error-msg {
  color: #ff4d4d;
  margin-top: 15px;
  font-size: 0.85rem;
  text-align: center;
}
.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
}

/* Animación */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .main-layout {
    flex-direction: column;
  }
  .sidebar-categories {
    width: 100%;
    border-right: none;
  }
  .categories-list {
    display: flex;
    overflow-x: auto;
    padding: 10px;
  }
  .category-item {
    white-space: nowrap;
    width: auto;
  }
}
</style>
