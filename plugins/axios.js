import Qs from 'qs'

export default function ({ $axios, redirect }) {
  // 基本配置
  $axios.defaults.timeout = 10000
  $axios.defaults.method = 'post'
  // $axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  $axios.defaults.headers = { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
  $axios.defaults.transformRequest = [function (data) {
    data = Qs.stringify(data)
    return data
  }]

  $axios.onRequest((config) => {
    console.log('Making request to ' + config.url)
  })

  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status)
    console.log(error.response)
    if (code === 400) {
      redirect('/400')
    }
  })
}
