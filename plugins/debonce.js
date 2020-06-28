import Vue from 'vue'

/*
 * 防抖函数（多次事件触发后、事件处理函数只执行一次）
 * fn 源函数
 * delay 脑补吧
 * run String "bothends" => 定时器两端执行（默认）  "header" => 开头执行  "footer" => "结尾执行"
 *
 * 用法：(参考营销部-市场监控-商品名称模糊搜索)
 * data(){
 *    return {
 *      searchGoodsNameDebonce: this.$debonce(this.searchGoodsName,500)
 *     }
 *  }
 */

function debonce(fn,delay ,run = 'bothends') {
  let timer = null
  // 等待函数
  const later = (what,params) => {
    timer = setTimeout(() => {
      if (run !== 'header') {
        fn.apply(what, params)
      }
      timer = null
    }, delay)
  }
  return (...params) => {
    // 如果开头执行函数
    if (run !== 'footer') {
      if (!timer) {
        fn.apply(this, params)
      }
    }
    clearTimeout(timer)
    return later(this,params)

  }
}
Vue.prototype.$debonce = debonce
