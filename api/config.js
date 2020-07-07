/**
 * 接口配置，api服务器接口根地址
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgbaseUrl: 图片所在域名地址
 *ENV === 'production' ?  '//apisupply.fandow.com' : '//apisupplytest.fandow.com',
 */
import ENV from './env'

let baseUrl = '//api.fandow.com/oa/'
let fileUrl = '//api.fandow.com/oa/file'
let UAC_URL = '//api.fandow.com/oa/uac'
let userUrl = '//api.fandow.com/'
let skipAccessUrl = '//api.fandow.com/'
let API_SUPPLY = '//apisupply.fandow.com'

if (ENV === 'production') {
  console.log('---- production ----')
} else if (ENV === 'test') {
  console.log('---- test ----')
  baseUrl = 'http://kongtest.fandow.com/oa/'
  fileUrl = 'http://apibeta.fandow.com/oa/file'
  UAC_URL = 'http://kongtest.fandow.com/oa/uac'
  userUrl = 'http://kongtest.fandow.com/oa/uac'
  skipAccessUrl = '//kongtest.fandow.com/'
  API_SUPPLY = '//apisupplytest.fandow.com'
} else {
  console.log('---- develop ----')
  // baseUrl = 'http://kongtest.fandow.com/oa/'
  baseUrl = 'http://kongtest.fandow.com/oa/'
  fileUrl = 'http://apibeta.fandow.com/oa/file'
  UAC_URL = 'http://kongtest.fandow.com/oa/uac'
  userUrl = 'http://kongtest.fandow.com/oa/uac'
  skipAccessUrl = '//kongtest.fandow.com/'
  API_SUPPLY = '//apisupplytest.fandow.com'
}

export const SERVER_UAC_URL = UAC_URL
export const SERVER_BASE_URL = baseUrl
export const FILE_BASE_URL = fileUrl
export const USER_URL = userUrl
export const SKIP_ACCESS_URL = skipAccessUrl
export const APISUPPLY = API_SUPPLY
