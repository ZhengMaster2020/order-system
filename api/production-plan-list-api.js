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

// 生产计划 - 经理审核
const managerReview = (params) => {
  return fetch({
    url: `traceability/productionPlan/audit/${params.id}`,
    method: 'POST',
    data: params
  })
};

// 生产计划 - 执行生成计划
const executeProductionPlan = ({params, id}) => {
  return fetch({
    url: `traceability/productionBatch/${id}`,
    method: 'POST',
    data: params
  })
};

// 生产计划 - 执行完毕
const finishedProductionPlan = ({params, id}) => {
  return fetch({
    url: `traceability/productionPlan/finished/${id}`,
    method: 'POST',
    data: params
  })
};

// 生产计划 - 删除计划
const delProductionPlan = ({id}) => {
  return fetch({
    url: `traceability/productionPlan/${id}`,
    method: 'DELETE',
  })
};

// 生产计划 - 修改计划
const editProductionPlan = ({params, id}) => {
  return fetch({
    url: `traceability/productionPlan/${id}`,
    method: 'PATCH',
    data: params
  })
};


export default {
  getProductionPlan,
  addProductionPlan,
  getProductionPlanDetail,
  getPlanStatusDetail,
  managerReview,
  executeProductionPlan,
  finishedProductionPlan,
  delProductionPlan,
  editProductionPlan
}
