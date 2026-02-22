import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useAuthStore } from '@/stores/Auth'
//table
import Notifications from '@kyvg/vue3-notification'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import 'jquery'
import 'popper.js'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Notifications)
const auth = useAuthStore()
auth.checkSession()
app.mount('#app')
