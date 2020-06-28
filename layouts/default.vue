<style lang="less">
@import '~assets/main.less';
@import '~assets/common.less';
</style>

<template>
  <div class="main" :class="{ 'main-hide-text': shrink }">
    <div class="sidebar-menu-con" :style="{ width: shrink ? '60px' : '200px', overflow: shrink ? 'visible' : 'auto'}">
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
          <img v-show="shrink" key="min-logo" src="~assets/images/logo-min.png" />
        </div>
      </shrinkable-menu>
    </div>
    <div
      class="main-header-con"
      :style="{ paddingLeft: shrink ? '60px' : '200px' }"
    >
      <div class="main-header">
        <div class="navicon-con">
          <Button :style="{transform: 'rotateZ(' + (shrink ? '-90' : '0') + 'deg)', padding: '5px 10px 6px', marginTop: '2px'}" type="text" @click="toggleClick">
            <Icon type="md-menu" size="24" />
          </Button>
        </div>
        <div class="header-middle-con">
          <div class="main-breadcrumb">
            <breadcrumb-nav :current-path="currentPath"></breadcrumb-nav>
          </div>
        </div>
        <div class="header-avator-con">
          <div class="full-screen-btn-con" @click="handleRefresh">
            <Tooltip content="刷新" placement="bottom">
              <Icon type="md-refresh" :size="23" />
            </Tooltip>
          </div>
          <full-screen v-model="isFullScreen" @on-change="fullscreenChange"></full-screen>
          <!-- <lock-screen></lock-screen>
          <message-tip v-model="mesCount"></message-tip> -->
          <div class="user-dropdown-menu-con">
            <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
              <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
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
              <Avatar :src="avatorPath" style="background: #619fe7;margin-left: 10px;"></Avatar>
            </Row>
          </div>
        </div>
      </div>
      <div class="tags-con">
        <!-- <tags-page-opened :page-tags-list="pageTagsList"></tags-page-opened> -->
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
import shrinkableMenu from '~/components/shrinkable-menu/shrinkable-menu.vue'
// import tagsPageOpened from '~/components/tags-page-opened.vue'
import breadcrumbNav from '~/components/breadcrumb-nav.vue'
import fullScreen from '~/components/full-screen.vue'
// import lockScreen from '~/components/lockscreen/lockscreen.vue'
// import messageTip from '~/components/message-tip.vue'
export default {
  middleware: 'auth',
  components: {
    shrinkableMenu,
    // tagsPageOpened,
    breadcrumbNav,
    fullScreen
    // lockScreen,
    // messageTip
  },
  head() {
    return {
      title: '防伪码系统'
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
      userInfo:{}
    }
  },
  computed: {
    pageTagsList() {
      // return this.$store.state.app.pageOpenedList // 打开的页面的页面对象
      return []
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
    }
  },
  mounted() {
    // this.menuList = router
    // console.log(this.$router.options.routes, router)
    // this.$nextTick(() => {
    //   this.$nuxt.$loading.start()
    //   setTimeout(() => this.$nuxt.$loading.finish(), 600)
    // })
    let powerEnum = {
      'FD-0001': '超级管理员',
      'FD-7724': '李时达',
      'FD-13059': '谢绮玲',
      'FD-11271': '李锐钊',
      'FD-2202': '吴马红',
      'FD-17494': '刘金梁',
    }
    let storeEnum = {
      'FD-16349': '周一娜',
      'FD-14775': '陈家茵',
      'FD-16751': '罗鑫妍',
      'FD-12492': '黄小亮'
    }
    if (ENV === 'production') {
      delete powerEnum['FD-0001']
    }

    this.wmStyle()
    this.$API.getUserInfo()
      .then((res) => {
        if (res.code === 0) {
          if (powerEnum[res.data.username]) {
            // powerEnum超级管理组 包含在里面 显示全部路由
            this.menuList = router
          } else {
            let resultGroup
            if (storeEnum[res.data.username]) {
              // storeEnum组  只显示渠道和店铺设置
              resultGroup = router.filter(item => item.name === '/inquire-anomaly-tracking')
              resultGroup.forEach((items, index) => {
                items.children = items.children.filter(item => item.path === 'inquire-anomaly-tracking/channel-store-settings')
              })
            } else {
              // 不包含在里面  只显示防伪码查询
              resultGroup = router.filter(item => item.name === '/security-code')
              resultGroup.forEach((items, index) => {
                items.children = items.children.filter(item => item.path === 'security-code/search-code')
              })
            }
            this.menuList = resultGroup
          }
        }
        window.localStorage.setItem('userInfo', JSON.stringify(res.data))
        this.userInfo = res.data;
      })
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
          name: 'ownspace_index'
        })
      } else if (name === 'loginout') {
        // 退出登录
        this.$store.commit('logout', this)
        this.$store.commit('clearOpenedSubmenu')
        Cookies.remove('authorization')
        this.$router.push({
          name: 'login'
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
        background-image: url('${this.canvasWM({content})}')
        }
        .ivu-card {
        background-image: url('${this.canvasWM({
        content,
        fillStyle: '#e8e8e8'
      })}')
        }
        .ivu-modal-body::before {
        background-image: url('${this.canvasWM({
        content,
        fillStyle: '#e8e8e8'
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
               font = "12px microsoft yahei",
               fillStyle = '#d6d7da',
               content = '请勿外传',
               rotate = '-10',
               zIndex = 1000
             } = {}) {
      let canvas = document.createElement('canvas');

      canvas.setAttribute('width', width);
      canvas.setAttribute('height', height);
      let ctx = canvas.getContext("2d");

      ctx.textAlign = textAlign;
      ctx.textBaseline = textBaseline;
      ctx.font = font;
      ctx.fillStyle = fillStyle;
      ctx.rotate(Math.PI / 180 * rotate);
      ctx.fillText(content, parseFloat(width) / 2, parseFloat(height) / 2);

      let base64Url = canvas.toDataURL();
      return base64Url
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
