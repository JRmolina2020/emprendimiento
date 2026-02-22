<script setup>
import { useAuthStore } from '@/stores/Auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const logout = async () => {
  await auth.logout()
}
</script>

<template>
  <header class="app-header">
    <div class="container">
      <div class="logo">🚀 EmprendeApp</div>

      <nav>
        <span>{{ auth.user?.email }}</span>
        <button @click="logout">Cerrar sesión</button>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background: #1e3a8a;
  color: white;
  padding: 15px 20px;
}

.container {
  max-width: 1200px;
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

nav {
  display: flex;
  gap: 20px;
  align-items: center;
}

button {
  background: white;
  color: #1e3a8a;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
}
</style>
