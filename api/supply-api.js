import supplyFetch from './supply.fetch'

// 添加入库申请
const getBcOrderInFo = (params) => {
  return supplyFetch({
    url: `/v1/search/search-order-packing`,
    method: 'GET',
    params
  })
};


export default {
  getBcOrderInFo,
}
