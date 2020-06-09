<template>
  <div>
    <Card>
      <!--      Form-->
      <Form v-show="currentTab === 'application'" inline>
        <Row>
          <Col :xs="24" :sm="12" :md="6" :lg="3">
            <Input placeholder="入库单号" v-model="searchForm[currentTab].storageNumber" clearable></Input>
          </Col>
          <Col :xs="24" :sm="12" :md="6" :lg="3">
            <Input placeholder="下单编号" v-model="searchForm[currentTab].supplierOrderNumber" clearable></Input>
          </Col>
          <Col :xs="24" :sm="12" :md="6" :lg="3">
            <Input placeholder="生成供应商" v-model="searchForm[currentTab].supplier" clearable></Input>
          </Col>
          <Col :xs="24" :sm="12" :md="6" :lg="3">
            <Input placeholder="申请人" v-model="searchForm[currentTab].createdBy" clearable></Input>
          </Col>
          <Col :xs="24" :sm="12" :md="6" :lg="3">
<!--            <Input placeholder="申请状态" v-model="searchForm[currentTab].applyStatus" clearable></Input>-->
            <Select placeholder="申请状态" v-model="searchForm[currentTab].applyStatus">
              <Option v-for="(status, index) in applyStatusList" :key="index" :value="status.value" :label="status.label"/>
            </Select>
          </Col>
          <Col :xs="24" :sm="12" :md="6" :lg="3">
            <Input placeholder="慕可代码" v-model="searchForm[currentTab].mkCode" clearable></Input>
          </Col>
          <Col :xs="24" :sm="12" :md="6" :lg="3">
            <Input placeholder="包材名称" v-model="searchForm[currentTab].packing" clearable></Input>
          </Col>
          <Col :xs="24" :sm="12" :md="6" :lg="2">
            <Button type="primary" @click="search('search')">搜索</Button>
          </Col>
        </Row>

        <Row class="margin-top-10">
          <Col>
            <Button type="primary" @click="$router.push('/storage-management/storage-add')">添加入库单</Button>
            <Button type="primary" @click="reivew">审核</Button>
            <Button type="primary" @click="manualStorage">手动入库</Button>
            <Button type="primary" @click="finishedStorage">完成入库</Button>
            <Button type="primary" @click="edit">修改</Button>
          </Col>
        </Row>
      </Form>
      <Form v-show="currentTab === 'record'" inline>
        <Row>
          <Col :xs="24" :sm="12" :md="6" :lg="3">
            <Input placeholder="生产批次号" v-model="searchForm[currentTab].batchNumber" clearable></Input>
          </Col>
          <Col :xs="24" :sm="12" :md="6" :lg="3">
            <Input placeholder="入库记录员" v-model="searchForm[currentTab].createdBy" clearable></Input>
          </Col>
<!--          <Col :xs="24" :sm="12" :md="6" :lg="3">-->
<!--            <Input placeholder="入库时间" v-model="searchForm[currentTab].createdTime" clearable></Input>-->
<!--          </Col>-->
          <Col :xs="24" :sm="12" :md="6" :lg="3">
            <DatePicker  v-model="storageDate" clearable type="date" placeholder="入库时间" @on-change="dateChange"/>
          </Col>

          <Col :xs="24" :sm="12" :md="6" :lg="3">
            <Input placeholder="入库单号" v-model="searchForm[currentTab].storageNumber" clearable></Input>
          </Col>
          <Col :xs="24" :sm="12" :md="6" :lg="3">
            <!--            <Input placeholder="申请状态" v-model="searchForm[currentTab].applyStatus" clearable></Input>-->
            <Select placeholder="入库类型" v-model="searchForm[currentTab].storageType">
              <Option v-for="(status, index) in applyStatusList" :key="index" :value="status.value" :label="status.label"/>
            </Select>
          </Col>
          <Col :xs="24" :sm="12" :md="6" :lg="3">
            <Input placeholder="下单编号" v-model="searchForm[currentTab].supplierOrderNumber	" clearable></Input>
          </Col>
          <Col :xs="24" :sm="12" :md="6" :lg="2">
            <Button type="primary" @click="search('search')">搜索</Button>
          </Col>
        </Row>
        <Row class="margin-top-10">
          <Col>
            <Button type="primary" @click="exportStorageData">导出数据</Button>
            <Button type="primary" @click="confirmStorage">入库确认</Button>
            <Button type="primary" @click="cancelStorage">作废</Button>
            <Button type="primary" @click="edit">修改</Button>
          </Col>
        </Row>
      </Form>

      <!--      Tabs-->
      <Tabs v-model="currentTab">
        <TabPane label="入库申请单" name="application">
          <!--          Table-->
          <Table border :columns="applicationColumns" :data="applicationData" @on-selection-change="selection => { selectionChange(selection) }" />
          <!--          Page-->
          <div class="foot-page">
            共{{applicationPageProps.total}}条
            <Page transfer
                  :total="applicationPageProps.total"
                  :page-size="applicationPageProps.perPage"
                  size="small"
                  show-elevator
                  show-sizer
                  @on-change="(page) => { changePage(page, 'application') }"
                  @on-page-size-change="(size) => { changePageSize(size, 'application') }" />
          </div>
        </TabPane>

        <TabPane label="入库记录" name="record">
          <!--          Table-->
          <Table border :columns="applicationColumns" :data="applicationData" @on-selection-change="selection => { selectionChange(selection) }" />

          <!--          Page-->
          <div class="foot-page">
            共{{applicationPageProps.total}}条
            <Page transfer
                  :total="applicationPageProps.total"
                  :page-size="applicationPageProps.perPage"
                  size="small"
                  show-elevator
                  show-sizer
                  @on-change="(page) => { changePage(page, 'applicationPageProps') }"
                  @on-page-size-change="(size) => { changePageSize(size, 'applicationPageProps') }" />
          </div>
        </TabPane>
      </Tabs>
    </Card>


<!--    入库审核-->
    <Modal v-model="reviewModal.show" title="入库单审核" width="1005">
      <Form inline ref="reviewForm" :model="reviewModal.form" :rules="rules">
        <div class="title">
          <span class="line"></span>
          <div class="title-text">基础信息</div>
          <span class="line"></span>
        </div>

        <FormItem label="申请人">
          <Input class="width-180" v-model="reviewModal.data.createdBy" readonly/>
        </FormItem>
        <FormItem label="申请时间">
          <Input class="width-180" v-model="reviewModal.data.createdAt" readonly/>
        </FormItem>
        <FormItem label="入库单号">
          <Input class="width-180" v-model="reviewModal.data.planNumber" readonly/>
        </FormItem>
        <FormItem label="下单编号">
          <Input class="width-180" v-model="reviewModal.data.brand" readonly/>
        </FormItem>
        <FormItem label="订单数量">
          <Input class="width-180" v-model="reviewModal.data.generationCount" readonly/>
        </FormItem>
        <FormItem label="下单时间">
          <Input class="width-180" v-model="reviewModal.data.quarter" readonly/>
        </FormItem>
        <FormItem label="生产供应商">
          <Input class="width-180" v-model="reviewModal.data.isFillPlan" readonly/>
        </FormItem>
        <FormItem label="包材名称">
          <Input class="width-180" v-model="reviewModal.data.planName" readonly/>
        </FormItem>
        <FormItem label="类型">
          <Input class="width-180" v-model="reviewModal.data.planName" readonly/>
        </FormItem>
        <FormItem label="本次预计入库量">
          <Input class="width-180" v-model="reviewModal.data.planName" readonly/>
        </FormItem>
        <FormItem label="入库仓位号">
          <Input class="width-180" v-model="reviewModal.data.planName" readonly/>
        </FormItem>
        <FormItem label="备注">
          <Input class="width-180" v-model="reviewModal.data.planName" readonly/>
        </FormItem>
        <FormItem label="送货单文件">
          <div style="padding-top: 33px">
            <a :href="file.url" :download="file.name" class="download-link"
               v-for="(file, index) in reviewModal.data.fileItems"
               :key="index">{{file.name}}</a>
          </div>
        </FormItem>

        <div class="title">
          <span class="line"></span>
          <div class="title-text">审核</div>
          <span class="line"></span>
        </div>
        <FormItem label="经办人">
          <Input class="width-180" v-model="reviewModal.reivewer" readonly/>
        </FormItem>
        <FormItem label="审核" prop="planStatus">
          <RadioGroup v-model="reviewModal.form.planStatus" class="width-120">
            <Radio label="pendingExecuted">通过</Radio>
            <Radio label="overrule">驳回</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="审核意见" prop="opinion">
          <Input style="width: 400px" v-model="reviewModal.form.opinion"/>
        </FormItem>


      </Form>
      <Spin size="large" fix v-if="spinShow"></Spin>
      <div class="modal-footer" slot="footer">
        <Button type="default" @click="reviewModal.modal = false">取消</Button>
        <Button type="primary" @click="submit('reviewModal', 'reviewForm')">确认</Button>
      </div>
    </Modal>

<!--    完成入库/ 确认入库-->
    <Modal v-model="finishedModal.show" :title="finishedModal.title" width="1005">
      <Form inline ref="finishedForm" :model="finishedModal.form" :rules="rules">
        <div class="title">
          <span class="line"></span>
          <div class="title-text">基础信息</div>
          <span class="line"></span>
        </div>

        <FormItem label="申请人">
          <Input class="width-180" v-model="detailData.createdBy" readonly/>
        </FormItem>
        <FormItem label="申请时间">
          <Input class="width-180" v-model="detailData.createdAt" readonly/>
        </FormItem>
        <FormItem label="入库单号">
          <Input class="width-180" v-model="detailData.planNumber" readonly/>
        </FormItem>
        <FormItem label="下单编号">
          <Input class="width-180" v-model="detailData.brand" readonly/>
        </FormItem>
        <FormItem label="订单数量">
          <Input class="width-180" v-model="detailData.generationCount" readonly/>
        </FormItem>
        <FormItem label="下单时间">
          <Input class="width-180" v-model="detailData.quarter" readonly/>
        </FormItem>
        <FormItem label="生产供应商">
          <Input class="width-180" v-model="detailData.isFillPlan" readonly/>
        </FormItem>
        <FormItem label="包材名称">
          <Input class="width-180" v-model="detailData.planName" readonly/>
        </FormItem>
        <FormItem label="类型">
          <Input class="width-180" v-model="detailData.planName" readonly/>
        </FormItem>
        <FormItem label="本次预计入库量">
          <Input class="width-180" v-model="detailData.planName" readonly/>
        </FormItem>
        <FormItem label="入库仓位号">
          <Input class="width-180" v-model="detailData.planName" readonly/>
        </FormItem>
        <FormItem label="备注">
          <Input class="width-180" v-model="detailData.planName" readonly/>
        </FormItem>
        <FormItem label="送货单文件">
          <div style="padding-top: 33px">
            <a :href="file.url" :download="file.name" class="download-link"
               v-for="(file, index) in detailData.fileItems"
               :key="index">{{file.name}}送货单文件</a>
          </div>
        </FormItem>
        <FormItem label="装箱单">
          <div style="padding-top: 33px">
            <a :href="file.url" :download="file.name" class="download-link"
               v-for="(file, index) in detailData.fileItems"
               :key="index">{{file.name}}装箱单</a>
          </div>
        </FormItem>

        <div class="title">
          <span class="line"></span>
          <div class="title-text">{{finishedModal.subTitle}}</div>
          <span class="line"></span>
        </div>


        <Row v-for="(serial, index) in detailData.batchData" :key="index">
          <Col span="2">
            <FormItem :label="index === 0? '序号' : ''" style="width: 100%">
              <Input v-model="serial.number" readonly/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem :label="index === 0? '生产批次号' : ''" style="width: 100%">
                          <Input v-model="serial.batchNumber" :readonly="serial.readonly"/>
<!--              <Select  v-model="serial.batchNumber">-->
<!--                <Option v-for="(items, index) in batchList" :key="index" :value="items.value" :label="items.lang" />-->
<!--              </Select>-->
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem :label="index === 0? '所属计划名称' : ''" style="width: 100%">
              <Input v-model="serial.number" readonly/>
            </FormItem>
          </Col>
          <Col span="2">
            <FormItem :label="index === 0? '标类型' : ''" style="width: 100%">
              <Input v-model="serial.number" readonly/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem :label="index === 0? '生产数量' : ''" style="width: 100%">
              <Input v-model="serial.number" readonly/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem :label="index === 0? '剩余入库量' : ''" style="width: 100%">
              <Input v-model="serial.number" readonly/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem :label="index === 0? '本次入库数量' : ''" style="width: 100%">
              <Input v-model="serial.currentQuantity"/>
            </FormItem>
          </Col>
        </Row>

        <div class="title">
          <span class="line"></span>
          <div class="title-text">完成入库</div>
          <span class="line"></span>
        </div>
        <FormItem label="经办人">
          <Input class="width-180" v-model="finishedModal.reivewer" readonly/>
        </FormItem>
        <FormItem label="本次入库总数量" prop="opinion">
          <Input class="width-180" v-model="finishedModal.form.opinion"/>
        </FormItem>
        <FormItem label="审核意见" prop="opinion">
          <Input style="width: 400px" v-model="finishedModal.form.opinion"/>
        </FormItem>


      </Form>
      <Spin size="large" fix v-if="spinShow"></Spin>
      <div class="modal-footer" slot="footer">
        <Button type="default" @click="finishedModal.modal = false">取消</Button>
        <Button type="primary" @click="submit('finishedModal', 'finishedForm')">确认</Button>
      </div>
    </Modal>

    <!--  作废  -->
    <Modal v-model="cancelModal.show" title="作废入库记录" draggable width="1000">
      <Form inline ref="cancelForm" :model="cancelModal.form" :rules="rules">
        <div class="title">
          <span class="line"></span>
          <div class="title-text">撤销</div>
          <span class="line"></span>
        </div>

        <FormItem label="撤销人">
          <Input class="width-180" v-model="cancelModal.operator" readonly/>
        </FormItem>
        <FormItem label="意见" prop="opinion">
          <Input style="width: 552px" v-model="cancelModal.form.opinion"/>
        </FormItem>
      </Form>
      <div class="modal-footer" slot="footer">
        <Button type="default" @click="cancelModal.show = false">取消</Button>
        <Button type="primary" @click="submit('cancelProductModal', 'cancelForm')" :loading="btnLoading">确认
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        currentTab: 'application',
        tableLodaing: false,
        btnLoading: false,
        spinShow: false,
        storageDate: '',

        searchForm: {
          application: {},
          record: {}
        },
        applicationColumns: [
            { type: 'selection', width: 60, align: 'center' },
            { title: '序号', type: 'index', width: 70, align: 'center' },
            { title: '入库单号', key: 'storageNumber', width: 140, align: 'center' },
            { title: '下单编号', key: 'supplierOrderNumber', width: 140, align: 'center' },
            { title: '慕可代码', key: 'mkCode', width: 100, align: 'center' },
            { title: '包材名称', key: 'packing', width: 120, align: 'center' },
            { title: '订单数量', key: 'amount', width: 100, align: 'center' },
            { title: '预计入库数量', key: 'expectedQuantity', width: 100, align: 'center' },
            { title: '已实际入库量', key: 'actualQuantity', width: 100, align: 'center',
              render: (h, {row}) => {
                return h('a', {
                  attrs: {
                    href: 'javascript:void(0)'
                  },
                  on: {
                    click: () => {
                      console.log('click')
                    }
                  }
                }, row.actualQuantity)
              }
            },
            { title: '申请状态', key: 'applyStatus', width: 100, align: 'center' },
            { title: '生产供应商', key: 'supplier', width: 140, align: 'center' },
            { title: '申请人', key: 'createdBy', width: 120, align: 'center' },
            { title: '申请时间', key: 'createdAt', width: 110, align: 'center' }
          ],
        applicationData: [
            {
              createdBy: 'John Brown',
              actualQuantity: 18,
              supplier: 'New York No. 1 Lake Park',
              createdAt: '2016-10-03'
            },
            {
              createdBy: 'Jim Green',
              actualQuantity: 24,
              supplier: 'London No. 1 Lake Park',
              createdAt: '2016-10-01'
            },
            {
              createdBy: 'Joe Black',
              actualQuantity: 30,
              supplier: 'Sydney No. 1 Lake Park',
              createdAt: '2016-10-02'
            },
            {
              createdBy: 'Jon Snow',
              actualQuantity: 26,
              supplier: 'Ottawa No. 2 Lake Park',
              createdAt: '2016-10-04'
            }
          ],
        applicationSelection: [],
        applicationPageProps: {
            page: 1,
            total: 0,
            perPage:  10
          },

        detailData: {
          fileItems: [],
          batchData: [
            {
              batchNumber: null,
              currentQuantity: null,
              batchList: [],
            }
          ]
        },
        // Modal

        reviewModal: {
          show: false,
          reivewer: '',
          data: {
            createdBy: '',
            createdAt: '',
            planNumber: '',
            planName: '',
            realNum: '',
            remark: '',
            generationCount: '',
            isFillPlan: '',
            brand: '',
            quarter: '',
            fileItems: [],
          },
          form: {
            id: '',
            planStatus: 'overrule',
            opinion: ''
          }
        },
        finishedModal: {
          show: false,
          title: '完成入库',
          subTitle: '已确认入库记录',
          form: {
            id: '',
            planStatus: 'overrule',
            opinion: ''
          }
        },
        cancelModal: {
          show: false,
          operator: '',
          form: {
            opinion: '',
          },

        },
        rules: {
          planStatus: [{required: true, message: '必填项', trigger: 'change'}],
          opinion: [{required: true, message: '必填项', trigger: 'blur'}],
          batchNumber: [{required: true, message: '必填项', trigger: 'blur'}]
        },
        applyStatusList: [
          {value: 'pendingReview', label: '待审核'},
          {value: 'pendingStorage', label: '待入库'},
          {value: 'inStock', label: '入库中'},
          {value: 'completed', label: '完成入库'},
          {value: 'overrule', label: '已驳回'},
        ]
      }
    },
    methods: {
      // Form 操作
      search() {
        let currentTab = this.currentTab

        console.log(this.searchForm[currentTab])
        // if(this.application.selection.length > 1) return this.$Message.error('一次只能操作一条数据')
      },
      reivew() {
        this.reviewModal.show = true
        // if(this.application.selection.length > 1) return this.$Message.error('一次只能操作一条数据')
      },
      manualStorage(id) {
        this.$router.push({
          path: '/storage-management/storage-manual'
        })
        // if(this.application.selection.length > 1) return this.$Message.error('一次只能操作一条数据')
      },
      finishedStorage(id) {
        this.finishedModal.show = true
        this.finishedModal.title = '完成入库'
        this.finishedModal.subTitle = '已确认入库记录'
        // if(this.application.selection.length > 1) return this.$Message.error('一次只能操作一条数据')
      },
      confirmStorage(id) {
        this.finishedModal.show = true
        this.finishedModal.title = '确认入库'
        this.finishedModal.subTitle = '待确认入库记录'
        // if(this.application.selection.length > 1) return this.$Message.error('一次只能操作一条数据')
      },
      cancelStorage(id) {
        this.cancelModal.show = true
        // if(this.application.selection.length > 1) return this.$Message.error('一次只能操作一条数据')
      },
      exportStorageData(id) {

        // if(this.application.selection.length > 1) return this.$Message.error('一次只能操作一条数据')
      },
      edit(id) {
        if(this.currentTab === 'application'){
          this.$router.push({
            path: '/storage-management/storage-add'
          })
          return
        }

        this.$router.push({
          path: '/storage-management/storage-manual',
          query: {
            id: 1
          }
        })
        // if(this.application.selection.length > 1) return this.$Message.error('一次只能操作一条数据')
      },
      // table 选项操作
      selectionChange(selection) {
        // this.applicationSelection = selection
      },
      // 改变当前分页
      changePage (page, key) {
        this[key].page = page
        // this.getList();
      },
      // 改变分页size
      changePageSize (pageSize, key) {
        this[key].perPage = pageSize
        // this.getList();
      },
      // 改变分页size
      dateChange (date, key) {
        this.searchForm[this.currentTab].createdTime = date
        // this.getList();
      },
      submit() {},
      // 申请列表
      getStorageList() {
        let params = this.searchForm[this.currentTab]
        params.page = this[this.currentTab + 'PageProps'].page
        params.perPage = this[this.currentTab + 'PageProps'].perPage
        this.tableLodaing = true
        this.$API.getStorageList(params).then(res => {
          console.log(res)
          this.tableLodaing = false
          this[this.currentTab + 'Data'] = res.data.list
          this[this.currentTab + 'PageProps'].page = res.data.pageCount
        })
      }
    },
    mounted() {
      // this.getStorageList()
    }
  }
</script>

<style scoped lang="less">
  .width-120 {
    width: 120px;
  }
  .width-180 {
    width: 180px;
  }
  .foot-page {
    padding: 10px;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  /deep/ .ivu-modal-header {
    padding-bottom: 0;
    border-bottom: none;
  }

  /deep/ .ivu-modal-body {
    padding-top: 0;
  }
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    font-weight: bold;
    .title-text {
      flex-shrink: 0;
      padding: 0 10px;
    }

    .line {
      width: 100%;
      border-top: 1px solid #e9ebed;
    }
  }
</style>