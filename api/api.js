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

// 防串货 - 订单管理 - 列表
const orderManagementList = (params) => {
  return fetch({
    url: '/orderManagement',
    method: 'GET',
    params: params
  })
}

// 防串货 - 订单管理 - 新增
const addOrderManagement = (params) => {
  return fetch({
    url: '/orderManagement',
    method: 'POST',
    data: params
  })
}

// 防串货 - 订单管理 - 详情
const detailsOrderManagement = (params) => {
  return fetch({
    url:  `/orderManagement/${params}`,
    method: 'GET',
    params: params
  })
}

// 防串货 - 订单管理 - 更新/修改
const editOrderManagement = (params) => {
  console.log('????????????????????????????????????')
  return fetch({
    url: `/orderManagement/${params.id}`,
    method: 'PATCH',
    data: params
  })
}

// 防串货 - 订单管理 - 删除
const deleteOrderManagement = (params) => {
  return fetch({
    url: `/orderManagement/${params}`,
    method: 'DELETE' 
  })
}

// 防串货 - 订单管理 - 查找
const searchOrderManagement = (params) => {
  return fetch({
    url: '/orderManagement/search',
    method: 'GET',
    params: params
  })
}


export default {
  login,
  /* 防伪码 */
  securityCodeList,
  securityCodeCreate,
  securityCodeQuery,
  /* 订单管理 */
  orderManagementList,
  addOrderManagement,
  editOrderManagement,
  deleteOrderManagement,
  detailsOrderManagement,
  searchOrderManagement
}
