<template>
  <div>
    <Card>
      <!--      Form-->
      <Form ref="searchForm" :model="searchForm" inline>
        <Row type="flex" justify="space-between">
          <Col>
            <FormItem>
              <Input v-model="searchForm.createdBy" placeholder="申请人" class="width-120"/>
            </FormItem>
            <FormItem>
              <Select clearable placeholder="状态" class="width-120" v-model="searchForm.status">
                <Option value="enable">启用</Option>
                <Option value="disable">停用</Option>
              </Select>
            </FormItem>
          </Col>
          <Col>
            <FormItem>
              <Button type="primary" @click="getList">搜索</Button>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem>
              <Button type="primary" @click="addPlan">新增</Button>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="enAbleSetting">启用/停用</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>

      <!--          Table-->
      <Table border
             :columns="columns"
             :data="data"
             :loading="tableLoading"
             @on-selection-change="selection => { selectionChange(selection) }">
        <template slot="action" slot-scope="{row, index}">
          <Button type="primary" size="small" @click="edit(row)" >
            <Icon type="md-create"/>
          </Button>
        </template>


      </Table>

      <!--          Page-->
      <div class="foot-page">
        共{{pageProps.total}}条
        <Page transfer
              :total="pageProps.total"
              :page-size="pageProps.perPage"
              size="small"
              show-elevator
              show-sizer
              @on-change="(page) => { changePage(page) }"
              @on-page-size-change="(size) => { changePageSize(size) }"/>
      </div>

    </Card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tableLoading: false,
        selection: [],
        searchForm: {
          status: '',
          createdBy: '',
        },
        columns: [
          {type: 'selection', width: 60, align: 'center'},
          {title: '排序', key: 'sort', width: 70, align: 'center'},
          {title: '问题', key: 'problem', align: 'center'},
          {title: '解答', key: 'answer', align: 'center'},
          {title: '状态', key: 'status', width: 70, align: 'center',
            render: (h, {row}) => h('span', {}, row.status === 'disable' ? '禁用' : '启用')
          },
          {title: '创建人', key: 'createdBy', width: 110, align: 'center'},
          {title: '时间', key: 'createdAt', width: 110, align: 'center',
            render: (h, {row}) => h('span', {}, this.$format(row.createdAt, 'yyyy-MM-dd hh:mm:ss'))
          },
          {title: '修改', key: 'action', width: 70, align: 'center', slot: 'action'}
        ],
        data: [],
        selection: [],
        pageProps: {
          page: 1,
          total: 0,
          perPage: 10
        },
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      // Form 操作
      addPlan() {
        this.$router.push('/inquire-anomaly-tracking/FQA-add')
      },
      edit(row) {
        this.$router.push({
          path: '/inquire-anomaly-tracking/FQA-add',
          query: {
            id: row.id
          }
        })
      },
      enAbleSetting() {
        let selection = this.selection
        if(selection.length > 1) return this.$Message.warning('一次只能操作一条数据')
        if(selection.length < 1) return this.$Message.warning('请选择')

        this.$API.statusChangeFQA({
          id: selection[0].id,
          status: selection[0].status === 'disable' ? 'enable' : 'disable'
        }).then(res => {
          if(res.code === 0) {
            this.$Message.success('更新成功')
            this.getList()
          }
        })
      },
      // table 选项操作
      selectionChange(selection) {
        this.selection = selection
      },
      // 改变当前分页
      changePage(page) {
        this.pageProps.page = page;
        this.getList();
      },
      // 改变分页size
      changePageSize(pageSize) {
        this.pageProps.perPage = pageSize;
        this.getList();
      },

      getList() {
        let params = {}
        for (let key in this.searchForm) {
          !!this.searchForm[key] && (params[key] = this.searchForm[key])
        }
        params.page = this.pageProps.page
        params.perPage = this.pageProps.perPage
        // return console.log(params)
        this.$API.getFQAlist(params).then(res => {
          if (res.code === 0) {
            let {count, list, page} = res.data
            this.data = list
            this.pageProps.page = page
            this.pageProps.total = count
          }
        }).finally(() => {
          this.tableLoading = false
        })
      }
    }
  }
</script>

<style scoped>
  .width-120 {
    width: 120px;
  }

  .foot-page {
    padding: 10px;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  /deep/ .ivu-table-header th .ivu-table-cell.ivu-table-cell-with-selection {
    display: none;
  }
</style>