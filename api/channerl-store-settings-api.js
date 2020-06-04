/* 渠道店铺设置 */
import ENV from './env'
import fetch from './fetch'

let baseURL = ENV ==='production' ?  'http://api.fandow.com/' : 'http://kongtest.fandow.com/'

// 列表
const getChannelStorelist = (params) => {
  return fetch({
    url: `channelStore`,
    method: 'GET',
    baseURL,
    params
  })
}

// 渠道列表 可单条数据获取-下拉选项
const getChannelLists = (params) => {
  return fetch({
    url: `channelStore/channel`,
    method: 'GET',
    baseURL,
    params
  })
}

// 渠道 新增
const addChannelLists = ({data}) => {
  return fetch({
    url: `traceability/channelStore/channel`,
    method: 'POST',
    data
  })
}

// 渠道 详情
const getChannelListsDetail = ({id}) => {
  return fetch({
    url: `channelStore/channel/${id}`,
    method: 'GET',
    baseURL
  })
}

// 渠道 更新
const editChannelLists = ({data, id}) => {
  return fetch({
    url: `traceability/channelStore/channel/${id}`,
    method: 'PATCH',
    data
  })
}

// 渠道 删除
const delChannelLists = (id) => {
  return fetch({
    url: `traceability/channelStore/channel/${id}`,
    method: 'DELETE',
  })
}

// 店铺 新增
const addStoreLists = ({data}) => {
  return fetch({
    url: `traceability/channelStore/shop/`,
    method: 'POST',
    data
  })
}

// 店铺 详情
const getStoreListsDetail = ({channelId, shopId}) => {
  return fetch({
    url: `traceability/channelStore/shop/${shopId}/channelId/${channelId}`,
    method: 'GET',
  })
}

// 店铺 更新
const editStoreLists = ({data, channelId, shopId}) => {
  return fetch({
    url: `traceability/channelStore/shop/${shopId}/channelId/${channelId}`,
    method: 'PATCH',
    data
  })
}

// 店铺 删除
const delStoreLists = (channelId, shopId) => {
  return fetch({
    url: `traceability/channelStore/shop/${shopId}/channelId/${channelId}`,
    method: 'DELETE',
  })
}

export default {
  getChannelStorelist,
  getChannelLists,
  addChannelLists,
  getChannelListsDetail,
  editChannelLists,
  delChannelLists,
  addStoreLists,
  getStoreListsDetail,
  editStoreLists,
  delStoreLists
}
