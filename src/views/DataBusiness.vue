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
  <AppHeader />
  <BaseContainer>
    <div class="container mt-4 pb-5">
      <div v-if="businessStore.business" class="business-card mx-auto shadow mt-3">
        <div class="card-header-custom text-center">
          <div class="profile-image-container mb-3">
            <img
              :src="businessStore.business.image_url || 'https://via.placeholder.com/150'"
              alt="Logo del negocio"
              class="business-logo-view"
            />
          </div>

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
            <a :href="businessStore.business.instagram" target="_blank" class="insta-link">
              @{{ businessStore.business.instagram.split('/').pop() }}
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
        <h5 class="mb-3">Características seleccionadas</h5>
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
  border-radius: 20px; /* Un poco más redondeado */
  overflow: hidden;
  background: #fff;
}

.card-header-custom {
  /* Usando el gradiente púrpura/violeta de tus imágenes */
  background: linear-gradient(135deg, #c042ff, #7a5fff);
  padding: 40px 20px;
}

/* Estilos para la imagen circular en la vista */
.profile-image-container {
  display: flex;
  justify-content: center;
}

.business-logo-view {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.3); /* Aro semi-transparente */
  background: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 15px;
}

.insta-link {
  color: #7a5fff;
  text-decoration: none;
  font-weight: 600;
}

.info-item strong {
  color: #555;
}

/* Categorías */
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
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  background: #f1f3f5;
  color: #444;
  transition: 0.3s ease;
  border: 1px solid transparent;
}

.category-pill:hover {
  border-color: #c042ff;
}

.category-pill.selected {
  background: linear-gradient(135deg, #7a5fff, #c042ff);
  color: white;
  box-shadow: 0 4px 10px rgba(122, 95, 255, 0.3);
}
</style>
