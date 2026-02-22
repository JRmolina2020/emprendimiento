<script setup>
import { onMounted } from 'vue'
import { useBusinessStore } from '@/stores/businnessStore'

const businessStore = useBusinessStore()

onMounted(() => {
  businessStore.fetchAllBusinesses()
})

const remove = async (id) => {
  await businessStore.deleteBusinessByAdmin(id)
}

const toggle = async (business) => {
  await businessStore.toggleStatusByAdmin(business)
}
</script>

<template>
  <div class="container mt-4">
    <h3 class="mb-4 text-center">Panel Administrador</h3>

    <div class="row justify-content-center">
      <div class="col-md-4 mb-4" v-for="biz in businessStore.businesses" :key="biz.id">
        <div class="admin-card shadow">
          <!-- Header con gradiente -->
          <div class="card-header-custom text-center">
            <h4 class="text-white mb-1">{{ biz.name }}</h4>
            <span class="badge-status" :class="biz.status ? 'active' : 'blocked'">
              {{ biz.status ? 'Activo' : 'Bloqueado' }}
            </span>
          </div>

          <!-- Body -->
          <div class="card-body-custom">
            <p><strong>Dueño:</strong> {{ biz.name }}</p>
            <p><strong>Ciudad:</strong> {{ biz.city }}</p>
            <p><strong>Dirección:</strong> {{ biz.direction }}</p>
            <p><strong>Teléfono:</strong> {{ biz.phone }}</p>
            <p><strong>Instagram</strong> {{ biz.instagram }}</p>

            <hr />

            <div class="d-flex justify-content-between mt-3">
              <button class="btn btn-warning btn-sm w-50 me-2" @click="toggle(biz)">
                {{ biz.status ? 'Bloquear' : 'Desbloquear' }}
              </button>

              <button class="btn btn-danger btn-sm w-50" @click="remove(biz.id)">Eliminar</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="businessStore.businesses.length === 0" class="text-center">
        <p class="text-muted">No hay emprendimientos registrados</p>
      </div>
    </div>
  </div>
</template>
<style scoped>
.admin-card {
  border-radius: 14px;
  overflow: hidden;
  background: #ffffff;
  transition: 0.3s ease;
}

.admin-card:hover {
  transform: translateY(-4px);
}

.card-header-custom {
  background: linear-gradient(135deg, #e056fd, #686de0);
  padding: 25px 15px;
}

.card-body-custom {
  padding: 20px;
  font-size: 14px;
}

.badge-status {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.badge-status.active {
  background-color: #28a745;
  color: white;
}

.badge-status.blocked {
  background-color: #dc3545;
  color: white;
}
</style>
