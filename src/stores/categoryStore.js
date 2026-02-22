import { defineStore } from 'pinia'
import { supabase } from '@/services/supabase'

export const useCategoryStore = defineStore('categories', {
  state: () => ({
    categories: [],
    loading: false,
  }),

  actions: {
    async fetchCategories() {
      this.loading = true

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error) {
        this.categories = data
      }

      this.loading = false
    },
    async fetchAllCategories() {
      const { data } = await supabase.from('categories').select('*').order('name')

      this.categories = data ?? []
    },

    async createCategory(name) {
      const { error } = await supabase.from('categories').insert([{ name }])

      if (!error) {
        await this.fetchCategories()
      }
    },

    async updateCategory(id, name) {
      const { error } = await supabase.from('categories').update({ name }).eq('id', id)

      if (!error) {
        await this.fetchCategories()
      }
    },

    async toggleCategoryStatus(id, currentStatus) {
      const { error } = await supabase
        .from('categories')
        .update({ status: !currentStatus })
        .eq('id', id)

      if (!error) {
        await this.fetchCategories()
      }
    },

    async deleteCategory(id) {
      const { error } = await supabase.from('categories').delete().eq('id', id)

      if (!error) {
        await this.fetchCategories()
      }
    },
  },
})
