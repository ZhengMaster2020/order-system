import supplyFetch from './supply.fetch'

// 添加出库申请单 - 通过灌包订单获取订单信息
const getOrderBaggingInfo = (params) => {
  return supplyFetch({
    url: `/v1/search/search-order-bagging`,
    method: 'GET',
    params
  })
};

// 添加入库申请
const getBcOrderInFo = (params) => {
  return supplyFetch({
    url: `/v1/search/search-order-packing`,
    method: 'GET',
    params
  })
};

// 盘点管理-盘点记录添加-盘点对象
const getSupplyInfo = (params) => {
  return supplyFetch({
    url:'/v1/search/search-supplier',
    method:'GET',
    params
  })
}
export default {
  getOrderBaggingInfo,
  getBcOrderInFo,
  getSupplyInfo
}
