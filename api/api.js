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

const cooperationList = (params) => {
  return fetch({
    url: 'ticking/cooperative',
    method: 'GET',
    params: params
  })
}

//账号管理 - 列表 
const accountNumberList = (params) => {
  return fetch({
    url: 'ticking/accountNumber',
    method: 'GET',
    params: params
  })
}

//加工厂管理 - 列表
const factoryMenagementList = (params) => {
  return fetch({
    url: 'ticking/processingfactory',
    method: 'GET',
    params: params
  })
}

//防串货 - 合作商管理 - 新增合作商管理
const addCooperationList = (params) => {
  return fetch({
    url: 'ticking/cooperative',
    method: 'POST',
    data: params
  })
}

//防串货 - 合作商管理 - 编辑
const addCooperationListEdit = (params) => {
  return fetch({
    url: `ticking/cooperative/${params.id}`,
    method: 'PATCH',
    data: params
  })
}

//加工厂管理 - 添加
const addFactoryManagement = (params) => {
  return fetch({
    url: 'ticking/processingfactory',
    method: 'POST',
    data: params
  })
}

//账号管理 - 添加 
const accountNumberAdd = (params) => {
  return fetch({
    url: 'ticking/accountNumber',
    method: 'POST',
    data: params
  })
}

//防串货 - 合作商管理 - 详情
const CooperationListaDetails = (params) => {
  return fetch({
    url: `ticking/cooperative/${params.id}`,
    method: 'GET',
    params: params
  })
}

//防串货 - 合作商管理 - 删除
const deleteCooperationList = (id) => {
  return fetch({
    url: `ticking/cooperative/${id.id}`,
    method: 'DELETE'
  })
}

//账号管理 - 删除
const accountNumberDelete = (params) => {
  return fetch({
    url: `ticking/accountNumber/${params.id}`,
    method: 'DELETE'
  })
}

//加工厂管理 - 详情
const detailsFactoryManagement = (params) => {
  return fetch({
    url: `ticking/processingfactory/${params}`,
    method: 'GET',
    data: params
  })
}
// 防串货 - 仓库管理 - 列表
const warehouseList = (params) => {
  return fetch({
    url: 'ticking/warehouse-management',
    method: 'GET',
    params: params
  })
}

// 防串货 - 仓库管理 - 添加
const warehouseAddList = (params) => {
  return fetch({
    url: 'ticking/warehouse-management',
    method: 'POST',
    data: params
  })
}

// 防串货 - 仓库管理 - 详情
const warehouseDetails = (id) => {
  return fetch({
    url: `ticking/warehouse-management/${id}`,
    method: 'GET'
  })
}

// 防串货 - 仓库管理 - 删除
const warehouseDelete = (params) => {
  return fetch({
    url: `ticking/warehouse-management/${params.id}`,
    method: 'GET',
    data:params
  })
}
  
// 防串货 - 仓库管理 - 编辑
const warehouseEdit = (params) => {
  return fetch({
    url: `ticking/warehouse-management/${params.id}`,
    method: 'PATCH',
    data:params
  })
}
  
// 防串货 - 仓库管理 - 负责人查询
const warehouseNameSelect = (params) => {
  return fetch({
    url: 'uac/users',
    method: 'GET',
    params:params
  })
}

//账号管理 - 修改
const accountNumberEdit = (params) => {
  return fetch({
    url: `ticking/accountNumber/${params.id}`,
    method: 'PATCH',
    data: params
  })
}

//加工厂管理 - 编辑
const editFactoryManagement = (params) => {
  return fetch({
    url: `ticking/processingfactory/${params.id}`,
    method: 'PATCH',
    data: params
  })
}

//加工厂管理 - 删除
const deleteFactoryManagement = (params) => {
  return fetch({
    url: `ticking/processingfactory/${params}`,
    method: 'DELETE'
  })
}


//账号管理 - 详情
const accountNumberDetail = (params) => {
  return fetch({
    url: `ticking/accountNumber/${params.id}`,
    method: 'GET',
    params: params
  })
}

//账号管理 - 查询
const accountNumberSearch = (params) => {
  return fetch({
    url: `ticking/accountNumber/search`,
    method: 'GET',
    params: params
  })
}

// 防串货 - 订单管理 - 列表
const orderManagementList = (params) => {
  return fetch({
    url: 'ticking/orderManagement',
    method: 'GET',
    params: params
  })
}

// 防串货 - 订单管理 - 新增
const addOrderManagement = (params) => {
  return fetch({
    url: 'ticking/orderManagement',
    method: 'POST',
    data: params
  })
}

// 防串货 - 订单管理 - 详情
const detailsOrderManagement = (params) => {
  return fetch({
    url: `ticking/orderManagement/${params}`,
    method: 'GET',
    params: params
  })
}

// 防串货 - 订单管理 - 更新/ 修改
const editOrderManagement = (params) => {
  return fetch({
    url: `ticking/orderManagement/${params.id}`,
    method: 'PATCH',
    data: params
  })
}

// 防串货 - 订单管理 - 删除
const deleteOrderManagement = (params) => {
  return fetch({
    url: `ticking/orderManagement/${params}`,
    method: 'DELETE'
  })
}

// 防串货 - 订单管理 - 查找
const searchOrderManagement = (params) => {
  return fetch({
    url: 'ticking/orderManagement/search',
    method: 'GET',
    params: params
  })
}

// 防串货-箱码管理-列表
const boxCodeMangementList = params => {
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
  /* 防伪码 */
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
  detailsFactoryManagement,
  accountNumberList,
  accountNumberAdd,
  accountNumberDelete,
  accountNumberEdit,
  accountNumberDetail,
  accountNumberSearch,
  addCooperationListEdit,
  /* 订单管理 */
  orderManagementList,
  addOrderManagement,
  editOrderManagement,
  deleteOrderManagement,
  detailsOrderManagement,
  searchOrderManagement,
  warehouseList,
  warehouseAddList,
  warehouseDetails,
  warehouseDelete,
  warehouseEdit,
  warehouseNameSelect,
  boxCodeMangementList,
  boxCodeCreate,
  searchOrderNum,
  boxCodeList,
  productCodeList,
  productCodeSearch
}
