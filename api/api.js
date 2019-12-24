import fetch from './fetch'

const login = (params) => {
  return fetch({
    url: 'uac/authentication/password-grant',
    method: 'POST',
    data: params
  })
}

// 防伪码管理 - 列表
const securityCodeList = (params) => {
  return fetch({
    url: 'ticking/securityCode',
    method: 'GET',
    params: params
  })
}

// 防伪码管理 - 添加
const securityCodeCreate = (params) => {
  return fetch({
    url: 'ticking/securityCode',
    method: 'POST',
    data: params
  })
}

// 防伪码查询 - 列表
const securityCodeQuery = (params) => {
  return fetch({
    url: 'ticking/securityCodeQuery',
    method: 'GET',
    params: params
  })
}

export default {
  login,
  securityCodeList,
  securityCodeCreate,
  securityCodeQuery
}
