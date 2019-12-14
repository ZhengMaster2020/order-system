import Vue from 'vue'
import axios from 'axios'
import Cookies from 'js-cookie'
import iView, { Notice } from 'iview'
// import { router } from 'vue-router'
import { SERVER_BASE_URL } from './config'

// Cookies.set('authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6Ijg4ZWJiOWQyNzg2OTYyZDNkMzRkNjY4ZDU5Zjk5NjI3YWVkZDhmZjcxNTIwMWVhN2MyZGRlMDA3YWM2ZTZlMjhhMTliYzY4NjJiYWVmMGY1In0.eyJhdWQiOiIyIiwianRpIjoiODhlYmI5ZDI3ODY5NjJkM2QzNGQ2NjhkNTlmOTk2MjdhZWRkOGZmNzE1MjAxZWE3YzJkZGUwMDdhYzZlNmUyOGExOWJjNjg2MmJhZWYwZjUiLCJpYXQiOjE1NzUwODExOTUsIm5iZiI6MTU3NTA4MTE5NSwiZXhwIjoxNTc1Njg1OTk1LCJzdWIiOiJkYWE2YjczYy1lMzRjLTQyOTMtOTRlYy1mM2IzYThjY2MwYmIiLCJzY29wZXMiOltdfQ.Pgt3ReoZmIBE01qimmO0VZs39YGyH6gWFlydZUS8gBMh97_6apj94KiHT6_sloBMAxhtg36-yNcij5o1yZlKIpN3Df43p14vcJ69zOLhpu5Ydtu1enZVFbaiOsQd07KewTJtWC4XuC0Jl35j9aKkMGypI__qyfzlhoTUlK6PVBiPMmxrcAOjtktyTH363fawN6W8_LnjPBzkavddB2aky-LjfuqVH44f00zT_VFA4R16QBA4MpiV5qtGZfYW9GPwQIrOVZoT9zx97tX4Ryr7DWEtA1gewqGPAJh-Ue17LxzHQQ63HLeRFfWxK2Gc_IIA5WpPMBo-yYpGcCfgiAma0Q')
// Cookies.set('authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImI5YmEzZWExNTRkODAxNWZiMWJjZjJhMDg4MWUyNDAyYTVlZjkyZmVlZjU2NjQ1NzI2ZmRmNmU3MDI1ZTJkZDg4YTY5NWE1YzRkMjYxZGFiIn0.eyJhdWQiOiIxIiwianRpIjoiYjliYTNlYTE1NGQ4MDE1ZmIxYmNmMmEwODgxZTI0MDJhNWVmOTJmZWVmNTY2NDU3MjZmZGY2ZTcwMjVlMmRkODhhNjk1YTVjNGQyNjFkYWIiLCJpYXQiOjE1NzYxMzA0ODksIm5iZiI6MTU3NjEzMDQ4OSwiZXhwIjoxNTc2NzM1Mjg5LCJzdWIiOiIzNjNkZjczYi1mNWI0LTRkNDYtOTk4Yi04ZDFiN2RiMzM5YmIiLCJzY29wZXMiOltdfQ.VRTLkbBa13mw3hyzxBzRLTRYr9_X9Bph8A83PBGg5gJcZbo3Vk9pBhzsvfr4FLeW6f8DRFyQKpjicHzioppxfu_9zH2BeovXKsJ2ouFF1dBytRiUTWQCC7MtuYsxgBxV_xqZ7dyHD_aTyOt5T4HdQGhnXwR7lwMWOFGtYHp4I5tV1dTvJyMkG4osLANhyoEIeRWtXVknx7DKVud74MN9U6JT8yn5LFrJg_Q4IPQ1CyWSvtysHDXOs-_d0NKXPoDoW1I5eTf4lS-B6X_QbEkrmniM4PLM14OSkQgYzNBQLjEJJtMUwMmebXqgNUiY4lvAnU0MzI2r5LpgnxmsjbVRNA')
Cookies.set('authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6Ijc2MmE2NjI2YWJkYTQ3ZDhhMWNiNzlmNDAxNzdjYWQyYWMzNzdkNjUyYTMyNjYyOGFlZGU2ODU4Mjc5MDgwNTZhZjgxNzYwNTcxZWY4MzkyIn0.eyJhdWQiOiIxIiwianRpIjoiNzYyYTY2MjZhYmRhNDdkOGExY2I3OWY0MDE3N2NhZDJhYzM3N2Q2NTJhMzI2NjI4YWVkZTY4NTgyNzkwODA1NmFmODE3NjA1NzFlZjgzOTIiLCJpYXQiOjE1NzYyODYxNjQsIm5iZiI6MTU3NjI4NjE2NCwiZXhwIjoxNTc2ODkwOTY0LCJzdWIiOiJkYWE2YjczYy1lMzRjLTQyOTMtOTRlYy1mM2IzYThjY2MwYmIiLCJzY29wZXMiOltdfQ.sn2x_Yl8Db9aaNbDTSMhVYH9Ign7hQxlC0zh59cd-3oeFP2LiWB3tYQI4YdZuoHqrAFUQ94Ivgbn8RYkHR4VXlWLHCR-CDmYizSbYAfr48S0AH9nzVEdnidE0np3f1quKrOPHw0-MrfxH4-2UAz3j8hrH5An8Vigw_fYvBB0KEcW4kPbD48ovN5ybvpCBvg1KCko824lKfcD4hyl4EXYYicH1YkhEzEug0ehXrLu4_z4WM_eTVfTqvZu862u25JzTpfjfdsXIvbnFDaX0iw5MVm4fZulfp7HHV5oR50WmesQe3gGBt9LuaF5gh0QHjOj9vZtzZrAktQXVCsl3KD86A')
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
