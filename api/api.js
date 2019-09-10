import fetch from './fetch'

const login = (params) => {
  return fetch({
    url: '/login',
    method: 'POST',
    data: params
  })
}
const index = (params) => {
  return fetch({
    url: '/v2/operate-dept/design-center/index',
    method: 'GET',
    params: params
  })
}

// 公司所有权
const getOwnership = (params) => {
  return new Promise((resolve, reject) => {
    const data = [
      { label: '公司所有权', ownership: 'company' },
      { label: '部门所有权', ownership: 'department' },
      { label: '我的所有权', ownership: 'self' }
    ]
    resolve(data)
  })
}
// 审核状态
const getAuditStatus = (parmas) => {
  return new Promise((resolve, reject) => {
    const data = [
      { label: '待直属上级审核', value: 'company' },
      { label: '直属上级审核不通过', value: 'department' },
      { label: '待行政审核', value: 'self' },
      { label: '行政审核不通过', value: 'no' },
      { label: '待领取', value: 'wait' },
      { label: '已领取', value: 'already' }
    ]
    resolve(data)
  })
}

export default {
  login,
  index,
  getOwnership,
  getAuditStatus
}
