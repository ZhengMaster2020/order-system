import fetch from './fetch'

// 入库申请 - 列表
const getStorageList = (params) => {
  return fetch({
    url: `traceability/put-in-storage-apply`,
    method: 'GET',
    params
  })
};

// 入库申请单 - 统计包材订单待确认入库量+已实际入库量
const getNumberByOrder = (params) => {
  return fetch({
    url: `traceability/put-in-storage-apply/order-number`,
    method: 'GET',
    params
  })
};

// 入库申请单 - 统计包材订单待确认入库量+已实际入库量
const getNumberByBatch = (params) => {
  return fetch({
    url: `traceability/put-in-storage-apply/batch-number`,
    method: 'GET',
    params
  })
};


export default {
  getStorageList,
  getNumberByOrder,
  getNumberByBatch,
}
