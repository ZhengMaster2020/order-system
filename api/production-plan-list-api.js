import fetch from './fetch'

// 防伪码查询-新防伪码查询记录 - 列表
const getProductionPlan = (params) => {
  return fetch({
    url: `traceability/productionPlan`,
    method: 'GET',
    params: params
  })
};


export default {
  getProductionPlan
}
