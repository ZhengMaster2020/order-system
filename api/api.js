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

// 防串货 - 仓库管理 - 列表
const warehouseList = (params) => {
  return fetch({
    url: '/warehouse-management',
    method: 'GET',
    params: params
  })
}

// 防串货 - 仓库管理 - 添加
const warehouseAddList = (params) => {
  return fetch({
    url: '/warehouse-management',
    method: 'POST',
    data: params
  })
}

// 防串货 - 仓库管理 - 详情
const warehouseDetails = (id) => {
  return fetch({
    url: `/warehouse-management/${id}`,
    method: 'GET'
  })
}

// 防串货 - 仓库管理 - 删除
const warehouseDelete = (params) => {
  return fetch({
    url: `/warehouse-management/${params.id}`,
    method: 'GET',
    data:params
  })
}

// 防串货 - 仓库管理 - 编辑
const warehouseEdit = (params) => {
  return fetch({
    url: `/warehouse-management/${params.id}`,
    method: 'PATCH',
    data:params
  })
}

// 防串货 - 仓库管理 - 负责人查询
const warehouseNameSelect = (params) => {
  return fetch({
    url: '/users',
    method: 'GET',
    params:params
  })
}


export default {
  login,
  securityCodeList,
  securityCodeCreate,
  securityCodeQuery,
  warehouseList,
  warehouseAddList,
  warehouseDetails,
  warehouseDelete,
  warehouseEdit,
  warehouseNameSelect
}
