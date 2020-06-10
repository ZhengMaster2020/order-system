import fetch from './fetch'
// 搜索用户
const searchUSers = (params) => {
  return fetch({
    url: `uac/search/users`,
    method: 'GET',
    params: params
  })
};
export default {
  searchUSers
}
