import ENV from '../api/env'
import Vue from 'vue'
import iView, { Notice } from 'view-design'
Vue.use(iView)

const isClient = process.client

const powerEnum = {
  'FD-0001': '超级管理员',
  'FD-7724': '李时达',
  'FD-13059': '谢绮玲',
  'FD-11271': '李锐钊',
  'FD-2202': '吴马红',
  'FD-17494': '刘金梁',
}

let storeEnum = {
  'FD-16349': '周一娜',
  'FD-14775': '陈家茵',
  'FD-16751': '罗鑫妍',
  'FD-12492': '黄小亮'
}

if (ENV === 'production') {
  delete powerEnum['FD-0001']
}

export default ({ app, store }) => {
  app.router.beforeEach((to, from, next) => {
    // 设置条件
    if (isClient) {
      let str = window.localStorage.getItem('userInfo')
      if (str) {
        let userInfo = JSON.parse(str)
        if (powerEnum[userInfo.username]) {
          // 包含在里面 通过全部路由
          next();
        } else {
          let menuList
          if (storeEnum[userInfo.username]) {
            // 包含在storeEnum组里 只通过渠道和店铺设置/登录/主页
            menuList = [{path: 'inquire-anomaly-tracking/channel-store-settings'}, {path: 'inquire-anomaly-tracking/store-setting-operations'}, {path: 'login'}, {path: ''}]
          } else {
            // 其他 只通过防伪码查询/登录/主页
            menuList = [{path: 'security-code/search-code'}, {path: 'login'}, {path: ''}]
          }
          if (menuList.find(item => ('/' + item.path) === to.path )) {
            next();
          } else {
            Notice.error({
              title: '用户没有权限',
              desc: '无法打开该页面',
              duration: 0
            })
            next('/')
          }
        }
      } else {
        // 未登陆 auth已拦截  无需判断
        next();
      }
    } else {
      next()
    }
  })
 }