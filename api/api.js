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

// 防串货-箱码管理-列表
const boxCodeList = params => {
  return fetch({
    url: 'ticking/boxCodes',
    method: 'GET',
    params: params
  })
}

// 防串货-生成箱码
const boxCodeCreate = params => {
  return fetch({
    url: 'ticking/boxCode',
    method: 'POST',
    data: params
  })
}

// 防串货-模糊搜索订单编号
const searchOrderNum = params => {
  return fetch({
    url: 'ticking/securityCode/search',
    method: 'GET',
    params
  })
}

export default {
  login,
  securityCodeList,
  securityCodeCreate,
  securityCodeQuery,
  boxCodeList,
  boxCodeCreate,
  searchOrderNum
}
