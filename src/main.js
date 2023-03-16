import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import CoreuiVue from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import { iconsSet as icons } from '@/assets/icon'

import print from 'vue3-print-nb'
import Notifications from '@kyvg/vue3-notification'

import axios from 'axios'
import api from '@/configs/_api'

axios.defaults.baseURL = api
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.token = localStorage.getItem('token')

const app = createApp(App)
app.use(print)
app.use(store)
app.use(router)
app.use(CoreuiVue)
app.use(Notifications)
app.provide('icons', icons)
app.component('CIcon', CIcon)

app.mount('#app')
