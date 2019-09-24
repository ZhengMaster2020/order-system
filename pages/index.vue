<template>
  <div class="pageContent">
    首页
  </div>
</template>

<script>
export default {
  components: {
  },
  data() {
    return {}
  },
  asyncData({ $axios }) {
    return { project: 'nuxt' }
  },
  mounted() {},
  methods: {
    test() {
      this.$API.test().then((res) => {
        console.log(res)
      })
    }
  }
}
</script>

<style lang="less">
.pageContent {
  padding: 0 235px 15px 15px;
  box-sizing: border-box;
  display: block;
  position: relative;
  overflow: hidden;
  .panel {
    width: 100%;
    margin: 0 0 15px;
    float: left;
    clear: none;
    background: #fff;
  }
  .check-work-attendance {
    width: 360px;
    height: 334px;
    .ivu-card-body {
      padding: 5px;
    }
  }
  .waiting-for-trialwidth {
    width: calc(100% - 375px);
    height: 334px;
    margin-left: 15px;
    .ivu-card-body {
      padding: 8px;
    }
  }
  .develop {
    height: 280px;
    .ivu-card-body{
      padding: 0;
    }
  }
  .notice-announcement {
    height: 844px;
    width: 220px;
    height: 100%;
    background: #ebebed;
    position: absolute;
    top: 0;
    right: 0;
    margin: 0;
  }
  .ivu-card {
    height: 100%;
    .ivu-card-head {
      display: block;
      height: 28px;
      padding: 0 !important;
      padding-left: 5px !important;
      background: #fff;
      border-bottom: 1px solid #e7eaec;
      border-left: 2px solid #96bcd4;
      p {
        display: block;
        overflow: hidden;
        height: 28px;
        padding: 0 5px;
        line-height: 28px;
        font-weight: 500;
        font-size: 12px;
      }
    }
    .ivu-card-body {
      overflow: auto;
      height: calc(100% - 28px);
    }
  }
}
@media screen and (max-width: 1100px) {
  .check-work-attendance {
    width: 100% !important;
  }
  .waiting-for-trialwidth {
    width: 100% !important;
    margin-left: 0!important;
  }
}
@media screen and (max-width: 835px) {
  .pageContent {
    padding: 0 0 15px 15px;
    .notice-announcement {
      width: 100%;
      position: relative;
      top: 0;
      left: 0;
      height: 844px;
    }
  }
}
</style>
