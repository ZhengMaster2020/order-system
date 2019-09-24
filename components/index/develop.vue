<template>
  <Card :bordered="false">
    <p slot="title">
      待开发
    </p>
    <div class="panelContent"></div>
  </Card>
</template>

<script>
// import util from '@/libs/util.js'
export default {
  name: 'Develop',
  props: {},
  methods: {}
}
</script>

<style lang="less" scoped>
.panelContent{
  height: 100%;
  background: url(https://oa.fandow.com/public/themes/default/images/panel/develop.jpg) center center / cover no-repeat rgb(247, 247, 249);
}
</style>
