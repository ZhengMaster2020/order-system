import fetch from './fetch'
import ENV from './env'


// 生产批次 - 列表
const getProductionBatch = (params) => {
  return fetch({
    url: `traceability/productionBatch`,
    method: 'GET',
    params: params
  })
}

// 生产批次 - 导表处理详情
const getProductionBatchExportDetail = (params) => {
  return fetch({
    url: `traceability/productionBatch/showExportHandle`,
    method: 'POST',
    data: params
  })
}

// 生产批次 - 导表
const getProductionBatchExport = (params) => {
  return fetch({
    url: `traceability/productionBatch/exportHandle`,
    method: 'POST',
    data: params
  })
}

// 生产批次 - 采购系统供应商相关信息
const getOrderPacking = (params) => {
  return fetch({
    url: `v1/search/search-order-packing`,
    method: 'GET',
    baseURL: ENV === 'production' ?  'http://apisupply.fandow.com' : 'http://apisupplytest.fandow.com',
    params: params
  })
};

// 生产批次 - 已处理的批次数量
const getProductionBatchCountNum = ({orderNumber}) => {
  return fetch({
    url: `traceability/productionBatch/countNum/${orderNumber}`,
    method: 'GET',
  })
};

// 生产批次 - 撤销生产
const delProductionBatch = ({params, id}) => {
  return fetch({
    url: `traceability/productionBatch/revoke/${id}`,
    method: 'DELETE',
    params: params,
  })
};

export default {
  getProductionBatch,
  getProductionBatchExportDetail,
  getOrderPacking,
  getProductionBatchCountNum,
  getProductionBatchExport,
  delProductionBatch
}
