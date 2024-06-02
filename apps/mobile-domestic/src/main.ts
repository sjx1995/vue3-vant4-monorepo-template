import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

if (import.meta.env.PROD)
  import('@hitools/mobile-components/dist/es/style.css')

createApp(App).mount('#app')
