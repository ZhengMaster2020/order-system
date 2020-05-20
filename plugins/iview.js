import Vue from 'vue'
import iView from 'view-design'
import 'view-design/dist/styles/iview.css';
import locale from 'iview/dist/locale/zh-CN' // Change locale, check node_modules/iview/dist/locale

Vue.use(iView, {
  locale,
  transfer: true,
  size: 'default'
})
