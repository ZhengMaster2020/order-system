<style lang="less">
@import '~assets/main.less';
@import '~assets/common.less';
</style>

<template>
  <div class="main" :class="{ 'main-hide-text': shrink }">
    <div
      class="sidebar-menu-con"
      :style="{
        width: shrink ? '60px' : '200px',
        overflow: shrink ? 'visible' : 'auto',
      }"
    >
      <shrinkable-menu
        :shrink="shrink"
        :theme="menuTheme"
        :before-push="beforePush"
        :open-names="openedSubmenuArr"
        :menu-list="menuList"
        @on-change="handleSubmenuChange"
      >
        <div slot="top" class="logo-con">
          <img v-show="!shrink" key="max-logo" src="~assets/images/logo.png" />
          <img
            v-show="shrink"
            key="min-logo"
            src="~assets/images/logo-min.png"
          />
        </div>
      </shrinkable-menu>
    </div>
    <div
      class="main-header-con"
      :style="{ paddingLeft: shrink ? '60px' : '200px' }"
    >
      <div class="main-header">
        <div class="navicon-con">
          <Button
            :style="{
              transform: 'rotateZ(' + (shrink ? '-90' : '0') + 'deg)',
              padding: '5px 10px 6px',
              marginTop: '2px',
            }"
            type="text"
            @click="toggleClick"
          >
            <Icon type="md-menu" size="24" />
          </Button>
        </div>
        <div class="header-middle-con">
          <div class="main-breadcrumb">
            <breadcrumb-nav v-if="breadList" :current-path="breadList"></breadcrumb-nav>
          </div>
        </div>
        <div class="header-avator-con">
          <div class="full-screen-btn-con" @click="handleRefresh">
            <Tooltip content="刷新" placement="bottom">
              <Icon type="md-refresh" :size="23" />
            </Tooltip>
          </div>
          <full-screen
            v-model="isFullScreen"
            @on-change="fullscreenChange"
          ></full-screen>
          <!-- <lock-screen></lock-screen>
          <message-tip v-model="mesCount"></message-tip> -->
          <div class="user-dropdown-menu-con">
            <Row
              type="flex"
              justify="end"
              align="middle"
              class="user-dropdown-innercon"
            >
              <Dropdown
                transfer
                trigger="click"
                @on-click="handleClickUserDropdown"
              >
                <a href="javascript:void(0)">
                  <span class="main-user-name">{{ userInfo.realName }}</span>
                  <Icon type="md-arrow-dropdown" />
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem name="ownSpace">
                    个人中心
                  </DropdownItem>
                  <DropdownItem name="loginout" divided>
                    退出登录
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Avatar
                :src="avatorPath"
                style="background: #619fe7;margin-left: 10px;"
              ></Avatar>
            </Row>
          </div>
        </div>
      </div>
      <div class="tags-con">
        <tags-page-opened :page-tags-list="pageTagsList"></tags-page-opened>
      </div>
    </div>
    <div class="single-page-con" :style="{ left: shrink ? '60px' : '200px' }">
      <div class="single-page">
        <nuxt />
      </div>
    </div>
  </div>
</template>

<script>
import ENV from '../api/env'
import Cookies from 'js-cookie'
import router from '~/plugins/router'
import otherRouter from '~/plugins/other-router'
import shrinkableMenu from '~/components/shrinkable-menu/shrinkable-menu.vue'
import tagsPageOpened from '~/components/tags-page-opened.vue'
import breadcrumbNav from '~/components/breadcrumb-nav.vue'
import fullScreen from '~/components/full-screen.vue'
// import lockScreen from '~/components/lockscreen/lockscreen.vue'
// import messageTip from '~/components/message-tip.vue'
export default {
  middleware: 'auth',
  components: {
    shrinkableMenu,
    tagsPageOpened,
    breadcrumbNav,
    fullScreen
    // lockScreen,
    // messageTip
  },
  head() {
    return {
      title: '防伪码系统',
    }
  },
  data() {
    return {
      shrink: false,
      userName: '',
      isFullScreen: false,
      openedSubmenuArr: [],
      menuList: [],
      beforePush: true,
      userInfo: {},
      breadList: [{name: '首页', path: '/'}]
    }
  },
  computed: {
    pageTagsList() {
      return this.$store.state.app.pageOpenedList // 打开的页面的页面对象
    },
    currentPath() {
      // return this.$store.state.app.currentPath // 当前面包屑数组
      return []
    },
    avatorPath() {
      // return localStorage.avatorImgPath
      return ''
    },
    menuTheme() {
      // return this.$store.state.app.menuTheme
      return 'dark'
    },
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.$nuxt.$loading.start()
    //   setTimeout(() => this.$nuxt.$loading.finish(), 600)
    // })
    this.$API.getPowerMenu().then((res) => {
      if (res.code === 0) {
        let params = res.data
        params.push('/GET/notebook/index')
        if (params.length) {
          this.menuList = this.routerPower(params, router)
        }
      }
    })
    this.wmStyle()
    this.$API.getUserInfo().then((res) => {
      if (res.code === 0) {
        window.localStorage.setItem('userInfo', JSON.stringify(res.data))
        this.userInfo = res.data
      }
    })
    this.$store.commit('app/init')
    this.setBread()
  },
  methods: {
    toggleClick() {
      this.shrink = !this.shrink
    },
    handleRefresh() {
      // window.localStorage.removeItem('menus');
      window.location.reload()
    },
    handleClickUserDropdown(name) {
      if (name === 'ownSpace') {
        // util.openNewPage(this, 'ownspace_index');
        this.$router.push({
          name: 'ownspace_index',
        })
      } else if (name === 'loginout') {
        // 退出登录
        this.$store.commit('logout', this)
        this.$store.commit('clearOpenedSubmenu')
        Cookies.remove('authorization')
        this.$router.push({
          name: 'login',
        })
      }
    },
    handleSubmenuChange(val) {
      // console.log(val)
    },
    fullscreenChange(isFullScreen) {
      // console.log(isFullScreen);
    },
    wmStyle() {
      let userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
      let style = document.createElement('style')
      let content = userInfo.username + ' ' + userInfo.realName
      style.setAttribute('type', 'text/css')
      // ivu-table-tbody
      style.innerHTML = `
        .ivu-table::before{
        box-sizing: border-box; content: '   ';
        display: block;
        width: 100%;
        height: 100%;
        pointer-events: none;
        background-color: transparent;
        filter: alpha(opacity=70);
        opacity: 0.7;
        z-index: 1000;
        background-image: url('${this.canvasWM({ content })}')
        }
        .ivu-card {
        background-image: url('${this.canvasWM({
          content,
          fillStyle: '#e8e8e8',
        })}')
        }
        .ivu-modal-body::before {
        background-image: url('${this.canvasWM({
          content,
          fillStyle: '#e8e8e8',
        })}')
        }`
      document.head.appendChild(style)
    },
    canvasWM({
      container = document.body,
      width = '170px',
      height = '80px',
      textAlign = 'center',
      textBaseline = 'middle',
      font = '12px microsoft yahei',
      fillStyle = '#d6d7da',
      content = '请勿外传',
      rotate = '-10',
      zIndex = 1000,
    } = {}) {
      let canvas = document.createElement('canvas')

      canvas.setAttribute('width', width)
      canvas.setAttribute('height', height)
      let ctx = canvas.getContext('2d')

      ctx.textAlign = textAlign
      ctx.textBaseline = textBaseline
      ctx.font = font
      ctx.fillStyle = fillStyle
      ctx.rotate((Math.PI / 180) * rotate)
      ctx.fillText(content, parseFloat(width) / 2, parseFloat(height) / 2)

      let base64Url = canvas.toDataURL()
      return base64Url
    },
    // 路由权限过滤
    routerPower (powerList, routerList) {
      let result = []
      routerList.forEach(item => {
        if (item.children && item.children.length) {
          item.children = this.routerPower(powerList, item.children)
          if (item.children.length) {
            result.push(item)
          }
        } else {
          let findItem = powerList.find(it => it === item.path)
          if (findItem) {
            result.push(item)
          }
        }
      })
      return result
    },
    // 找到路由组
    findRouteGroup (route, searchList, parentList = [{name: '首页', path: '/'}]) {
      if (route === '/') {
        return parentList
      }
      for (let i = 0; i < searchList.length; i++) {
        const item = searchList[i];
        if (!item.children || !item.children.length) {
          if (item.name === route) {
            let result = JSON.parse(JSON.stringify(parentList))
            result.splice(2, 1, {name: item.title})
            return result
          }
        } else {
          let result = this.findRouteGroup(route, item.children)
          if (result) {
            result.splice(2, 1, {name: item.title})
            return result
          }
        }
      }
    },
    // 设置面包屑
    setBread () {
      let breadList = this.findRouteGroup(this.$route.path.slice(1), router)
      if (breadList) {
        this.breadList = breadList
      } else {
        let result = otherRouter.find(item => item.name === this.$route.path.slice(1))
        this.breadList = result ? [{name: '首页', path: '/'}, {name: result.title}] : result
      }
    }
  },
  watch: {
    $route (newVal) {
      // let tooltips = document.querySelectorAll('.ivu-tooltip-popper')
      // tooltips.forEach((item) => {
      //   item.style.display = 'none'
      // })
      this.setBread()
      this.$store.commit('app/openPage', newVal);
    }
  }
}
</script>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}
</style>
