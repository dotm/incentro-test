import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import App from './App.vue'
import 'uno.css'

createApp(App).use(VueQueryPlugin).mount('#app')