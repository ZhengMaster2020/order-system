import Vue from 'vue'
import axios from 'axios'
import Cookies from 'js-cookie'
import iView, { Notice } from 'iview'
// import { router } from 'vue-router'
import { SERVER_BASE_URL } from './config'

//Cookies.set('authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6Ijc1YjFkNzgxNzVkNjZmMDlkMjMxMGI0ZWViZDdhM2Y3NjY0ZTk3YzA2Nzc2N2M4MTkxNmIxMzI0OWQ3MmMyMWRkZGFmZWFjNWRiYmMzYjkxIn0.eyJhdWQiOiIxIiwianRpIjoiNzViMWQ3ODE3NWQ2NmYwOWQyMzEwYjRlZWJkN2EzZjc2NjRlOTdjMDY3NzY3YzgxOTE2YjEzMjQ5ZDcyYzIxZGRkYWZlYWM1ZGJiYzNiOTEiLCJpYXQiOjE1NzcwNjE5NTAsIm5iZiI6MTU3NzA2MTk1MCwiZXhwIjoxNTc3NjY2NzUwLCJzdWIiOiJkYWE2YjczYy1lMzRjLTQyOTMtOTRlYy1mM2IzYThjY2MwYmIiLCJzY29wZXMiOltdfQ.tDW0JylzujiaNXx4OtLgQy081uuJ1oI9ptI9euORlohnrVJq3onWmIYpzEC-0--u_Rjqdo-Mwdefk2AkDRolmqB7AiQYBlsiDFSHB0qf0crT7PFkcIiiqchEfnFfs8Mg9kmP4W49gYA_lniuExjnqi7xKAsy8P8-jfpmYoDiKBKFFeeR9FOmoyFHMr4q8s7Fvg2e6BnZ2ed60HlLB6MWUKne4KbWN7VxSM4Sf5FGYeLKz0EdXOvPa63urGwvYqNt0dSWiBuCG4nMp5-Qvaeo_7M9pm5DBjJkGWoIPxyIqb65TSY1hgl3yml8AjM94S_XyheV6nw1tLHoVDLyxL5oyg')

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
