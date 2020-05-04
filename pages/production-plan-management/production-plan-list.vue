<template>
  <div>
    <Card>
<!--      Form-->
      <Form ref="searchForm" :model="searchForm" :rules="ruleInline" inline>
       <Row type="flex" justify="space-between">
         <Col>
           <FormItem prop="name">
             <Input v-model="searchForm.createdBy" placeholder="申请人" class="width-120" />
           </FormItem>
           <FormItem prop="name">
             <Input v-model="searchForm.planNumber" placeholder="计划编号" class="width-120" />
           </FormItem>
           <FormItem prop="name">
             <Input v-model="searchForm.brand" placeholder="品牌" class="width-120" />
           </FormItem>
           <FormItem prop="name">
             <Input v-model="searchForm.planStatus" placeholder="计划状态" class="width-120" />
           </FormItem>
           <FormItem prop="name">
             <Input v-model="searchForm.planName" placeholder="计划名称" class="width-120" />
           </FormItem>
           <FormItem prop="user">
             <Select clearable placeholder="是否补Q计划" class="width-120">
               <Option value="yes">是</Option>
               <Option value="no">否</Option>
             </Select>
           </FormItem>
         </Col>
         <Col>
           <FormItem>
             <Button type="primary">搜索</Button>
           </FormItem>
         </Col>
       </Row>
        <Row>
          <Col>
            <FormItem>
              <Button type="primary" @click="addPlan">添加计划</Button>
            </FormItem>
            <FormItem>
              <Button type="primary">经理审核</Button>
            </FormItem>
            <FormItem>
              <Button type="primary">执行计划</Button>
            </FormItem>
            <FormItem>
              <Button type="primary">执行完毕</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>

<!--      Tabs-->
      <Tabs v-model="currentTab">
        <TabPane label="计划列表" name="planList">
<!--          Table-->
          <Table border :columns="planList.columns" :data="planList.data"
                 @on-selection-change="selection => { selectionChange(selection) }"
                 :loading="tableLoading">
            <template slot-scope="{ row, index }" slot="action">
              <Tooltip placement="top" content="编辑" transfer>
                <Button type="primary" size="small" >
                  <Icon type="md-create" />
                </Button>
              </Tooltip>
              <Poptip confirm title="您确认删除这条内容吗？" transfer>
                <Button size="small">
                  <Icon type="md-trash" />
                </Button>
              </Poptip>
            </template>
          </Table>
<!--          Page-->
          <div class="foot-page">
            共{{planList.pageProps.total}}条
            <Page transfer
                  :total="planList.pageProps.total"
                  :page-size="planList.pageProps.perPage"
                  size="small"
                  show-elevator
                  show-sizer
                  @on-change="(page) => { changePage(page, 'planList') }"
                  @on-page-size-change="(size) => { changePageSize(size, 'planList') }" />
          </div>
        </TabPane>
      </Tabs>
    </Card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        currentTab: 'planList',
        tableLoading: false,
        searchForm: {
          createdBy: '',
          planNumber: '',
          brand: '',
          planStatus: '',
          planName: '',
          isFillPlan: '',
        },
        planList: {
          columns: [
            { type: 'selection', width: 60, align: 'center' },
            { title: '序号', type: 'index', width: 70, align: 'center' },
            { title: '计划名称', key: 'planName', align: 'center' },
            { title: '计划状态', key: 'planStatus', align: 'center' },
            { title: '季度', key: 'quarter', align: 'center' },
            { title: '计划编号', key: 'planNumber', align: 'center' },
            { title: '是否补Q计划', key: 'isFillPlan', align: 'center' },
            { title: '品牌', key: 'brand', align: 'center' },
            { title: '计划数量', key: 'generationCount', align: 'center' },
            { title: '实际执行量', key: 'realNum', align: 'center' },
            { title: '创建时间', key: 'createdAt', align: 'center' },
            { title: '申请人', key: 'createdBy', align: 'center' },
            { title: '备注', key: 'remark', align: 'center' },
            { title: '操作', key: 'action', align: 'center', slot: 'action', width: 130 },
          ],
          data: [],
          selection: [],
          pageProps: {
            page: 1,
            total: 0,
            perPage:  10
          },
        }
      }
    },
    created() {
      this.getPlanlist()
    },
    methods: {
      // Form 操作
      addPlan() {
        if(this.planList.selection.length > 1) return this.$Message.error('一次只能操作一条数据')
      },
      // table 选项操作
      selectionChange(selection) {
        this.planList.selection = selection
      },
      // 改变当前分页
      changePage (page, key) {
        this[key].page = page;
        // this.getList();
      },
      // 改变分页size
      changePageSize (pageSize, key) {
        this[key].perPage = pageSize;
        // this.getList();
      },
      // 拼接参数
      spliceParams(currentTab, form){
        let { page, perPage } = this[currentTab].pageProps
        let params = {}
        for(let key in form) {
          if(form[key]){
            params[key] = form[key]
          }
        }
        params.page = page
        params.perPage = perPage
        return params
      },
      // 接口
      getPlanlist() {
        let currentTab = this.currentTab
        let params = this.spliceParams(currentTab, this.searchForm)
        this.$API.getProductionPlan(params).then(res => {
          if(res.code === 0){
            let { list, count, page, perPage } = res.data
            this[currentTab].data = list
            this[currentTab].pageProps.page = page
            this[currentTab].pageProps.perPage = perPage
            this[currentTab].pageProps.total = count
          }
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
</style>