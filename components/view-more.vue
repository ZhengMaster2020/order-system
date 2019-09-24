<template>
  <div class="more">
    <slot></slot>
    <Button type="primary" icon="ios-search" @click="getList">
      查询
    </Button>
    <Button icon="md-repeat" @click="reset">
      重置
    </Button>
    <Button icon="md-repeat" @click="viewMore">
      筛选
    </Button>
  </div>
</template>

<script>
export default {
  props: {
    queryParmas: {
      type: Object,
      default: null
    }
  },
  watch: {
    queryParmas: {
      handler(newValue, oldValue) {
        console.log(newValue)
      },
      deep: true
    }
  },
  mounted() {
    console.log('123')
  },
  methods: {
    viewMore() {
      this.$emit('showStatus', true)
    },
    reset() {
      this.$emit('reset', 'search')
    },
    getList() {
      this.$emit('getList', 'search')
      console.log(this.queryParmas)
    }
    // getList () {
    //   let params = this.search
    //   params.page = this.pageProps.page
    //   params.perPage = this.pageProps.perPage
    //   for (let i in params) {
    //     if (!params[i]) delete params[i]
    //   }
    //   // tabs
    //   params.quality_type = this.tableTab
    //   this.listData.loading = true
    //   this.$api.abnormalQuality(params)
    //   .then(res => {
    //     this.listData.loading = false
    //     this.listData.data = res.items
    //     if (res._meta) {
    //         this.pageProps.totalCount = res._meta.totalCount
    //     }
    //   });
    // },
  }
}
</script>

<style>
.more {
  min-height: 30px;
  position: relative;
}
/* .line {
  width: 100%;
  border-top: 1px solid #e7eaec;
  position: absolute;
  top: 15px;
  left: 0;
  z-index: 1;
}
.view-more {
  width: 100px;
  cursor: pointer;
  background-color: #fff;
  text-align: center;
  position: absolute;
  left: 50%;
  margin-left: -50px;
  top: 5px;
  z-index: 99;
} */
</style>
