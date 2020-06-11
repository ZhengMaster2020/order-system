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
          // 不包含在里面  只通过防伪码查询/登录/主页
          let menuList = [{path: 'security-code/search-code'}, {path: 'login'}, {path: ''}]
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