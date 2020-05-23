<template>
  <div>
    <Card>
      <!--      Form-->
      <Form ref="listSearchForm" :model="listSearchForm" inline>
        <Row type="flex" justify="space-between">
          <Col>
            <FormItem prop="name">
              <Input v-model="listSearchForm.name" placeholder="品牌" class="width-120" />
            </FormItem>
            <FormItem prop="name">
              <Input v-model="listSearchForm.name" placeholder="灌包订单号" class="width-120" />
            </FormItem>
            <FormItem prop="name">
              <Input v-model="listSearchForm.name" placeholder="慕可代码" class="width-120" />
            </FormItem>
            <FormItem prop="name">
              <Input v-model="listSearchForm.name" placeholder="产品名称" class="width-120" />
            </FormItem>
            <FormItem prop="name">
              <Input v-model="listSearchForm.name" placeholder="申请人" class="width-120" />
            </FormItem>
            <FormItem prop="name">
              <Input v-model="listSearchForm.name" placeholder="出库单号" class="width-120" />
            </FormItem>
            <FormItem prop="user">
              <Select clearable placeholder="是否补Q计划" class="width-120">
                <Option :value="1">是</Option>
                <Option :value="0">否</Option>
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
              <Button type="primary" @click="addPlan">导出数据</Button>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="addPlan">添加出库单</Button>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="addPlan">审核</Button>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="addPlan">打印出库</Button>
            </FormItem>
            <FormItem>
              <Button type="primary">手动出库</Button>
            </FormItem>
            <FormItem>
              <Button type="primary">完成出库</Button>
            </FormItem>
            <FormItem>
              <Button type="primary">修改</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>


      <!--      Tabs-->
      <Tabs v-model="currentTab">
        <TabPane label="出库申请单" name="planList">
          <!--          Table-->
          <Table border :columns="planList.columns" :data="planList.data" @on-selection-change="selection => { selectionChange(selection) }">
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
        listSearchForm: {
          name: ''
        },
        planList: {
          columns: [
            { type: 'selection', width: 60, align: 'center' },
            { title: '序号', type: 'index', width: 70, align: 'center' },
            { title: '计划名称', key: 'name', align: 'center' },
            { title: '计划状态', key: 'name', align: 'center' },
            { title: '季度', key: 'name', align: 'center' },
            { title: '计划编号', key: 'name', align: 'center' },
            { title: '是否补Q计划', key: 'name', align: 'center' },
            { title: '品牌', key: 'name', align: 'center' },
            { title: '计划数量', key: 'name', align: 'center' },
            { title: '实际执行量', key: 'name', align: 'center' },
            { title: '创建时间', key: 'name', align: 'center' },
            { title: '申请人', key: 'name', align: 'center' },
            { title: '备注', key: 'name', align: 'center' },
            { title: '操作', key: 'action', align: 'center', slot: 'action', width: 130 },
          ],
          data: [
            {
              name: 'John Brown',
              age: 18,
              address: 'New York No. 1 Lake Park',
              date: '2016-10-03'
            },
            {
              name: 'Jim Green',
              age: 24,
              address: 'London No. 1 Lake Park',
              date: '2016-10-01'
            },
            {
              name: 'Joe Black',
              age: 30,
              address: 'Sydney No. 1 Lake Park',
              date: '2016-10-02'
            },
            {
              name: 'Jon Snow',
              age: 26,
              address: 'Ottawa No. 2 Lake Park',
              date: '2016-10-04'
            }
          ],
          selection: [],
          pageProps: {
            page: 1,
            total: 0,
            perPage:  10
          },
        }
      }
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