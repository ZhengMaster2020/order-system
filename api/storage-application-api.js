import fetch from './fetch'

// 入库申请 - 列表
const getStorageList = (params) => {
  return fetch({
    url: `traceability/put-in-storage-apply`,
    method: 'GET',
    params
  })
};

// 入库申请 - 详情 入库申请id
const getStorageDetail = (id) => {
  return fetch({
    url: `traceability/put-in-storage-apply/${id}`,
    method: 'GET'
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


// 入库申请单 - 审核
const reviewStorage = (data) => {
  return fetch({
    url: `traceability/put-in-storage-apply/audit`,
    method: 'POST',
    data
  })
};

// 入库申请单 - 添加
const addStorageApply = (data) => {
  return fetch({
    url: `traceability/put-in-storage-apply`,
    method: 'POST',
    data
  })
};

// 入库申请单 - 修改
const editStorageApply = (data) => {
  return fetch({
    url: `traceability/put-in-storage-apply`,
    method: 'PATCH',
    data
  })
};

// 入库申请单 - 通过批次号统计入库数量(待确认+已确认)
const getStorageBatchNumber = (params) => {
  return fetch({
    url: `traceability/put-in-storage-apply/batch-number`,
    method: 'GET',
    params
  })
};

// 入库申请单 - 通过入库申请id获取入库数量(待确认+已确认)
const getNumberByApplyId = (id) => {
  return fetch({
    url: `traceability/put-in-storage-apply/apply-storage/${id}`,
    method: 'GET',
  })
};

// 入库申请单 - 手动入库
const manualStotageApply = (data) => {
  return fetch({
    url: `traceability/put-in-storage-apply/handle`,
    method: 'POST',
    data
  })
};

// 入库申请单 - 完成入库
const finishedStotageApply = (data) => {
  return fetch({
    url: `traceability/put-in-storage-apply/finish`,
    method: 'POST',
    data
  })
};

// 入库记录 - 列表
const getStorageRecord = (params) => {
  return fetch({
    url: `traceability/storage-record`,
    method: 'GET',
    params
  })
};

// 入库记录 - 选择相同入库申请的待确认入库记录
const getStorageRecordByIds = (data) => {
  return fetch({
    url: `traceability/storage-record/select`,
    method: 'POST',
    data
  })
};

// 入库记录 - 入库确认
const confirmStorageRecord = (data) => {
  return fetch({
    url: `traceability/storage-record/confirm`,
    method: 'POST',
    data
  })
};

// 入库记录 - 详情
const getStorageRecordDetail = (id) => {
  return fetch({
    url: `traceability/storage-record/${id}`,
    method: 'GET',
  })
};

// 入库记录 - 作废
const cancelStorageRecord = (data) => {
  return fetch({
    url: `traceability/storage-record/invalid`,
    method: 'POST',
    data
  })
};


export default {
  getStorageList,
  getNumberByOrder,
  getNumberByBatch,
  getStorageDetail,
  reviewStorage,
  addStorageApply,
  editStorageApply,
  getStorageBatchNumber,
  getNumberByApplyId,
  manualStotageApply,
  finishedStotageApply,
  getStorageRecord,
  getStorageRecordByIds,
  confirmStorageRecord,
  cancelStorageRecord,
  getStorageRecordDetail,
}
