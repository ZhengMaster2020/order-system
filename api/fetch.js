import Vue from 'vue'
import axios from 'axios'
import Cookies from 'js-cookie'
import iView, { Notice } from 'iview'
// import { router } from 'vue-router'
import { SERVER_BASE_URL } from './config'

Cookies.set('authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImE2M2IxNWI1NWZjMDUyOTVjNzNkNzkwYzBhZmUwOGJlM2YyMmJhN2U5ZjgzOWNkNTM1Y2MwZmRmZTdkODE1NjZjNjliY2RhOGE4ZmM1YWVhIn0.eyJhdWQiOiIyIiwianRpIjoiYTYzYjE1YjU1ZmMwNTI5NWM3M2Q3OTBjMGFmZTA4YmUzZjIyYmE3ZTlmODM5Y2Q1MzVjYzBmZGZlN2Q4MTU2NmM2OWJjZGE4YThmYzVhZWEiLCJpYXQiOjE1NzU4NjEyMjMsIm5iZiI6MTU3NTg2MTIyMywiZXhwIjoxNTc2NDY2MDIzLCJzdWIiOiI3NWUyODNhYS0zNDhjLTRlYzgtYjc0Ny1lNjdmNTkyYjA0MmIiLCJzY29wZXMiOltdfQ.M-H_nKqcF4PRR0s2DOxD0Yu4D4wPebAoQYoOjEpt8shd4qDRbJtjdd0KTeiP-jG8ISKFpkWBkw4vURay85vRhI9xCBP4FV2gCtdZHZ3MbX_JpcPXpPumhurftwg548ZPGUiSp21RSEL6F3a1qM4NRtfDQCIm1MnK0o9lQTHMeEYS1rJn8iXMw2l6Sqrolqn5PG68rQX31ovsug80XE2_DAvkfnT6EGQyNvANtka4tLcQcFyqCVrhekQqP5YrEzNFXsCsD8LvYMJtCzAQbV2JIOnw3lFSgexOYiCrooKK06Lh2OvKyDP3UnRx1ckl8Co-Hy89pd4HvHLY1t7AdncBaA')

Vue.use(iView)

export default function fetch(options) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      baseURL: SERVER_BASE_URL,
      timeout: 20000,
      headers: {}
    })

    // http request 拦截器
    instance.interceptors.request.use(
      (config) => {
        config.headers.Authorization = Cookies.get('authorization')
        return config
      },
      (err) => {
        iView.LoadingBar.error()
        return Promise.reject(err)
      }
    )

    // http response 拦截器
    instance.interceptors.response.use(
      (response) => {
        return response
      },
      (error) => {
        Notice.error({
          title: '出错了！',
          desc: '错误原因 ' + JSON.stringify(error),
          duration: 0
        })
        iView.LoadingBar.error()
        return Promise.reject(error) // 返回接口返回的错误信息
      }
    )

    // 请求处理
    instance(options)
      .then((res) => {
        // 请求成功时,根据业务判断状态
        /*  if (code === port_code.success) {
                 resolve({code, msg, data})
                 return false
                 } else if (code === port_code.unlogin) {
                 setUserInfo(null)
                 router.replace({name: "login"})
                 } */
        const data = res.data
        if (data.code >= 1) {
          let content = JSON.stringify(data.data)
          let title = data.message
          data.data = data.data || []
          if (data.data.length === 0) {
            content = data.message
            title = ''
          }
          Notice.warning({
            title: title,
            desc: 'code: ' + data.code + '</br>' + content
          })
        }

        resolve(data)
        return false
      })
      .catch((error) => {
        const response = error.response
        const data = response.data

        // 401无效token
        if (data && data.status && data.status === 401) {
          // 退出登录
          Notice.error({
            title: '登录信息失效，请重新登录！',
            desc: '错误代码：401'
          })
          setTimeout(() => {
            // router.push({ path: '/home' })
          }, 2000)
          reject(error)
          return false
        }

        // 403无权限操作
        if (data && data.status && data.status === 403) {
          Notice.error({
            title: '您没有权限操作',
            desc: '错误代码：' + data.status,
            duration: 0
          })
          reject(error)
          return false
        }

        // 请求失败时,根据业务判断状态
        Notice.error({
          title: '出错了！',
          desc: '错误原因 ' + JSON.stringify(response),
          duration: 0
        })
        reject(error)
      })
  })
}
