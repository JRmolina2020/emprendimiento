<script setup>
import { ref, watch } from 'vue'
import { useBusinessStore } from '@/stores/businnessStore'

const props = defineProps({
  business: Object,
})

const businessStore = useBusinessStore()
const imageFile = ref(null)
const imagePreview = ref(null)

const form = ref({
  name: '',
  phone: '',
  direction: '',
  city: '',
  instagram: '',
  description: '',
  image_url: '',
})

watch(
  () => props.business,
  (val) => {
    if (val) {
      form.value = { ...val }
      imagePreview.value = val.image_url
    }
  },
  { immediate: true },
)

// FUNCION PARA CAPITALIZAR CADA PALABRA
const capitalizeWords = (text) => {
  if (!text) return ''
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// FUNCION GENERAL PARA INPUTS
const formatInput = (field, event) => {
  form.value[field] = capitalizeWords(event.target.value)
}

// Imagen
const onFileSelected = (event) => {
  const file = event.target.files[0]
  if (file) {
    imageFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

const save = async () => {
  await businessStore.saveBusiness(form.value, imageFile.value)
}
</script>

<template>
  <div class="d-flex justify-content-center mt-4">
    <div class="form-card shadow">
      <h4 class="text-center mb-4">
        {{ business ? 'Editar Emprendimiento' : 'Registrar Emprendimiento' }}
      </h4>

      <div class="row g-3">
        <div class="col-12 text-center mb-3">
          <div class="image-container mx-auto mb-2">
            <img :src="imagePreview || 'https://via.placeholder.com/150'" class="preview-img" />
          </div>

          <label class="btn btn-outline-primary btn-sm">
            Seleccionar Logo
            <input type="file" hidden @change="onFileSelected" accept="image/*" />
          </label>
        </div>

        <div class="col-12">
          <label class="form-label">Nombre</label>
          <input
            :value="form.name"
            @input="formatInput('name', $event)"
            class="form-control custom-input"
          />
        </div>

        <div class="col-md-6">
          <label class="form-label">Teléfono</label>
          <input v-model="form.phone" class="form-control custom-input" />
        </div>

        <div class="col-md-6">
          <label class="form-label">Ciudad</label>
          <input
            :value="form.city"
            @input="formatInput('city', $event)"
            class="form-control custom-input"
          />
        </div>

        <div class="col-12">
          <label class="form-label">Dirección</label>
          <input
            :value="form.direction"
            @input="formatInput('direction', $event)"
            class="form-control custom-input"
          />
        </div>

        <div class="col-12">
          <label class="form-label">Instagram</label>
          <div class="input-group">
            <span class="input-group-text">@</span>
            <input
              type="text"
              class="form-control"
              v-model="form.instagram"
              placeholder="Solo coloca tu usuario ejemplo: jrcasablanca"
            />
          </div>
        </div>

        <div class="col-12">
          <label class="form-label">Descripción</label>
          <textarea
            :value="form.description"
            @input="formatInput('description', $event)"
            class="form-control custom-input"
            rows="3"
          ></textarea>
        </div>
      </div>

      <div class="text-center mt-4">
        <button class="btn btn-primary px-5 py-2" :disabled="businessStore.loading" @click="save">
          {{ businessStore.loading ? 'Guardando...' : 'Guardar Datos' }}
        </button>
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

.image-container {
  width: 120px;
  height: 120px;
  border-radius: 15px;
  overflow: hidden;
  border: 2px dashed #ddd;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.custom-input {
  height: 45px;
  border-radius: 8px;
  border: 1px solid #ddd;
}
</style>
