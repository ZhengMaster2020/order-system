import fetch from './fetch'

// 生产计划 - 列表
const getProductionPlan = (params) => {
  return fetch({
    url: `traceability/productionPlan`,
    method: 'GET',
    params: params
  })
};

// 生产计划 - 添加计划
const addProductionPlan = (params) => {
  return fetch({
    url: `traceability/productionPlan`,
    method: 'POST',
    data: params
  })
};

// 生产计划 - 详情
const getProductionPlanDetail = ({id}) => {
  return fetch({
    url: `traceability/productionPlan/${id}`,
    method: 'GET',
  })
};

// 生产计划 - 状态详情
const getPlanStatusDetail = ({id}) => {
  return fetch({
    url: `traceability/productionPlan/status/${id}`,
    method: 'GET',
  })
};


export default {
  getProductionPlan,
  addProductionPlan,
  getProductionPlanDetail,
  getPlanStatusDetail
}
