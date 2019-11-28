<template>
  <Breadcrumb>
    <BreadcrumbItem
      v-for="item in currentPath"
      :key="item.name"
      :to="item.path"
    >
      {{ itemTitle(item) }}
    </BreadcrumbItem>
  </Breadcrumb>
</template>

<script>
export default {
  props: {
    currentPath: {
      type: Array,
      default: function () { return [] }
    }
  },
  methods: {
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
