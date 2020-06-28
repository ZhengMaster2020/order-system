/* 常见问题设置 */
import ENV from './env'
import fetch from './fetch'

let baseURL = ENV ==='production' ?  '//api.fandow.com/' : '//kongtest.fandow.com/'

// 列表
const getFQAlist = (params) => {
  return fetch({
    url: `FAQ`,
    method: 'GET',
    baseURL,
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
    url: `FAQ/${id}`,
    method: 'GET',
    baseURL,
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
