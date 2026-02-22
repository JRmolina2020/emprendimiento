<script setup>
import { onMounted } from 'vue'
import { useBusinessStore } from '@/stores/businnessStore'
import BaseContainer from '@/components/BaseContainer.vue'
import AppHeader from '@/components/AppHeader.vue'
import { useCategoryStore } from '@/stores/categoryStore'

const businessStore = useBusinessStore()
const categoryStore = useCategoryStore()

onMounted(() => {
  businessStore.fetchMyBusiness()
  categoryStore.fetchAllCategories()
})
const isSelected = (categoryId) => {
  if (!businessStore.business?.business_categories) return false

  return businessStore.business.business_categories.some(
    (item) => item.category_id === categoryId || item.categories?.id === categoryId,
  )
}
</script>

<template>
  a
  <AppHeader />
  <BaseContainer>
    <div class="container mt-4">
      <div v-if="businessStore.business" class="business-card mx-auto shadow mt-3">
        <!-- Header con gradiente -->
        <div class="card-header-custom text-center">
          <h4 class="mb-1 text-white">
            {{ businessStore.business.name }}
          </h4>

          <span
            class="badge mt-2"
            :class="businessStore.business.status ? 'bg-success' : 'bg-danger'"
          >
            {{ businessStore.business.status ? 'Activo' : 'Bloqueado' }}
          </span>
        </div>

        <!-- Body -->
        <div class="card-body p-4">
          <div class="info-item">
            <strong>Ciudad:</strong>
            <span>{{ businessStore.business.city }}</span>
          </div>

          <div class="info-item">
            <strong>Dirección:</strong>
            <span>{{ businessStore.business.direction }}</span>
          </div>

          <div class="info-item">
            <strong>Teléfono:</strong>
            <span>{{ businessStore.business.phone }}</span>
          </div>

          <div class="info-item" v-if="businessStore.business.instagram">
            <strong>Instagram:</strong>
            <a :href="businessStore.business.instagram" target="_blank">
              @{{ businessStore.business.instagram }}
            </a>
          </div>

          <hr />

          <p class="text-muted small mt-3">
            {{ businessStore.business.description }}
          </p>

          <div class="d-flex justify-content-center gap-2 mt-4">
            <button class="btn btn-warning btn-sm px-3" @click="businessStore.toggleStatus()">
              {{ businessStore.business.status ? 'Bloquear' : 'Desbloquear' }}
            </button>

            <button class="btn btn-danger btn-sm px-3" @click="businessStore.deleteBusiness()">
              Eliminar
            </button>
          </div>
        </div>
      </div>
      <div class="all-categories mt-5">
        <h5 class="mb-3">Características disponibles</h5>

        <div class="category-list">
          <span
            v-for="cat in categoryStore.categories"
            :key="cat.id"
            class="category-pill"
            :class="isSelected(cat.id) ? 'selected' : ''"
            @click="businessStore.toggleCategory(cat.id)"
          >
            {{ cat.name }}
          </span>
        </div>
      </div>
    </div>
  </BaseContainer>
</template>

<style scoped>
.business-card {
  max-width: 450px;
  border-radius: 14px;
  overflow: hidden;
  background: #fff;
}

.card-header-custom {
  background: linear-gradient(135deg, #e056fd, #686de0);
  padding: 30px 20px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.info-item strong {
  color: #555;
}

.card-body {
  font-size: 14px;
}

/*  */
.all-categories {
  max-width: 600px;
  margin: auto;
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.category-pill {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  background: #f1f3f5;
  transition: 0.2s ease;
}

.category-pill:hover {
  transform: scale(1.05);
}

.category-pill.selected {
  background: linear-gradient(135deg, #686de0, #e056fd);
  color: white;
}
</style>
