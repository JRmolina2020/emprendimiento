<template>
  <div class="container position-relative">
    <slot />

    <!-- Botones flotantes -->
    <div class="floating-buttons">
      <button class="fab" @click="go('business')">🏢</button>
      <button class="fab" @click="go('databusiness')">🏢</button>
      <button v-if="auth.role == 'admin'" class="fab" @click="go('admin')">⚙️</button>

      <button v-if="auth.role == 'admin'"" class="fab" @click="go('categorie')">📂</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/Auth'

const router = useRouter()
const auth = useAuthStore()

const go = (route) => {
  router.push(`/${route}`)
}
</script>

<style scoped>
.floating-buttons {
  position: fixed;
  bottom: 30px;
  right: 30px; /* 👈 cambiado */
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.fab {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  border: none;
  background: #2563eb;
  color: white;
  font-size: 22px;
  cursor: pointer;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  transition: 0.3s ease;
}

.fab:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}
</style>
