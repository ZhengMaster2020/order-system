import Cookie from 'js-cookie'

export default {

  // 获取服务端cookie
  getCookiesInServer: (req) => {
    let serviceCookie = {}

    req && req.headers.cookie && req.headers.cookie.split(';').forEach((val) => {
      let parts = val.split('=')
      serviceCookie[parts[0].trim()] = (parts[1] || '').trim()
    })

    return serviceCookie
  },
  // 获取客户端cookie
  getCookiesInClient: (key) => {
    return Cookie.get(key) ? Cookie.get(key) : ''
  }

}
