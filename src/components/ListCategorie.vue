<script setup>
import { useCategoryStore } from '@/stores/categoryStore'
import { useAuthStore } from '@/stores/Auth'

const emit = defineEmits(['edit'])

const categoryStore = useCategoryStore()
const auth = useAuthStore()

const edit = (category) => {
  emit('edit', category)
}

const remove = (id) => {
  categoryStore.deleteCategory(id)
}
</script>

<template>
  <div class="d-flex justify-content-center mt-4">
    <div class="card shadow-sm" style="width: 450px">
      <div class="card-body">
        <h5 class="card-title text-center mb-3">Listado de Categorías</h5>

        <table class="table table-sm">
          <thead class="table-light">
            <tr>
              <th>Nombre</th>

              <th v-if="auth.role === 'admin'" class="text-center">Estado</th>

              <th v-if="auth.role === 'admin'" class="text-center">Editar</th>

              <th v-if="auth.role === 'admin'" class="text-center">Eliminar</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="cat in categoryStore.categories" :key="cat.id">
              <td>{{ cat.name }}</td>

              <td v-if="auth.role === 'admin'" class="text-center">
                <button
                  class="btn btn-sm px-2 py-1"
                  :class="cat.status ? 'btn-secondary' : 'btn-danger'"
                  @click="categoryStore.toggleCategoryStatus(cat.id, cat.status)"
                >
                  {{ cat.status ? 'A' : 'B' }}
                </button>
              </td>

              <td v-if="auth.role === 'admin'" class="text-center">
                <button class="btn btn-primary btn-sm px-2 py-1" @click="edit(cat)">E</button>
              </td>

              <td v-if="auth.role === 'admin'" class="text-center">
                <button class="btn btn-danger btn-sm px-2 py-1" @click="remove(cat.id)">X</button>
              </td>
            </tr>

            <tr v-if="categoryStore.categories.length === 0">
              <td :colspan="auth.role === 'admin' ? 4 : 1" class="text-center text-muted">
                No hay categorías registradas
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
