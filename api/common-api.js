import fetch from './fetch'
// 搜索用户
const searchUSers = (params) => {
  return fetch({
    url: `uac/search/users`,
    method: 'GET',
    params: params
  })
};

// 获取权限菜单
const getPowerMenu = () => {
  return fetch({
    url: `traceability/userMenu`,
    method: 'GET',
  })
}

// 获取权限控制页面
const getPowerPage = () => {
  return fetch({
    url: `traceability/userMenu/admin`
  })
}

export default {
  searchUSers,
  getPowerMenu,
  getPowerPage
}
