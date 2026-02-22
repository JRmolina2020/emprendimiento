<script setup>
import { onMounted } from 'vue'
import { useBusinessStore } from '@/stores/businnessStore'
import SaveBusiness from '@/components/SaveBusiness.vue'
import BaseContainer from '@/components/BaseContainer.vue'
import AppHeader from '@/components/AppHeader.vue'

const businessStore = useBusinessStore()

onMounted(() => {
  businessStore.fetchMyBusiness()
})
</script>

<template>
  <AppHeader />
  <BaseContainer>
    <div class="container mt-4">
      <SaveBusiness :business="businessStore.business" />
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
</style>
