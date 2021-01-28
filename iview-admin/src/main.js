import Vue from 'vue'
import App from './App.vue'

import './plugins/index'
import '@/styles/index.scss'
import 'vue2-animate/dist/vue2-animate.min.css'

import router from './router'
import store from './store'

import api from './api'
import '@/permission'
import '@/icons' // icon

Vue.prototype.$api = api

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
