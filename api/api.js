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

// 物流管理 - 箱码查询
const boxCodeList = (params) => {
  return fetch({
    url: 'ticking/boxCodeQuery',
    method: 'GET',
    params: params
  })
}

// 物流管理 - 产品码查询 - 列表
const productCodeList = (params) => {
  return fetch({
    url: 'ticking/productCodeQuery',
    method: 'GET',
    params: params
  })
}

// 物流管理 - 产品码查询 - 查询物流信息
const productCodeSearch = (params) => {
  return fetch({
    url: `ticking/productCodeQuery/${params.id}`,
    method: 'GET',
    params: params
  })
}

export default {
  login,
  securityCodeList,
  securityCodeCreate,
  securityCodeQuery,
  boxCodeList,
  productCodeList,
  productCodeSearch
}
