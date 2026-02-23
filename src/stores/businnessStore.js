import { defineStore } from 'pinia'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/Auth'
import { notify } from '@kyvg/vue3-notification'

export const useBusinessStore = defineStore('business', {
  state: () => ({
    business: null,
    loading: false,
    businesses: [],
  }),

  actions: {
    async fetchMyBusiness() {
      const auth = useAuthStore()
      this.loading = true

      const { data, error } = await supabase
        .from('businesses')
        .select(
          `
      *,
      business_categories (
        category_id
      )
    `,
        )
        .eq('user_id', auth.user.id)
        .single()

      if (!error) {
        this.business = data
      } else {
        this.business = null
        console.error(error)
      }

      this.loading = false
    },

    //public
    async fetchPublicBusinesses(search = '', categoryId = null) {
      this.loading = true

      let selectQuery = `
    id,
    name,
    city,
    phone,
    description,
    instagram,
    business_categories (
      category_id
    )
  `

      // Si hay filtro por categoría, forzamos INNER JOIN
      if (categoryId) {
        selectQuery = `
      id,
      name,
      city,
      phone,
      description,
      instagram,
      business_categories!inner (
        category_id
      )
    `
      }

      let query = supabase.from('businesses').select(selectQuery).eq('status', true)

      if (search) {
        query = query.ilike('name', `%${search}%`)
      }

      if (categoryId) {
        query = query.eq('business_categories.category_id', categoryId)
      }

      const { data, error } = await query

      if (!error) {
        this.businesses = data
      } else {
        console.error(error)
      }

      this.loading = false
    },
    async saveBusiness(form) {
      const auth = useAuthStore()

      try {
        // 🔹 Formatear Instagram correctamente
        let instagramFormatted = null

        if (form.instagram) {
          instagramFormatted = form.instagram.includes('instagram.com')
            ? form.instagram
            : `https://www.instagram.com/${form.instagram.replace('@', '')}`
        }

        const payload = {
          ...form,
          instagram: instagramFormatted,
        }

        let response

        if (this.business) {
          response = await supabase
            .from('businesses')
            .update(payload)
            .eq('id', this.business.id)
            .select()
        } else {
          response = await supabase
            .from('businesses')
            .insert([
              {
                ...payload,
                user_id: auth.user.id,
              },
            ])
            .select()
        }

        const { data, error } = response

        if (error) throw error

        if (!data || data.length === 0) {
          throw new Error('No se pudo guardar el emprendimiento')
        }

        notify({
          title: 'Éxito',
          text: this.business
            ? 'Emprendimiento actualizado correctamente'
            : 'Emprendimiento creado correctamente',
          type: 'success',
          position: 'bottom right',
          duration: 2500,
        })

        await this.fetchMyBusiness()

        return true
      } catch (error) {
        notify({
          title: 'Error',
          text: error.message || 'Ocurrió un error inesperado',
          type: 'error',
          position: 'bottom right',
          duration: 3500,
        })

        return false
      }
    },
    async deleteBusiness() {
      if (!this.business) return

      await supabase.from('businesses').delete().eq('id', this.business.id)

      this.business = null
    },

    async toggleStatus() {
      if (!this.business) return

      await supabase
        .from('businesses')
        .update({ status: !this.business.status })
        .eq('id', this.business.id)

      await this.fetchMyBusiness()
    },
    async fetchAllBusinesses() {
      this.loading = true

      const { data, error } = await supabase
        .from('businesses')
        .select(
          `
      *,
      profiles:user_id ( email )
    `,
        )
        .order('created_at', { ascending: false })

      console.log('DATA:', data)
      console.log('ERROR:', error)

      if (!error) {
        this.businesses = data
      }

      this.loading = false
    },
    async deleteBusinessByAdmin(id) {
      await supabase.from('businesses').delete().eq('id', id)

      await this.fetchAllBusinesses()
    },

    async toggleStatusByAdmin(business) {
      await supabase.from('businesses').update({ status: !business.status }).eq('id', business.id)

      await this.fetchAllBusinesses()
    },
    //categorie togle
    async toggleCategory(categoryId) {
      if (!this.business) return

      const businessId = this.business.id

      // Verificar si ya existe
      const { data: existing } = await supabase
        .from('business_categories')
        .select('id')
        .eq('business_id', businessId)
        .eq('category_id', categoryId)
        .maybeSingle()

      if (existing) {
        await supabase
          .from('business_categories')
          .delete()
          .eq('business_id', businessId)
          .eq('category_id', categoryId)
      } else {
        await supabase.from('business_categories').insert([
          {
            business_id: businessId,
            category_id: categoryId,
          },
        ])
      }

      // Recargar negocio con categorías
      await this.fetchMyBusiness()
    },
  },
})
