import fetch from './fetch'

const login = (params) => {
  return fetch({
    url: '/login',
    method: 'POST',
    data: params
  })
}

// 防伪码管理 - 列表
const securityCodeList = (params) => {
  return fetch({
    url: '/securityCode',
    method: 'GET',
    params: params
  })
}

// 防伪码管理 - 添加
const securityCodeCreate = (params) => {
  return fetch({
    url: '/securityCode',
    method: 'POST',
    data: params
  })
}

// 防伪码查询 - 列表
const securityCodeQuery = (params) => {
  return fetch({
    url: '/securityCodeQuery',
    method: 'GET',
    params: params
  })
}

//账号管理 - 列表 
const accountNumberList = (params) => {
  return fetch({
    url: '/accountNumber',
    method: 'GET',
    params: params
  })
}

//账号管理 - 添加 
const accountNumberAdd = (params) => {
  return fetch({
    url: '/accountNumber',
    method: 'POST',
    data: params
  })
}

//账号管理 - 删除
const accountNumberDelete = (params) => {
  return fetch({
    url: `/accountNumber/${params.id}`,
    method: 'DELETE'
  })
}

//账号管理 - 修改
const accountNumberEdit = (params) => {
  return fetch({
    url: `/accountNumber/${params.id}`,
    method: 'PATCH',
    data: params
  })
}

//账号管理 - 详情
const accountNumberDetail = (params) => {
  return fetch({
    url: `/accountNumber/${params.id}`,
    method: 'GET',
    params: params
  })
}

//账号管理 - 查询
const accountNumberSearch = (params) => {
  return fetch({
    url: `/accountNumber/search`,
    method: 'GET',
    params: params
  })
}

export default {
  login,
  securityCodeList,
  securityCodeCreate,
  securityCodeQuery,
  accountNumberList,
  accountNumberAdd,
  accountNumberDelete,
  accountNumberEdit,
  accountNumberDetail,
  accountNumberSearch
}
