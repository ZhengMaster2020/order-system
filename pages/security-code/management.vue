<template>
  <div class="code-management">
    <Row slot="title" class="count">
        <Col span="2" order="4">
          <p>123456</p>
          <p>生成总数</p>
        </Col>
        <Col span="2" order="4">
          <p>1242</p>
          <p>最近生成数量</p>
        </Col>
    </Row>
    <Row class="search-form">
      <Col :sm="24">
        <Form ref="searchData" :model="searchData" class="searchData">
          <FormItem label="生成日期" :label-width="80">
            <DatePicker v-model="searchData.startTime" type="date" placeholder="Select date" style="width: 200px"></DatePicker>
          </FormItem>
          <FormItem>
            <span>-</span>
          </FormItem>
          <FormItem>
            <DatePicker v-model="searchData.endTime" type="date" placeholder="Select date" style="width: 200px"></DatePicker>
          </FormItem> 
          <FormItem>
            <Input v-model="searchData.brand" placeholder="品牌" clearable @on-enter="getList('searchData')"></Input>
          </FormItem>
          <FormItem>
            <Input v-model="searchData.userName" placeholder="操作人员" clearable @on-enter="getList('searchData')"></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" icon="ios-search" @click="getList('searchData')">查询</Button>
          </FormItem>
          <FormItem style="float:right">
            <Col span="12"><Button type="primary" icon="md-repeat" @click="generateCode">生成防伪码</Button></Col>
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

    <!-- 生成防伪码弹窗 -->
    <Modal
      v-model="generateStatus"
      title="生成防伪码">
      <Form ref="generateData" :model="generateData" :rules="generateRule" class="generateData">
        <FormItem label="品牌：" prop="price" :label-width="90">
          <Input v-model="generateData.brand" clearable @on-enter="getList('search')"></Input>
        </FormItem>
        <FormItem label="生成数量：" prop="mount" :label-width="90">
          <Input v-model="generateData.generationCount" clearable @on-enter="getList('search')"></Input>
        </FormItem>
      </Form>    
      <div slot="footer">
          <Button type="primary" :loading="generateLoading" @click="confirm">生成并下载</Button>
          <Button type="default" :loading="generateLoading" @click="cancel">取消</Button>
      </div>
    </Modal>
  </div>  
</template>
<script>
  export default {
    data () {
      return {
        generateStatus: false,
        generateLoading: false,
        generateData: {
          brand: '',
          generationCount: ''
        },
        generateRule: {
          brand: [
            { required: true, message: 'The name cannot be empty', trigger: 'blur' }
          ],
          generationCount: [
            { required: true, message: 'The name cannot be empty', trigger: 'blur' }
          ]
        },
        searchData: {
          startTime: '',
          endTime: '',
          brand: '',
          userName: ''
        },
        rulesForm: {},
        listData: {
          columns: [
            {type: 'selection', width: 60, align: 'center'},
            {key: 'index', type: 'index', title: '序号', width: 65, align: 'center'},
            {key: 'brand', title: '品牌', minWidth: 100, sortable: true, align: 'center'},
            {key: 'generationCount', title: '生成数量', minWidth: 120, sortable: true, align: 'center'},
            {key: 'createdAt', title: '生成日期', minWidth: 100, sortable: true, align: 'center'},
            {key: 'userName', title: '操作人员', minWidth: 100, sortable: true, align: 'center'},
            { key: 'action', title: '操作', width: 150, align: 'center', slot: 'action' }
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
      // 生成防伪码
      generateCode () {
        this.generateStatus = true
      },
      // 確定生成
      confirm () {
        let params = this.generateData
        this.$API.securityCodeCreate(params).then((res) => {
          console.log(res)
          this.$Message.info('生成成功')
          this.generateStatus = false
          this.getList()
        })
      },
      selectCheck () {},
      changePage (e) {
        this.pageProps.page = e
        this.getList();
      },
      changePageSize (e) {
        this.pageProps.perPage = e
        this.getList();
      },
      // 取消生成
      cancel () {
        this.generateStatus = false
      },

      // 查询数据
      getList () {
        let params = this.searchData
        params.page = this.pageProps.page
        params.perPage = this.pageProps.perPage
        this.$API.securityCodeList(params).then((res) => {
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
