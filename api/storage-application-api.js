import fetch from './fetch'

// 入库申请 - 列表
const getStorageList = (params) => {
  return fetch({
    url: `traceability/put-in-storage-apply`,
    method: 'GET',
    params
  })
};


export default {
  getStorageList,
}
