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

//防串货 - 合作商管理 - 列表
const cooperationList = (params) => {
  return fetch({
    url: '/cooperative',
    method: 'GET',
    params: params
  })
}

//防串货 - 合作商管理 - 新增合作商管理
const addCooperationList = (params) => {
  return fetch({
    url: '/cooperative',
    method: 'POST',
    data: params
  })
}

//防串货 - 合作商管理 - 详情
const CooperationListaDetails = (params) => {
  return fetch({
    url: `/cooperative/${params.id}`,
    method: 'GET',
    params: params
  })
}

//防串货 - 合作商管理 - 删除
const deleteCooperationList = (id) => {
  return fetch({
    url: `/cooperative/${id.id}`,
    method: 'DELETE'
  })
}


export default {
  login,
  securityCodeList,
  securityCodeCreate,
  securityCodeQuery,
  cooperationList,
  addCooperationList,
  CooperationListaDetails,
  deleteCooperationList
}
