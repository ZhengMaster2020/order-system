import fetch from './fetch'

// 防伪码查询-新防伪码查询记录 - 列表
const getSecurityHistoryNewList = (params) => {
  return fetch({
    url: `traceability/securityCodeQuery/new`,
    method: 'GET',
    params: params
  })
};

// 防伪码查询-旧防伪码查询记录 - 列表
const getSecurityHistoryOldList = (params) => {
  return fetch({
    url: `traceability/securityCodeQuery/old`,
    method: 'GET',
    params: params
  })
};

// 防伪码查询-查询导出日志列表
const getSecurityExportList = (params) => {
  return fetch({
    url: `traceability/securityCodeQuery/getExportLog/${params.type}`,
    method: 'GET',
    params: params
  })
};

// 防伪码查询-获取验证码
const getSecurityExportKey = () => {
  return fetch({
    url: `traceability/securityCodeQuery/sendSms`,
    method: 'GET'
  })
}

// 防伪码查询-新版防伪码导出查询记录
const exportNewSecurityList = (params) => {
  return fetch({
    url: `traceability/securityCodeQuery/export/new`,
    method: 'POST',
    data: params,
    responseType: 'blob'
  })
}

// 防伪码查询-旧版防伪码导出查询记录
const exportOldSecurityList = (params) => {
  return fetch({
    url: `traceability/securityCodeQuery/export/old`,
    method: 'POST',
    data: params,
    responseType: 'blob'
  })
}

// 新防伪码日志
const getNewSecurityCodeLog = (params) => {
  return fetch({
    url: `traceability/trace/traceLog/new`,
    method: 'GET',
    params
  })
}

// 旧防伪码日志
const getOldSecurityCodeLog = (params) => {
  return fetch({
    url: `traceability/trace/traceLog/old`,
    method: 'GET',
    params
  })
}

export default {
  getSecurityHistoryNewList,
  getSecurityHistoryOldList,
  getSecurityExportList,
  getSecurityExportKey,
  exportNewSecurityList,
  exportOldSecurityList,
  getNewSecurityCodeLog,
  getOldSecurityCodeLog
}
