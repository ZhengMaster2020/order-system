<template>
  <div class="code-management">
    <Row class="search-form">
      <Col :sm="24">
        <Form ref="searchData" :model="searchData" class="searchData">
          <FormItem>
            <Input v-model="searchData.securityCode" placeholder="防伪码" clearable @on-enter="getList('search')"></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" icon="ios-search" @click="getList('search')">查询</Button>
          </FormItem>
        </Form>
      </Col>
    </Row>
    <Row class="margin-top-10">
      <Table :columns="listData.columns" :data="listData.data" size="small" border @on-selection-change="selectCheck" highlight-row :loading="listData.loading">
        <!-- 操作 -->
        <template slot-scope="{ row }" slot="action">
          <Poptip confirm title="您确认删除这条内容吗？" @on-ok="handleDelete(row.id)" transfer>
            <Button size="small">重新下载表格</Button>  
          </Poptip>
        </template>
      </Table>
      <div style="margin: 10px;overflow: hidden">
        <div class="pages-L">共 {{pageProps.totalCount}} 条</div>
        <div style="float: right;">
          <Page size="small" :total="pageProps.totalCount" :current="pageProps.page" show-sizer show-elevator @on-change="changePage" @on-page-size-change="changePageSize"></Page>
        </div>
      </div>
    </Row>
  </div>  
</template>
<script>
  export default {
    data () {
      return {
        searchData: {
          securityCode: ''
        },
        listData: {
          columns: [
            {type: 'selection', width: 60, align: 'center'},
            {key: 'index', type: 'index', title: '序号', width: 65, align: 'center'},
            {key: 'serialCode', title: '序列号', minWidth: 100, align: 'center'},
            {key: 'securityCode', title: '防伪码', minWidth: 120, align: 'center'},
            {key: 'securityCodeLink', title: '链接', minWidth: 100, align: 'center'},
            {key: 'brand', title: '品牌', minWidth: 100, align: 'center'},
            {key: 'wechatNickname', title: '用户昵称', minWidth: 100, align: 'center'},
            {key: 'purchaseChannels', title: '购买渠道', minWidth: 100, align: 'center'},
            {key: 'createdAt', title: '查询时间', minWidth: 100, align: 'center'}
          ],
          data: []
        },
        pageProps: { // 列表分页属性
          page: 1,
          perPage: 10,
          currentPage: 1,
          totalCount: 0
        }
      }
    },
    mounted() {
      this.getList()
    },
    methods:{
      selectCheck () {},
      changePage (e) {
        this.pageProps.page = e
        this.getList();
      },
      changePageSize (e) {
        this.pageProps.perPage = e
        this.getList();
      },
      // 查询数据
      getList () {
        let params = this.searchData
        params.page = this.pageProps.page
        params.perPage = this.pageProps.perPage
        this.$API.securityCodeQuery(params).then((res) => {
          //console.log(res)
          if(res.code === 0){
            this.listData.data = res.data.list
            this.pageProps.totalCount = res.data.count
          }
        })
        this.pageProps.page = 1
        this.pageProps.perPage = 10
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
