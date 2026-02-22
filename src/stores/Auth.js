import { defineStore } from 'pinia'
import { supabase } from '@/services/supabase'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    role: null,
    loading: false,
  }),

  actions: {
    async register(email, password) {
      this.loading = true

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error
      if (!data.user) throw new Error('No se pudo registrar')

      this.user = data.user
      this.role = 'user'

      this.loading = false
      router.push('business')
    },

    async login(email, password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      this.user = data.user

      await this.loadProfileRole()

      router.push('business')
    },

    async loadProfileRole() {
      if (!this.user) return

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', this.user.id)
        .single()

      if (error) {
        console.error('Error cargando rol:', error.message)
        this.role = null
      } else {
        this.role = profile?.role ?? 'user'
      }
    },

    async checkSession() {
      const { data } = await supabase.auth.getSession()

      if (!data.session) {
        this.user = null
        this.role = null
        return
      }

      this.user = data.session.user

      await this.loadProfileRole()
    },

    async logout() {
      await supabase.auth.signOut()
      this.user = null
      this.role = null
      router.push('/login')
    },
  },
})
