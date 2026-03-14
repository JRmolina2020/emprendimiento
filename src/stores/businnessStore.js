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
    /**
     * Carga el emprendimiento del usuario autenticado
     */
    async fetchMyBusiness() {
      const auth = useAuthStore()
      if (!auth.user) return

      this.loading = true
      const { data, error } = await supabase
        .from('businesses')
        .select(`
          *,
          business_categories!business_categories_business_id_fkey (
            category_id,
            categories!business_categories_category_id_fkey (
              id,
              name
            )
          )
        `)
        .eq('user_id', auth.user.id)
        .maybeSingle()

      if (error) {
        console.error('Error fetching business:', error)
        this.business = null
      } else {
        this.business = data
      }
      this.loading = false
    },

    /**
     * Carga todos los emprendimientos públicos (para la vista de usuario)
     */
    async fetchPublicBusinesses(search = '', categoryId = null) {
      this.loading = true

      let selectQuery = `
        id, name, city, phone, description, instagram, image_url,
        business_categories!business_categories_business_id_fkey (
          category_id,
          categories!business_categories_category_id_fkey ( id, name )
        )
      `

      if (categoryId) {
        selectQuery = `
          id, name, city, phone, description, instagram, image_url,
          business_categories!business_categories_business_id_fkey!inner (
            category_id,
            categories!business_categories_category_id_fkey ( id, name )
          )
        `
      }

      let query = supabase.from('businesses').select(selectQuery).eq('status', true)

      if (search) query = query.ilike('name', `%${search}%`)
      if (categoryId) query = query.eq('business_categories.category_id', categoryId)

      const { data, error } = await query

      if (error) console.error(error)
      else this.businesses = data

      this.loading = false
    },

    /**
     * Sube una imagen al Storage de Supabase
     */
    async uploadImage(file) {
      try {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `logos/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('business-images')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('business-images')
          .getPublicUrl(filePath)

        return publicUrl
      } catch (error) {
        console.error('Error subiendo imagen:', error.message)
        return null
      }
    },

    /**
     * Guarda o actualiza el emprendimiento
     */
    async saveBusiness(form, imageFile = null) {
      const auth = useAuthStore()
      this.loading = true

      try {
        let imageUrl = form.image_url

        // 1. Si hay archivo nuevo, subirlo
        if (imageFile) {
          const uploadedUrl = await this.uploadImage(imageFile)
          if (uploadedUrl) imageUrl = uploadedUrl
        }

        // 2. Limpieza de datos relacionales para evitar errores en la tabla
        const { business_categories, profiles, categories, created_at, ...cleanForm } = form
        
        const payload = {
          ...cleanForm,
          image_url: imageUrl,
          instagram: form.instagram?.includes('instagram.com') 
            ? form.instagram 
            : `https://www.instagram.com/${form.instagram?.replace('@', '')}`
        }

        // 3. Insertar o Actualizar
        if (this.business) {
          const { error } = await supabase.from('businesses').update(payload).eq('id', this.business.id)
          if (error) throw error
        } else {
          const { error } = await supabase.from('businesses').insert([{ ...payload, user_id: auth.user.id }])
          if (error) throw error
        }

        notify({ title: 'Éxito', text: 'Guardado correctamente', type: 'success', position: 'bottom right' })
        await this.fetchMyBusiness()
        return true

      } catch (error) {
        notify({ title: 'Error', text: error.message, type: 'error', position: 'bottom right' })
        return false
      } finally {
        this.loading = false
      }
    },

    /**
     * Eliminar emprendimiento propio
     */
    async deleteBusiness() {
      if (!this.business || !confirm('¿Estás seguro de eliminar tu emprendimiento?')) return

      const { error } = await supabase.from('businesses').delete().eq('id', this.business.id)
      
      if (error) {
        notify({ title: 'Error', text: 'No se pudo eliminar', type: 'error' })
      } else {
        this.business = null
        notify({ title: 'Eliminado', text: 'Emprendimiento borrado', type: 'warn' })
      }
    },

    /**
     * Cambiar estado (Activo/Bloqueado) propio
     */
    async toggleStatus() {
      if (!this.business) return
      await supabase.from('businesses').update({ status: !this.business.status }).eq('id', this.business.id)
      await this.fetchMyBusiness()
    },

    /**
     * Gestión de Categorías (Pills)
     */
    async toggleCategory(categoryId) {
      if (!this.business) return
      const businessId = this.business.id

      const { data } = await supabase
        .from('business_categories')
        .select('id')
        .eq('business_id', businessId)
        .eq('category_id', categoryId)
        .maybeSingle()

      if (data) {
        await supabase.from('business_categories').delete().eq('id', data.id)
      } else {
        await supabase.from('business_categories').insert([{ business_id: businessId, category_id: categoryId }])
      }

      await this.fetchMyBusiness()
    },

    /**
     * FUNCIONES PARA EL ADMIN
     */
    async fetchAllBusinesses() {
      this.loading = true
      const { data, error } = await supabase
        .from('businesses')
        .select('*, profiles:user_id ( email )')
        .order('created_at', { ascending: false })

      if (error) console.error(error)
      else this.businesses = data
      this.loading = false
    },

    async deleteBusinessByAdmin(id) {
      await supabase.from('businesses').delete().eq('id', id)
      await this.fetchAllBusinesses()
    },

    async toggleStatusByAdmin(business) {
      await supabase.from('businesses').update({ status: !business.status }).eq('id', business.id)
      await this.fetchAllBusinesses()
    }
  }
})