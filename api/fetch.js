import Vue from 'vue'
import axios from 'axios'
import Cookies from 'js-cookie'
import iView, { Notice } from 'view-design'
// import { router } from 'vue-router'
import { SERVER_BASE_URL } from './config'

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
    // 请求处理
    instance(options)
      .then((res) => {
        let data = res.data
        if (res.status === 202 || data.code > 0) {
          if (data.__proto__ === Blob.prototype) {
            var reader = new FileReader();
            reader.readAsText(data, 'utf-8');
            reader.onload = function () {
              data = JSON.parse(reader.result)
              if (data.data && data.data.length) {
                data.data.forEach(item => {
                  Notice.error({
                    title: '错误代码：' + data.code,
                    desc: item,
                    duration: 3
                  })
                })
              } else {
                Notice.error({
                  title: '错误代码：' + data.code,
                  desc: data.subMsg || data.msg || data.message,
                  duration: 3
                })
              }
              reject(data);
            }
          } else {
            if (data.data && data.data.length) {
              data.data.forEach(item => {
                Notice.error({
                  title: '错误代码：' + data.code,
                  desc: item,
                  duration: 3
                })
              })
            } else {
              Notice.error({
                title: '错误代码：' + data.code,
                desc: data.subMsg || data.msg || data.message,
                duration: 3
              })
            }
            reject(data);
          }
          return;
        } else {
          resolve(data)
        }
        return false
      })
      .catch((error) => {
        const response = error.response
        let data = response.data

        // responseType = blob 时错误信息转回json
        if (data.__proto__ === Blob.prototype) {
          var reader = new FileReader();
          reader.readAsText(data, 'utf-8');
          reader.onload = function () {
            data = JSON.parse(reader.result);
            Notice.error({
              title: '错误代码：' + data.code,
              desc: data.subMsg || data.msg || data.message,
              duration: 1.5
            })
            reject(error)
          }
          return;
        }

        // 401无效token
        if (data && response.status === 401) {
          // 退出登录
          Notice.error({
            title: '错误代码：401',
            desc: '登录信息失效，请重新登录！'
          })
          setTimeout(() => {
            location.href = '/login'
          }, 2000)
          reject(error)
          return false
        }

        // 403无权限操作
        if (data && response.status === 403) {
          Notice.error({
            title: '错误代码：' + data.code,
            desc: '您没有权限操作',
            duration: 1.5
          })
          reject(error)
          return false
        }

        Notice.error({
          title: '错误代码：' + data.code,
          desc: data.subMsg || data.msg || data.message,
          duration: 1.5
        })
        reject(error)
      })
  })
}
