<template>
  <Menu
    ref="sideMenu"
    :active-name="$route.name"
    :open-names="openNames"
    :theme="menuTheme"
    width="auto"
    @on-select="changeMenu"
  >
    <template v-for="(item, index) in menuList">
      <Submenu :key="'children' + index" :name="item.name">
        <template slot="title">
          <Icon :type="item.icon" :size="iconSize"></Icon>
          <span class="layout-text">{{ itemTitle(item) }}</span>
        </template>
        <template v-for="(childMenu, childIndex) in item.children">
          <MenuItem v-if="hasThirdLevelMenu(childMenu) === false" :key="'menuitemd' + childIndex" :name="childMenu.name">
            <Icon :key="'icon' + childMenu.name" :type="childMenu.icon" :size="iconSize"></Icon>
            <span :key="'title' + childMenu.name" class="layout-text">{{ itemTitle(childMenu) }}</span>
          </MenuItem>
          <Submenu
            v-if="hasThirdLevelMenu(childMenu) === true"
            :key="'menuitem' + childMenu.name"
            :name="childMenu.name"
          >
            <template slot="title">
              <Icon :key="'icon' + childMenu.name" :type="childMenu.icon" :size="iconSize"></Icon>
              <span :key="'title' + childMenu.name" class="layout-text">{{ itemTitle(childMenu) }}</span>
            </template>
            <template v-for="(child, thirdChildIndex) in childMenu.children">
              <MenuItem
                v-if="child.name"
                :key="'menuitem' + thirdChildIndex"
                :name="child.name"
              >
                <Icon :key="'icon' + child.name" :type="child.icon" :size="iconSize"></Icon>
                <span :key="'title' + child.name" class="layout-text">{{ itemTitle(child) }}</span>
              </MenuItem>
              <template v-for="(son, sonIndex) in child.children">
                <MenuItem :key="'menuitem' + sonIndex" :name="son.name">
                  <Icon :key="'icon' + son.name" :type="son.icon" :size="iconSize"></Icon>
                  <span :key="'title' + son.name" class="layout-text">{{ itemTitle(son) }}</span>
                </MenuItem>
              </template>
            </template>
          </Submenu>
        </template>
      </Submenu>
    </template>
  </Menu>
</template>

<script>
export default {
  props: {
    menuList: {
      type: Array,
      default: () => {
        return []
      }
    },
    menuTheme: {
      type: String,
      default: 'dark'
    },
    openNames: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      iconSize: 20
    }
  },
  updated() {
    this.$nextTick(() => {
      if (this.$refs.sideMenu) {
        this.$refs.sideMenu.updateOpened()
      }
    })
  },
  methods: {
    changeMenu(active) {
      this.$emit('on-change', active)
    },
    itemTitle(item) {
      if (typeof item.title === 'object') {
        // return this.$t(item.title.i18n);
        return '首页'
      } else {
        return item.title
      }
    },
    hasThirdLevelMenu(child) {
      if (child.children) {
        if (child.children.length > 0) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    }
  }
}
</script>
