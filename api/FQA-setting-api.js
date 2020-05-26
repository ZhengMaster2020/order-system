/* 常见问题设置 */

import fetch from './fetch'

// 列表
const getFQAlist = (params) => {
  return fetch({
    url: `traceability/FAQ`,
    method: 'GET',
    params
  })
}

// 新增
const addFQAlist = ({data}) => {
  return fetch({
    url: `traceability/FAQ`,
    method: 'POST',
    data
  })
}

// 详情
const getFQAlistDetail = ({id}) => {
  return fetch({
    url: `traceability/FAQ/${id}`,
    method: 'GET',
  })
}

// 修改
const editFQAlist = ({data, id}) => {
  return fetch({
    url: `traceability/FAQ/${id}`,
    method: 'PATCH',
    data
  })
}

// 变更状态
const statusChangeFQA = ({id, status}) => {
  return fetch({
    url: `traceability/FAQ/change/${id}/status/${status}`,
    method: 'PUT',
  })
}

export default {
  getFQAlist,
  addFQAlist,
  editFQAlist,
  getFQAlistDetail,
  statusChangeFQA,
}
