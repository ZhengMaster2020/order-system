import Vue from 'vue'
import API from '~/api/a.api'

Vue.prototype.$API = API
Vue.use(API)
