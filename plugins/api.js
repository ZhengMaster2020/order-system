import Vue from 'vue'
import API from '~/api/api'

Vue.prototype.$API = API
Vue.use(API)
