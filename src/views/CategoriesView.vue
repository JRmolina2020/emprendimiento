<script setup>
import { onMounted, ref } from 'vue'
import { useCategoryStore } from '@/stores/categoryStore'
import ListCategorie from '@/components/ListCategorie.vue'
import SaveCategorie from '@/components/SaveCategorie.vue'
import BaseContainer from '@/components/BaseContainer.vue'
import AppHeader from '@/components/AppHeader.vue'

const categoryStore = useCategoryStore()
const selectedCategory = ref(null)

onMounted(() => {
  categoryStore.fetchCategories()
})

const setEdit = (category) => {
  selectedCategory.value = category
}

const clearEdit = () => {
  selectedCategory.value = null
}
</script>

<template>
  <AppHeader />
  <BaseContainer>
    <div class="page">
      <SaveCategorie :category="selectedCategory" @saved="clearEdit" />
      <ListCategorie @edit="setEdit" />
    </div>
  </BaseContainer>
</template>

<style scoped>
.page {
  padding: 30px;
}
</style>
