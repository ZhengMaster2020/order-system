import fetch from './fetch'
/* 出库申请api */

const headers = {
  'x-authenticated-userid': '28792',
  "x-consumer-id" :  'f10ea114-81dc-44d2-af5a-08a05dc7f716',
}
// 列表
const getOutboundLsitIndex = (params) => {
  return fetch({
    url: `traceability/outbound-apply/index`,
    method: 'GET',
    params
  })
}

// 添加
const addOutboundLsit = (data) => {
  return fetch({
    url: `traceability/outbound-apply`,
    method: 'POST',
    data
  })
}

// 修改
const editOutboundLsit = (data) => {
  return fetch({
    url: `traceability/outbound-apply/${data.id}`,
    method: 'PATCH',
    data
  })
}

// 详情
const getOutboundLsitDetail = (id) => {
  return fetch({
    url: `traceability/outbound-apply/${id}`,
    method: 'GET'
  })
}

// 审核
const outboundLsitReview = (data) => {
  return fetch({
    url: `traceability/outbound-apply/audit`,
    method: 'POST',
    data
  })
}

// 完成出库
const outboundLsitFinished = (data) => {
  return fetch({
    url: `traceability/outbound-apply/finish-outbound`,
    method: 'POST',
    data
  })
}

// 记录列表
const getOutboundRecordIndex = (params) => {
  return fetch({
    url: `traceability/outbound-log/index`,
    method: 'GET',
    params
  })
}

// 统计灌包订单未确认+已确认出库数量
const getGBOrderSnNum = (params) => {
  return fetch({
    url: `traceability/outbound-apply/gb-outbound-number`,
    method: 'GET',
    params
  })
}

// 获取出库申请单待确认出库+已确认出库数量
const getOutboundApplySnNum = (id) => {
  return fetch({
    url: `traceability/outbound-apply/outbound-apply-number/{id}`,
    method: 'GET'
  })
}

// 模板导出
const exportOutboundtemplate = () => {
  return fetch({
    url: `traceability/outbound-apply/template-export`,
    method: 'POST'
  })
}

// // 数据导入
// const importSerialCodeData = (data) => {
//   return fetch({
//     url: `traceability/outbound-apply/data-import`,
//     method: 'POST',
//     data
//   })
// }

// 记录-作废
const repealOutboundRecord = (data) => {
  return fetch({
    url: `traceability/outbound-log/invalid`,
    method: 'POST',
    data
  })
}



export default {
  getOutboundLsitIndex,
  addOutboundLsit,
  editOutboundLsit,
  getOutboundLsitDetail,
  outboundLsitReview,
  getOutboundRecordIndex,
  getGBOrderSnNum,
  outboundLsitFinished,
  getOutboundApplySnNum,
  exportOutboundtemplate,
  // importSerialCodeData,
  repealOutboundRecord,
}
