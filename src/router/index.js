import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/Auth'

import HomeView from '@/views/HomeView.vue'
import CategorieView from '@/views/CategoriesView.vue'
import MyBusinessView from '@/views/MyBusinessView.vue'
import DataBusiness from '@/views/DataBusiness.vue'
import PanelAdminView from '@/views/AdminPanelView.vue'
import PanelPublicView from '@/views/PublicBusinessesView.vue'
import LoginView from '@/views/LoginView.vue'

const routes = [
  { path: '/', component: PanelPublicView },
  { path: '/home', component: HomeView },

  {
    path: '/categorie',
    component: CategorieView,
    meta: { requiresAdmin: true },
  },
  {
    path: '/business',
    component: MyBusinessView,
  },
  {
    path: '/databusiness',
    component: DataBusiness,
  },
  {
    path: '/admin',
    component: PanelAdminView,
    meta: { requiresAdmin: true },
  },
  { path: '/login', component: LoginView },
  {
    path: '/register',
    component: () => import('@/views/RegisterView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if (!auth.user) {
    await auth.checkSession()
  }

  const publicPages = ['/login', '/register', '/']
  const authRequired = !publicPages.includes(to.path)

  if (authRequired && !auth.user) {
    return '/login'
  }

  if (to.meta.requiresAdmin && auth.role !== 'admin') {
    return '/'
  }
})

export default router
