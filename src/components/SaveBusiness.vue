<script setup>
import { ref, watch } from 'vue'
import { useBusinessStore } from '@/stores/businnessStore'

const props = defineProps({
  business: Object,
})

const businessStore = useBusinessStore()

const form = ref({
  name: '',
  phone: '',
  direction: '',
  city: '',
  instagram: '',
  description: '',
})

watch(
  () => props.business,
  (val) => {
    if (val) {
      form.value = { ...val }
    }
  },
)

const save = async () => {
  await businessStore.saveBusiness(form.value)
}
</script>

<template>
  <div class="d-flex justify-content-center mt-4">
    <div class="form-card shadow">
      <h4 class="text-center mb-4">
        {{ business ? 'Editar Emprendimiento' : 'Registrar Emprendimiento' }}
      </h4>

      <div class="row g-3">
        <div class="col-12">
          <label class="form-label">Nombre</label>
          <input v-model="form.name" class="form-control custom-input" />
        </div>

        <div class="col-md-6">
          <label class="form-label">Teléfono</label>
          <input v-model="form.phone" class="form-control custom-input" />
        </div>

        <div class="col-md-6">
          <label class="form-label">Ciudad</label>
          <input v-model="form.city" class="form-control custom-input" />
        </div>

        <div class="col-12">
          <label class="form-label">Dirección</label>
          <input v-model="form.direction" class="form-control custom-input" />
        </div>

        <div class="input-group mb-2">
          <span class="input-group-text"> https://www.instagram.com/ </span>
          <input type="text" class="form-control" v-model="form.instagram" placeholder="usuario" />
        </div>
        <div class="col-12">
          <label class="form-label">Descripción</label>
          <textarea
            v-model="form.description"
            class="form-control custom-input"
            rows="3"
          ></textarea>
        </div>
      </div>

      <div class="text-center mt-4">
        <button class="btn btn-primary px-4 py-2" @click="save">Guardar</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-card {
  width: 100%;
  max-width: 600px;
  background: #ffffff;
  padding: 30px;
  border-radius: 12px;
}

.custom-input {
  height: 45px;
  border-radius: 8px;
  border: 1px solid #ddd;
  transition: all 0.2s ease;
}

.custom-input:focus {
  border-color: #6c63ff;
  box-shadow: 0 0 0 2px rgba(108, 99, 255, 0.15);
}

textarea.custom-input {
  height: auto;
}
</style>
