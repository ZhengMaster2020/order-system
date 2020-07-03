<template>
  <div
    ref="scrollCon"
    class="tags-outer-scroll-con"
    @DOMMouseScroll="handlescroll"
    @mousewheel="handlescroll"
  >
    <div class="close-all-tag-con">
      <Dropdown transfer @on-click="handleTagsOption">
        <Button type="text">
          <Icon type="ios-close-circle-outline" size="22" />
        </Button>
        <DropdownMenu slot="list">
          <DropdownItem name="clearAll">
            关闭所有
          </DropdownItem>
          <DropdownItem name="clearOthers">
            关闭其他
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
    <div
      ref="scrollBody"
      class="tags-inner-scroll-body"
      :style="{ left: tagBodyLeft + 'px' }"
    >
      <transition-group name="taglist-moving-animation">
        <Tag
          v-for="item in tagsList"
          ref="tagsPageOpened"
          :key="item.name"
          type="dot"
          :name="item.name"
          :closable="item.name === 'index' ? false : true"
          :color="
            item.children
              ? item.children[0].name === currentPageName
                ? 'primary'
                : 'default'
              : item.name === currentPageName
                ? 'primary'
                : 'default'
          "
          @on-close="closePage"
          @click.native="linkTo(item)">
          {{ itemTitle(item) }}
        </Tag>
      </transition-group>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    pageTagsList: Array,
    beforePush: {
      type: Function,
      default: (item) => {
        return true
      }
    }
  },
  data() {
    return {
      currentPageName: this.$route.name,
      tagBodyLeft: 0,
      refsTag: [],
      tagsCount: 1
    }
  },
  computed: {
    title() {
      return this.$store.state.app.currentTitle
    },
    tagsList() {
      return this.$store.state.app.pageOpenedList
    }
  },
  watch: {
    $route(to) {
      this.currentPageName = to.name
      this.$nextTick(() => {
        this.refsTag.forEach((item, index) => {
          if (to.name === item.name) {
            const tag = this.refsTag[index].$el
            this.moveToView(tag)
          }
        })
      })
      this.tagsCount = this.tagsList.length
    }
  },
  mounted() {
    this.refsTag = this.$refs.tagsPageOpened
    setTimeout(() => {
      this.refsTag.forEach((item, index) => {
        if (this.$route.name === item.name) {
          const tag = this.refsTag[index].$el
          this.moveToView(tag)
        }
      })
    }, 1) // 这里不设定时器就会有偏移bug
    this.tagsCount = this.tagsList.length
  },
  methods: {
    itemTitle(item) {
      if (typeof item.title === 'object') {
        // return this.$t(item.title.i18n);
        return '首页'
      } else {
        return item.title
      }
    },
    closePage(event, name) {
      let pageOpenedList = this.$store.state.app.pageOpenedList
      let lastPageObj = pageOpenedList[0]
      if (this.currentPageName === name) {
        const len = pageOpenedList.length
        for (let i = 1; i < len; i++) {
          if (pageOpenedList[i].name === name) {
            if (i < len - 1) {
              lastPageObj = pageOpenedList[i + 1]
            } else {
              lastPageObj = pageOpenedList[i - 1]
            }
            break
          }
        }
      } else {
        const tagWidth = event.target.parentNode.offsetWidth
        this.tagBodyLeft = Math.min(this.tagBodyLeft + tagWidth, 0)
      }
      this.$store.commit('app/closeTag', name)
      pageOpenedList = this.$store.state.app.pageOpenedList
      // localStorage.pageOpenedList = JSON.stringify(pageOpenedList)
      if (this.currentPageName === name) {
        this.linkTo(lastPageObj)
      }

      // 清空表单本地数据存储
      // if (localStorage[name]) {
      //   localStorage[name] = ''
      // }
    },
    linkTo(item) {
      const routerObj = {}
      routerObj.name = item.name
      if (item.argu) {
        routerObj.params = item.argu
      }
      if (item.query) {
        routerObj.query = item.query
      }
      if (this.beforePush(item)) {
        this.$router.push(routerObj)
      }
    },
    handlescroll(e) {
      const type = e.type
      let delta = 0
      if (type === 'DOMMouseScroll' || type === 'mousewheel') {
        delta = e.wheelDelta ? e.wheelDelta : -(e.detail || 0) * 40
      }
      let left = 0
      if (delta > 0) {
        left = Math.min(0, this.tagBodyLeft + delta)
      } else if (
        this.$refs.scrollCon.offsetWidth - 100 <
        this.$refs.scrollBody.offsetWidth
      ) {
        if (
          this.tagBodyLeft <
          -(
            this.$refs.scrollBody.offsetWidth -
            this.$refs.scrollCon.offsetWidth +
            100
          )
        ) {
          left = this.tagBodyLeft
        } else {
          left = Math.max(
            this.tagBodyLeft + delta,
            this.$refs.scrollCon.offsetWidth -
              this.$refs.scrollBody.offsetWidth -
              100
          )
        }
      } else {
        this.tagBodyLeft = 0
      }
      this.tagBodyLeft = left
    },
    handleTagsOption(type) {
      if (type === 'clearAll') {
        this.$store.commit('app/clearAllTags')
        this.$router.push({
          name: 'index'
        })
      } else {
        this.$store.commit('app/clearOtherTags', this.$route.name)
      }
      this.tagBodyLeft = 0
    },
    moveToView(tag) {
      if (tag.offsetLeft < -this.tagBodyLeft) {
        // 标签在可视区域左侧
        this.tagBodyLeft = -tag.offsetLeft + 10
      } else if (
        tag.offsetLeft + 10 > -this.tagBodyLeft &&
        tag.offsetLeft + tag.offsetWidth <
          -this.tagBodyLeft + this.$refs.scrollCon.offsetWidth - 100
      ) {
        // 标签在可视区域
        this.tagBodyLeft = Math.min(
          0,
          this.$refs.scrollCon.offsetWidth -
            100 -
            tag.offsetWidth -
            tag.offsetLeft -
            20
        )
      } else {
        // 标签在可视区域右侧
        this.tagBodyLeft = -(
          tag.offsetLeft -
          (this.$refs.scrollCon.offsetWidth - 100 - tag.offsetWidth) +
          20
        )
      }
    }
  }
}
</script>
<style lang="less" scoped>
  /deep/ .ivu-tag-text{
    cursor: default;
  }
</style>
