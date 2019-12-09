import Vue from 'vue'
import axios from 'axios'
import Cookies from 'js-cookie'
import iView, { Notice } from 'iview'
// import { router } from 'vue-router'
import { SERVER_BASE_URL } from './config'

Cookies.set('authorization', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjE1ZDdmMjQyNWU3Mjg4NjZhYmJkODliZGEyY2U2Y2I2Yjc5YThjYzY2ZWY1ZTNmYTVjZWQyZDU3ZDYwNDU3ZTY2OGQ2MTRkYjVjNjNkNjQwIn0.eyJhdWQiOiIyIiwianRpIjoiMTVkN2YyNDI1ZTcyODg2NmFiYmQ4OWJkYTJjZTZjYjZiNzlhOGNjNjZlZjVlM2ZhNWNlZDJkNTdkNjA0NTdlNjY4ZDYxNGRiNWM2M2Q2NDAiLCJpYXQiOjE1NzU2OTcwMjIsIm5iZiI6MTU3NTY5NzAyMiwiZXhwIjoxNTc2MzAxODIyLCJzdWIiOiI3NWUyODNhYS0zNDhjLTRlYzgtYjc0Ny1lNjdmNTkyYjA0MmIiLCJzY29wZXMiOltdfQ.r83uvEwOLyv5CAt64Xo37vyezdPdUApuTA1BK5pF4wcJFdNY_bDp9FCPNsh50lkSlV_gh98eyCRl1-Se5vVrGvhI1B8AlJHmnsQ0vV17ZZSS-kahfzNE7QyqG1xHRBSm52_FRVE7UpAHK_yr1gIGvcUlrdSqpH3TL0WKBG_6eEgRLPjHjnOk_x4FJBTOyMm9D2kQfOn5t1w_CWX5WGnuK6LcEo_EGLc-XKobxMoH9yHBmw78LJ6nhYNFv3zXn64pl3Mg4ofroEdMs-bqlv5A6T5M_1mSh1zjANQ1StnJ-LAN7R0Jg9YSgKqSiO7tfgegihW-TFs7e4c-fir4IIaiww')

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
