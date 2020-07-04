import Vue from 'vue'
import axios from 'axios'

import iView, { Notice } from 'view-design'
import  ENV  from './env'
// import Cookies from "js-cookie";

Vue.use(iView)

const BASE_URL = ENV === 'production' ? '//apisupply.fandow.com' : '//apisupplytest.fandow.com'

export default function supplyFetch(options) {
  return new Promise((resolve, reject) => {
    const instance =  axios.create({
      baseURL: BASE_URL,
      timeout: 20000,
      headers: {'Authorization': 'Bearer nTYEm7oNMGChXer3AhIy4cBkTYcQfdUOdJJVuQ3X'}
    });

    // http request 拦截器
    // instance.interceptors.request.use(
    //   (config) => {
    //     config.headers.Authorization = Cookies.get('authorization')
    //     return config
    //   },
    //   (err) => {
    //     // iView.LoadingBar.error()
    //     return Promise.reject(err)
    //   }
    // )
    // 请求处理
    instance(options)
      .then((res) => {
        let data = res.data
        resolve(data)
      })
      .catch((error) => {
        let data = error.response.data
        Notice.error({
          title: '错误代码：' + data.line,
          desc: data.subMsg || data.msg || data.message,
          duration: 3
        })

        reject(error)
      })
  })
}