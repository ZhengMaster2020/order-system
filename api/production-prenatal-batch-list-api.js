import fetch from './fetch'

// 生产批次 - 列表
const getProductionBatch = (params) => {
  return fetch({
    url: `traceability/productionBatch`,
    method: 'GET',
    params: params
  })
};

export default {
  getProductionBatch,

}
