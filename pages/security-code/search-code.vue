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
          <Page size="small" :total="pageProps.totalCount" :current="pageProps.currentPage" show-sizer show-elevator @on-change="changePage" @on-page-size-change="changePageSize"></Page>
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
            {key: 'created_by', title: '序列号', minWidth: 100, sortable: true, align: 'center'},
            {key: 'batch_no', title: '防伪码', minWidth: 120, sortable: true, align: 'center'},
            {key: 'link', title: '链接', minWidth: 100, sortable: true, align: 'center'},
            {key: 'pinpai', title: '品牌', minWidth: 100, sortable: true, align: 'center'},
            {key: 'name', title: '用户昵称', minWidth: 100, sortable: true, align: 'center'},
            {key: 'way', title: '购买渠道', minWidth: 100, sortable: true, align: 'center'},
            {key: 'time', title: '查询时间', minWidth: 100, sortable: true, align: 'center'}
          ],
          data: [
            {
              created_by: 'John Brown',
              batch_no: 18,
              link: 'New York No. 1 Lake Park',
              pinpai: 'America',
              name: 'America',
              way: 'America',
              time: 'America',
            }
          ]
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
        // this.getList();
      },
      changePageSize (e) {
        this.pageProps.perPage = e
        // this.getList();
      },
      // 查询数据
      getList () {
        let params = this.searchData
        // this.$API.securityCodeQuery.then((res) => {})
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
