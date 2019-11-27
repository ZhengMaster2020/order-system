<template>
  <div class="code-management">
    <Row class="search-form">
      <Col :md="12">
        <Input v-model="searchData.securityCode" placeholder="箱码" style="width:150px" clearable @on-enter="getList('search')"/>
        <Input v-model="searchData.securityCode" placeholder="订单编号" style="width:150px" clearable @on-enter="getList('search')"/>
        <Button type="primary" icon="ios-search" @click="getList('search')">查询</Button>
      </Col>
    </Row>
    <Row class="margin-top-10">
      <Table :columns="listData.columns" :data="listData.data" size="small" border highlight-row :loading="listData.loading"></Table>
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
        searchData: {
          securityCode: '',
          type: ''
        },
        listData: {
          columns: [
            {key: 'index', type: 'index', title: '序号', maxWidth: 120, align: 'center'},
            {key: 'securityCode', title: '箱码', align: 'center'},
            {
              key: 'serialCode',
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
                        this.$router.push({path: 'product-code-query'})
                      }
                    
                  }
                }, '12')
              }
            },
            {key: 'securityCode', title: '订单编号', align: 'center'},
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
                      icon: 'md-search'
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
          data: [{serialCode: 'sd'}]
        },
        logisticsData: {
          modal: false,
          columns: [
            {key: 'time', title: '日期', maxWidth: 100, align: 'center'},
            {key: 'securityCode', title: '类型', maxWidth: 80,align: 'center'},
            {key: 'securityCode', title: '内容', align: 'center'}
          ],
          data: [{time: '2019-10-20', securityCode: '发货'}]
        },
        pageProps: { // 列表分页属性
          page: 1,
          perPage: 10,
          totalCount: 0
        }
      }
    },
    mounted() {
      //this.getList()
    },
    methods:{
      changePage (e) {
        this.pageProps.page = e
        //this.getList();
      },
      changePageSize (e) {
        this.pageProps.perPage = e
        //this.getList();
      },
      // 查询数据
      getList () {
        let params = this.searchData
        params.page = this.pageProps.page
        params.perPage = this.pageProps.perPage
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
