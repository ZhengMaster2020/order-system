/**
 * 接口配置，api服务器接口根地址
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgbaseUrl: 图片所在域名地址
 *
 */

import Cookies from 'js-cookie'

let baseUrl = 'https://api-offline.fandow.com'

if (process.env.NODE_ENV === 'production') {
  console.log('---- production ----')
} else if (process.env.NODE_ENV === 'test') {
  baseUrl = 'http://api-tickingbeta.fandow.com'
  console.log('---- test ----')
} else {
  baseUrl = 'http://api-tickingbeta.fandow.com'
  console.log('---- develop ----')
}

export const SERVER_BASE_URL = baseUrl
export const JsCookies = Cookies
