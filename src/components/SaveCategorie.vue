<script setup>
import { ref, watch } from 'vue'
import { useCategoryStore } from '@/stores/categoryStore'
import { useAuthStore } from '@/stores/Auth'

const props = defineProps({
  category: Object,
})
const auth = useAuthStore()
const emit = defineEmits(['saved'])

const categoryStore = useCategoryStore()

const name = ref('')
const editingId = ref(null)

watch(
  () => props.category,
  (val) => {
    if (val) {
      name.value = val.name
      editingId.value = val.id
    } else {
      name.value = ''
      editingId.value = null
    }
  },
)

const save = async () => {
  if (!name.value) return

  if (editingId.value) {
    await categoryStore.updateCategory(editingId.value, name.value)
  } else {
    await categoryStore.createCategory(name.value)
  }

  name.value = ''
  editingId.value = null
  emit('saved')
}
</script>

<template>
  <div v-if="auth.role === 'admin'" class="d-flex justify-content-center">
    <div class="card p-3 shadow-sm" style="max-width: 400px; width: 100%">
      <div class="mb-3">
        <input v-model="name" class="form-control" placeholder="Nombre categoría" />
      </div>

      <div class="text-end">
        <button class="btn btn-primary btn-sm" @click="save">
          {{ editingId ? 'Actualizar' : 'Guardar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border-radius: 12px;
}
</style>
