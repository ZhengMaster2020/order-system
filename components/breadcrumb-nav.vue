<template>
  <Breadcrumb>
    <BreadcrumbItem
      v-for="item in currentPath"
      :key="item.name"
      :to="item.path"
    >
      {{ item.name }}
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
  methods: {}
}
</script>
