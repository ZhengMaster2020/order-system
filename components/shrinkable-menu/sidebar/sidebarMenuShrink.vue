<template>
  <div>
    <template v-for="(item, index) in menuList">
      <div :key="index" style="text-align: center;">
        <Dropdown
          v-if="item.children.length !== 1"
          :key="index"
          transfer
          placement="right-start"
          @on-click="changeMenu"
        >
          <Button type="text" class="fd-btn">
            <Icon :size="20" :type="item.icon"></Icon>
          </Button>
          <DropdownMenu slot="list" style="width: 200px;">
            <template v-for="(child, i) in item.children">
              <DropdownItem :key="i" :name="child.name">
                <Icon :type="child.icon"></Icon>
                <span style="padding-left:10px;">{{ itemTitle(child) }}</span>
              </DropdownItem>
            </template>
          </DropdownMenu>
        </Dropdown>
        <Dropdown
          v-else
          :key="index"
          transfer
          placement="right-start"
          @on-click="changeMenu"
        >
          <Button type="text" class="fd-btn" @click="changeMenu(item.children[0].name)">
            <Icon :size="20" :type="item.children[0].icon || item.icon"></Icon>
          </Button>
          <DropdownMenu slot="list" style="width: 200px;">
            <DropdownItem :key="'d' + index" :name="item.children[0].name">
              <Icon :type="item.children[0].icon || item.icon"></Icon>
              <span style="padding-left:10px;">{{ itemTitle(item.children[0]) }}</span>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </template>
  </div>
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
    iconColor: {
      type: String,
      default: 'white'
    },
    menuTheme: {
      type: String,
      default: 'darck'
    }
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
    }
  }
}
</script>

<style lang="less">
.fd-btn {
    width: 70px;margin-left: -5px;padding:10px 0;
}
</style>
