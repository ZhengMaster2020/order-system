/* 渠道店铺设置 */

import fetch from './fetch'

// 列表
const getChannelStorelist = (params) => {
  return fetch({
    url: `traceability/channelStore`,
    method: 'GET',
    params
  })
}

// 渠道列表
const getChannelLists = (params) => {
  return fetch({
    url: `traceability/channelStore/channel`,
    method: 'GET',
    params
  })
}


export default {
  getChannelStorelist,
  getChannelLists
}
