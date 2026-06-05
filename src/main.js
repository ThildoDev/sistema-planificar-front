import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import '@/assets/styles/global.css'
import '@/assets/styles/themes.css'
import '@/assets/styles/components/buttons.css'
import '@/assets/styles/components/inputs.css'
import '@/assets/styles/components/cards.css'


const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
