<template>
  <div :style="{ background: bgColor }" class="ivu-shrinkable-menu">
    <slot name="top"></slot>
    <sidebar-menu
      v-show="!shrink"
      :menu-theme="theme"
      :menu-list="menuList"
      :open-names="openNames"
      @on-change="handleChange"
    ></sidebar-menu>
    <sidebar-menu-shrink
      v-show="shrink"
      :menu-theme="theme"
      :menu-list="menuList"
      :icon-color="shrinkIconColor"
      @on-change="handleChange"
    ></sidebar-menu-shrink>
  </div>
</template>

<script>
import sidebarMenu from '~/components/shrinkable-menu/sidebar/sidebarMenu.vue'
import sidebarMenuShrink from '~/components/shrinkable-menu/sidebar/sidebarMenuShrink.vue'
export default {
  components: {
    sidebarMenu,
    sidebarMenuShrink
  },
  props: {
    shrink: {
      type: Boolean,
      default: false
    },
    menuList: {
      type: Array,
      required: true
    },
    theme: {
      type: String,
      default: 'dark'
    },
    beforePush: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    openNames: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    bgColor() {
      return this.theme === 'dark' ? '#495060' : '#fff'
    },
    shrinkIconColor() {
      return this.theme === 'dark' ? '#fff' : '#495060'
    }
  },
  methods: {
    handleChange(name) {
      // let willpush = true
      // if (this.beforePush !== undefined) {
      //   if (!this.beforePush(name)) {
      //     willpush = false
      //   }
      // }
      // if (willpush) {
      this.$router.push({
        name: name
      })
      // }
      this.$emit('on-change', name)
    }
  }
}
</script>
