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
import Env from './env'

let baseUrl = 'api-security.fandow.com'

if (Env === 'production') {
  console.log('---- production ----')
} else if (Env === 'test') {
  baseUrl = 'http://120.27.137.99:18606'
  console.log('---- test ----')
} else {
  baseUrl = 'http://apibeta.fandow.com/oa/ticking'
  console.log('---- develop ----')
}
//http://api-tickingbeta.fandow.com
export const SERVER_BASE_URL = baseUrl
export const JsCookies = Cookies
