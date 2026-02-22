<script setup>
import { ref, onMounted, watch } from 'vue'
import { useBusinessStore } from '@/stores/businnessStore'
import { useCategoryStore } from '@/stores/categoryStore'
import AppHeader from '@/components/PublicNavar.vue'
import PublicNavar from '@/components/PublicNavar.vue'

const businessStore = useBusinessStore()
const categoryStore = useCategoryStore()

const search = ref('')
const selectedCategory = ref(null)

onMounted(() => {
  businessStore.fetchPublicBusinesses()
  categoryStore.fetchAllCategories()
})

watch([search, selectedCategory], () => {
  businessStore.fetchPublicBusinesses(search.value, selectedCategory.value)
})
</script>

<template>
  <PublicNavar></PublicNavar>
  <div class="container mt-5">
    <h3 class="text-center mb-4 fw-bold">Explora Emprendimientos</h3>

    <!-- Buscador -->
    <div class="search-box mb-3">
      <input
        v-model="search"
        type="text"
        class="form-control search-input"
        placeholder="Buscar emprendimiento..."
      />
    </div>

    <!-- Filtro categorías -->
    <div class="category-filter mb-4">
      <span
        class="category-chip"
        :class="{ active: selectedCategory === null }"
        @click="selectedCategory = null"
      >
        Todas
      </span>

      <span
        v-for="cat in categoryStore.categories"
        :key="cat.id"
        class="category-chip"
        :class="{ active: selectedCategory === cat.id }"
        @click="selectedCategory = cat.id"
      >
        {{ cat.name }}
      </span>
    </div>

    <!-- Loading -->
    <div v-if="businessStore.loading" class="text-center">Cargando...</div>

    <!-- Cards -->
    <div class="row g-4">
      <div v-for="business in businessStore.businesses" :key="business.id" class="col-md-4">
        <div class="market-card text-center">
          <!-- Imagen circular -->
          <div class="avatar-wrapper">
            <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" class="avatar" />
          </div>

          <h5 class="fw-semibold mt-3">
            {{ business.name }}
          </h5>

          <p class="text-muted small mb-1">📍 {{ business.city }}</p>

          <p class="text-muted small">
            {{ business.description }}
          </p>

          <a
            v-if="business.instagram"
            :href="business.instagram"
            target="_blank"
            class="btn btn-sm btn-success mt-2"
          >
            Instagram
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Buscador */
.search-input {
  border-radius: 30px;
  padding: 10px 18px;
}

/* Categorías */
.category-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.category-chip {
  padding: 6px 14px;
  border-radius: 20px;
  background: #f1f3f5;
  cursor: pointer;
  font-size: 13px;
  transition: 0.2s ease;
}

.category-chip:hover {
  transform: scale(1.05);
}

.category-chip.active {
  background: linear-gradient(135deg, #686de0, #e056fd);
  color: white;
}

/* Cards estilo marketplace */
.market-card {
  background: white;
  border-radius: 18px;
  padding: 30px 20px;
  box-shadow: 0 5px 18px rgba(0, 0, 0, 0.08);
  transition: 0.3s ease;
}

.market-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

/* Avatar */
.avatar-wrapper {
  display: flex;
  justify-content: center;
}

.avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #f1f3f5;
}
</style>
