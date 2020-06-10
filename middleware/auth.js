import utils from '~/utils/utils'
export default function ({ route, req, res, redirect }) {
  const isClient = process.client
  const isServer = process.server
  let redirectURL = '/login'
  let token, path

  // 在服务端
  if (isServer) {
    const cookies = utils.getCookiesInServer(req)
    path = req.originalUrl
    token = cookies.authorization ? cookies.authorization : ''
  }

  // 在客户端判读是否需要登陆
  if (isClient) {
    token = utils.getCookiesInClient('authorization')
    path = route.path
  }

  if (path) {
    redirectURL = '/login?ref=' + encodeURIComponent(path)
  }
  
  // 需要进行权限判断的页面开头
  if (!token) {
    redirect(redirectURL)
  }
}