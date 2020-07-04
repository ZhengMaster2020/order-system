import menuRouter from '~/plugins/router'
import otherRouter from '~/plugins/other-router'
import Util from '~/utils/app.js'

export const state = () => {
  let routers = Util.flat(menuRouter)
  return {
    pageOpenedList: [
      {
        title: '首页',
        path: '',
        name: 'index'
      }
    ],
    routers: [...routers, ...otherRouter]
  }
}
export const mutations = {
  // 打开页面
  openPage (state, newRoute) {
    let name = newRoute.name
    // 判断当前小窗口里是否有该页面
    let isHas = state.pageOpenedList.find(item => item.name === name)
    if (isHas) {
      isHas.query = newRoute.query
      // 已有
    } else {
      // 新页面
      let item = state.routers.find(item => item.name === name)
      if (item) {
        state.pageOpenedList.push({
          title: item.title,
          path: '',
          query: newRoute.query,
          name: name
        })
      } else {
        state.pageOpenedList.push({
          title: '未定义页面',
          path: '',
          query: newRoute.query,
          name: name
        })
      }
    }
    this.commit('app/setTabLocal')
  },
  // 关闭某个页面
  closeTag (state, name) {
    let index = null;
    state.pageOpenedList.find((item, i) => {
      if (item.name === name) {
        index = i
      }
      return item.name === name
    })
    state.pageOpenedList.splice(index, 1)
    this.commit('app/setTabLocal')
  },
  // 关闭所有页面
  clearAllTags (state) {
    state.pageOpenedList = [
      {
        title: '首页',
        path: '',
        name: 'index'
      }
    ]
    this.commit('app/setTabLocal')
  },
  // 关闭其他页面
  clearOtherTags (state, name) {
    let keepItem = null
    let result = [
      {
        title: '首页',
        path: '',
        name: 'index'
      }
    ]
    if (name !== 'index') {
      keepItem = state.pageOpenedList.find(item => item.name === name)
    }
    if (keepItem) {
      result.push(keepItem)
    }
    state.pageOpenedList = result
    this.commit('app/setTabLocal')
  },
  // 保存打开页面栈道
  setTabLocal (state) {
    let tapArr = state.pageOpenedList.map(item => {
      return item.title && item.title !== '未定义页面' && item.name !== 'index' ? item : null
    })
    tapArr = tapArr.filter(item => item)
    localStorage.setItem('security_tag', JSON.stringify(tapArr))
  },
  init (state) {
    let selectTag = JSON.parse(localStorage.getItem('security_tag')) || []
    state.pageOpenedList = [
      {
        title: '首页',
        path: '',
        name: 'index'
      },
      ...selectTag
    ]
  }
}
