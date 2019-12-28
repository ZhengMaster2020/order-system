<template>
  <div class="code-management">
    <Row class="search-form">
      <Col :md="12">
        <Input v-model="searchData.boxCode" placeholder="箱码" style="width:150px" clearable @on-enter="getList('search')"/>
        <Input v-model="searchData.orderNumber" placeholder="订单编号" style="width:150px" clearable @on-enter="getList('search')"/>
        <Button type="primary" icon="ios-search" @click="getList('search')">查询</Button>
      </Col>
    </Row>
    <Row class="margin-top-10">
      <Table :columns="listData.columns" :data="listData.data" size="small" border highlight-row :loading="loadingTable"></Table>
      <div style="margin: 10px;overflow: hidden">
        <div class="pages-L">共 {{pageProps.totalCount}} 条</div>
        <div style="float: right;">
          <Page size="small" :total="pageProps.totalCount" :current="pageProps.page" show-sizer show-elevator @on-change="changePage" @on-page-size-change="changePageSize"></Page>
        </div>
      </div>
    </Row>
    <!-- 物流信息弹窗 -->
    <Modal
      v-model="logisticsData.modal"
      title="物流信息"
      width="900"
      :styles="{top: '50%',marginTop: '-300px'}"
    >
      <div style="height: 350px;overflowY: scroll;padding: 0 10px">
        <Table :columns="logisticsData.columns" :data="logisticsData.data"></Table>
      </div>   
      <div slot="footer">
        <Button type="primary" @click="logisticsData.modal=false" >确定</Button>
        <Button type="default" @click="logisticsData.modal=false">取消</Button>
      </div>
    </Modal>
  </div>  
</template>
<script>
  export default {
    data () {
      return {
        loadingTable: false,
        searchData: {
          orderNumber: '',
          boxCode: ''
        },
        listData: {
          columns: [
            {key: 'index', type: 'index', title: '序号', maxWidth: 120, align: 'center'},
            {key: 'boxCode', title: '箱码', align: 'center'},
            {
              key: 'count',
              title: '关联产品（件）',
              align: 'center',
              render: (h, params) => {
                return h('div', {
                    style: {
                      color: '#5eb0e6',
                      cursor: 'pointer'
                    },
                    on: {
                      'click': () => {
                        //this.$router.push({path: 'product-code-query'})
                      }
                    
                  }
                }, params.row.count)
              }
            },
            {key: 'orderNumber', title: '订单编号', align: 'center'},
            {
              key: 'securityCodeLink',
              title: '物流信息',
              maxWidth: 200,
              align: 'center',
              render: (h, params) => {
                return h('Tooltip', {
                  props: {
                    content: '查看',
                    placement: 'top'
                  }
                }, [ h('Button', {
                    props: {
                      type: 'primary',
                      icon: 'md-search',
                      disabled: true
                    },
                    on: {
                      'click': () => {
                        this.logisticsData.modal = true
                      }
                    }
                  })
                ])
              }
            }
          ],
          data: []
        },
        logisticsData: {
          modal: false,
          columns: [
            {key: 'time', title: '日期', maxWidth: 100, align: 'center'},
            {key: 'securityCode', title: '类型', maxWidth: 80,align: 'center'},
            {key: 'securityCode', title: '内容', align: 'center'}
          ],
          data: []
        },
        pageProps: { // 列表分页属性
          page: 1,
          perPage: 10,
          totalCount: 0
        }
      }
    },
    mounted() {
      this.getList()
    },
    methods:{
      changePage (e) {
        this.pageProps.page = e
        this.getList();
      },
      changePageSize (e) {
        this.pageProps.perPage = e
        this.getList();
      },
      // 查询数据
      getList (type) {
        if(type == 'search'){
          this.pageProps.page = 1
          this.pageProps.perPage = 10
        }
        let params = this.searchData
        params.page = this.pageProps.page
        params.perPage = this.pageProps.perPage
        this.loadingTable = true
        this.$API.boxCodeList(params).then((res) => {
          if(res.code == 0){
            this.listData.data = res.data.data
            this.pageProps.totalCount = res.data.count
          }
        }).finally(() => {
          this.loadingTable = false
        })
      }
    }
  }
</script>

<style lang="less">
.code-management {
  .count {
    padding: 20px 0px 20px 30px;
    border: 2px solid #eee;
    border-radius: 10px;
  }
  .ivu-form-item {
    display: inline-block;
    margin-bottom: 0px;
  }
  .search-form {
    background-color: #eee;
    margin-top: 10px;
    padding: 10px 10px;
  }
}
</style>
