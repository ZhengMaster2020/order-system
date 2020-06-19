import supplyFetch from './supply.fetch'

// 入库申请 - 列表
const getsupplylist = (params) => {
  return supplyFetch({
    url: `/v1/search/search-order-packing`,
    method: 'GET',
    params
  })
};


export default {
  getsupplylist,
}
