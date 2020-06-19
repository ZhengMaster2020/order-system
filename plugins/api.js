import Vue from 'vue'
import API from '~/api/a.api'
import supplyAPI from '~/api/supply.api'

Vue.prototype.$API = API
Vue.prototype.$supplyAPI = supplyAPI
Vue.use(API)
Vue.use(supplyAPI)
