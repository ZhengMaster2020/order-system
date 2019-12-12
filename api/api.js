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

//加工厂管理 - 列表
const factoryMenagementList = (params) => {
  return fetch({
    url: '/processingfactory',
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

//加工厂管理 - 添加
const addFactoryManagement = (params) => {
  return fetch({
    url: '/processingfactory',
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

//加工厂管理 - 详情
const detailsFactoryManagement = (params) => {
  return fetch({
    url: `/processingfactory/${params}`,
    method: 'GET',
    data: params
  })
}

//加工厂管理 - 编辑
const editFactoryManagement = (params) => {
  return fetch({
    url: `/processingfactory/${params.id}`,
    method: 'PATCH',
    data: params
  })
}

//加工厂管理 - 删除
const deleteFactoryManagement = (params) => {
  return fetch({
    url: `/processingfactory/${params}`,
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
  deleteCooperationList,
  factoryMenagementList,
  addFactoryManagement,
  editFactoryManagement,
  deleteFactoryManagement,
  detailsFactoryManagement
}
