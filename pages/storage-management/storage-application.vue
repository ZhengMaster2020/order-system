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
            <Select placeholder="申请状态" v-model="searchForm[currentTab].applyStatus" clearable>
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
            <Button type="primary" @click="getList('search')">搜索</Button>
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
          <Col :xs="24" :sm="12" :md="6" :lg="3">
            <DatePicker  v-model="storageDate" clearable type="date" placeholder="入库时间" @on-change="dateChange"/>
          </Col>

          <Col :xs="24" :sm="12" :md="6" :lg="3">
            <Input placeholder="入库单号" v-model="searchForm[currentTab].storageNumber" clearable></Input>
          </Col>
          <Col :xs="24" :sm="12" :md="6" :lg="3">
            <Select placeholder="入库类型" v-model="searchForm[currentTab].storageType" clearable>
              <Option v-for="(type, index) in storageType" :key="index" :value="type.value" :label="type.label"/>
            </Select>
          </Col>
          <Col :xs="24" :sm="12" :md="6" :lg="3">
            <Input placeholder="下单编号" v-model="searchForm[currentTab].supplierOrderNumber" clearable></Input>
          </Col>
          <Col :xs="24" :sm="12" :md="6" :lg="2">
            <Button type="primary" @click="getList('search')">搜索</Button>
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
          <Table border :columns="applicationColumns" :data="applicationData" :loading="tableLodaing" @on-selection-change="selection => { selectionChange(selection) }" />
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

        <TabPane label="入库记录" name="record">
          <!--          Table-->
          <Table border :columns="recordColumns" :data="recordData" :loading="tableLodaing" @on-selection-change="selection => { selectionChange(selection) }" />

          <!--          Page-->
          <div class="foot-page">
            共{{recordPageProps.total}}条
            <Page transfer
                  :total="recordPageProps.total"
                  :page-size="recordPageProps.perPage"
                  size="small"
                  show-elevator
                  show-sizer
                  @on-change="(page) => { changePage(page, 'recordPageProps') }"
                  @on-page-size-change="(size) => { changePageSize(size, 'recordPageProps') }" />
          </div>
        </TabPane>
      </Tabs>
    </Card>


<!--    入库审核-->
    <Modal v-model="reviewModal.show" title="入库单审核" width="1080">
      <Form inline ref="reviewForm" :model="reviewModal.form" :rules="rules">
        <div class="title">
          <span class="line"></span>
          <div class="title-text">基础信息</div>
          <span class="line"></span>
        </div>

        <FormItem label="申请人">
          <Input class="width-160" v-model="detailData.created_by" readonly/>
        </FormItem>
        <FormItem label="申请时间">
          <Input class="width-160" v-model="detailData.created_at" readonly/>
        </FormItem>
        <FormItem label="入库单号">
          <Input class="width-160" v-model="detailData.storage_number" readonly/>
        </FormItem>
        <FormItem label="下单编号">
          <Input class="width-160" v-model="detailData.supplier_order_number" readonly/>
        </FormItem>
        <FormItem label="订单数量">
          <Input class="width-160" v-model="detailData.amount" readonly/>
        </FormItem>
        <FormItem label="下单时间">
          <Input class="width-160" v-model="detailData.order_time" readonly/>
        </FormItem>
        <FormItem label="生产供应商">
          <Input class="width-160" v-model="detailData.supplier" readonly/>
        </FormItem>
        <FormItem label="包材名称">
          <Input class="width-160" v-model="detailData.packing" readonly/>
        </FormItem>
        <FormItem label="类型">
          <Input class="width-160" v-model="detailData.packing_type" readonly/>
        </FormItem>
        <FormItem label="本次预计入库量">
          <Input class="width-160" v-model="detailData.expected_quantity" readonly/>
        </FormItem>
        <FormItem label="入库仓位号">
          <Input class="width-160" v-model="detailData.position_number" readonly/>
        </FormItem>
        <FormItem label="备注">
          <Input style="width: 510px" v-model="detailData.remark" readonly/>
        </FormItem>
        <FormItem>
          <div>送货单文件</div>
          <div>
            <a :href="file.url" :download="file.name" class="download-link"
               v-for="(file, index) in detailData.delivery_file"
               :key="index">{{file.name}}</a>
          </div>
        </FormItem>

        <div class="title">
          <span class="line"></span>
          <div class="title-text">审核</div>
          <span class="line"></span>
        </div>
        <FormItem label="经办人">
          <Input class="width-180" v-model="userInfo.realName" readonly/>
        </FormItem>
        <FormItem label="审核" prop="isPass">
          <RadioGroup v-model="reviewModal.form.isPass" class="width-120">
            <Radio label="yes">通过</Radio>
            <Radio label="no">驳回</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="审核意见" prop="opinion">
          <Input style="width: 400px" v-model="reviewModal.form.opinion"/>
        </FormItem>


      </Form>
      <Spin size="large" fix v-if="spinShow"></Spin>
      <div class="modal-footer" slot="footer">
        <Button type="default" @click="reviewModal.show = false">取消</Button>
        <Button type="primary" @click="submit('reviewModal', 'reviewForm')">确认</Button>
      </div>
    </Modal>

<!--    完成入库/ 确认入库-->
    <Modal v-model="finishedModal.show" :title="finishedModal.title" width="1080">
      <Form inline ref="finishedForm" :model="finishedModal.form" :rules="rules">
        <div class="title">
          <span class="line"></span>
          <div class="title-text">基础信息</div>
          <span class="line"></span>
        </div>

        <FormItem label="申请人">
          <Input class="width-160" :value="detailData.created_by" readonly/>
        </FormItem>
        <FormItem label="申请时间">
          <Input class="width-160" :value="detailData.created_at" readonly/>
        </FormItem>
        <FormItem label="入库单号">
          <Input class="width-160" :value="detailData.storage_number" readonly/>
        </FormItem>
        <FormItem label="下单编号">
          <Input class="width-160" :value="detailData.supplier_order_number" readonly/>
        </FormItem>
        <FormItem label="订单数量">
          <Input class="width-160" :value="detailData.amount" readonly/>
        </FormItem>
        <FormItem label="本次预计入库量" v-if="!finished">
          <Input class="width-160" :value="detailData.expected_quantity" readonly/>
        </FormItem>
        <FormItem label="下单时间">
          <Input class="width-160" :value="detailData.order_time" readonly/>
        </FormItem>
        <FormItem label="生产供应商" v-if="finished">
          <Input class="width-160" :value="detailData.supplier" readonly/>
        </FormItem>
        <FormItem label="包材供应商" v-if="!finished">
          <Input class="width-160" :value="detailData.supplier" readonly/>
        </FormItem>
        <FormItem label="包材名称">
          <Input :style="{width: !finished ? '160px' : '335px'}"  :value="detailData.packing" readonly/>
        </FormItem>
        <FormItem label="类型">
          <Input class="width-160" :value="detailData.packing_type" readonly/>
        </FormItem>
        <FormItem label="本次预计入库量" v-if="finished">
          <Input class="width-160" :value="detailData.expected_quantity" readonly/>
        </FormItem>
        <FormItem label="入库仓位号">
          <Input class="width-160" :value="detailData.position_number" readonly/>
        </FormItem>
        <FormItem label="备注">
          <Input style="width: 510px" :value="detailData.remark" readonly/>
        </FormItem>
        <FormItem class="width-160">
          <div>送货单文件</div>
          <div>
            <a :href="file.url" :download="file.name" class="download-link"
               v-for="(file, index) in detailData.delivery_file"
               :key="index">{{file.name}}</a>
          </div>
        </FormItem>
        <FormItem>
          <div>装箱单</div>
          <div>
            <a :href="file.url" :download="file.name" class="download-link"
               v-for="(file, index) in detailData.box_file"
               :key="index">{{file.name}}</a>
          </div>
        </FormItem>

        <div class="title">
          <span class="line"></span>
          <div class="title-text">{{finishedModal.subTitle}}</div>
          <span class="line"></span>
        </div>


        <Row v-for="(serial, index) in detailData.storage_record" :key="index">
          <Col span="2">
            <FormItem :label="index === 0? '序号' : ''" style="width: 100%">
              <Input :value="index + 1" readonly/>
            </FormItem>
          </Col>
          <Col span="3">
            <FormItem :label="index === 0? '入库记录员' : ''" style="width: 100%">
              <Input v-model="serial.created_by" readonly/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem :label="index === 0? '入库时间' : ''" style="width: 100%">
              <Input v-model="serial.created_at" readonly/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem :label="index === 0? '生产批次号' : ''" style="width: 100%">
             <Input v-model="serial.batch_number" :readonly="serial.readonly"/>
            </FormItem>
          </Col>
          <Col span="2">
            <FormItem :label="index === 0? '标类型' : ''" style="width: 100%">
              <Input :value="finished ? switchMarkType(serial.mark_type) : serial.mark_type" readonly/>
            </FormItem>
          </Col>
          <Col span="2">
            <FormItem :label="index === 0? '入库类型' : ''" style="width: 100%">
              <Input v-model="serial.storage_type" readonly/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem :label="index === 0? '生产数量' : ''" style="width: 100%">
              <Input v-model="serial.batch_num" readonly/>
            </FormItem>
          </Col>
          <Col span="3">
            <FormItem :label="index === 0? '本次入库数量' : ''" style="width: 100%">
              <Input v-model="serial.current_quantity"/>
            </FormItem>
          </Col>
        </Row>

        <div class="title">
          <span class="line"></span>
          <div class="title-text">{{finishedModal.checkTitle}}</div>
          <span class="line"></span>
        </div>
        <FormItem label="经办人">
          <Input class="width-180" v-model="userInfo.realName" readonly/>
        </FormItem>
        <FormItem label="本次入库总数量">
          <Input class="width-180" v-model="detailData.curStorageTotal" readonly/>
        </FormItem>
        <FormItem label="审核" prop="isPass" v-show="finishedModal.checkTitle === '确认'">
          <RadioGroup class="width-180" v-model="finishedModal.form.isPass">
            <Radio label="yes">确认入库</Radio>
            <Radio label="no">驳回</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem :label="finished ? '意见' : '审核意见'" prop="opinion">
          <Input style="width: 375px" v-model="finishedModal.form.opinion"/>
        </FormItem>


      </Form>
      <Spin size="large" fix v-if="spinShow"></Spin>
      <div class="modal-footer" slot="footer">
        <Button type="default" @click="finishedModal.show = false">取消</Button>
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
          <Input class="width-180" v-model="userInfo.realName" readonly/>
        </FormItem>
        <FormItem label="意见" prop="opinion">
          <Input style="width: 552px" v-model="cancelModal.form.opinion"/>
        </FormItem>
      </Form>
      <div class="modal-footer" slot="footer">
        <Button type="default" @click="cancelModal.show = false">取消</Button>
        <Button type="primary" @click="submit('cancelModal', 'cancelForm')" :loading="btnLoading">确认
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
        userInfo: {},
        searchForm: {
          application: {},
          record: {}
        },
        applicationSelected: {
          1: []
        },
        recordSelected: {
          1: []
        },
        applicationColumns: [
            { type: 'selection', width: 60, align: 'center' },
            { title: '序号', type: 'index', width: 70, align: 'center' },
            { title: '入库单号', key: 'storageNumber', minWidth: 200, align: 'center' },
            { title: '下单编号', key: 'supplierOrderNumber', minWidth: 180, align: 'center' },
            { title: '慕可代码', key: 'mkCode', width: 100, align: 'center' },
            { title: '包材名称', key: 'packing', minWidth: 190, align: 'center' },
            { title: '订单数量', key: 'amount', width: 110, align: 'center' },
            { title: '预计入库数量', key: 'expectedQuantity', width: 130, align: 'center' },
            { title: '已实际入库量', key: 'actualQuantity', width: 130, align: 'center',
              render: (h, {row}) => {
                return h('a', {
                  attrs: {
                    href: 'javascript:void(0)'
                  },
                  on: {
                    click: () => {
                      let {storageNumber, supplierOrderNumber} = row
                      this.searchForm.record.storageNumber = storageNumber
                      this.searchForm.record.supplierOrderNumber = supplierOrderNumber
                      this.recordPageProps.page = 1
                      this.currentTab = 'record'
                      console.log('click')
                    }
                  }
                }, row.actualQuantity)
              }
            },
            { title: '申请状态', key: 'applyStatus', width: 100, align: 'center' },
            { title: '生产供应商', key: 'supplier', width: 170, align: 'center' },
            { title: '申请人', key: 'createdBy', width: 120, align: 'center' },
            { title: '申请时间', key: 'createdAt', width: 110, align: 'center' }
          ],
        applicationData: [],
        applicationPageProps: {
          page: 1,
          total: 0,
          perPage: 10
        },
        recordColumns: [
            { type: 'selection', width: 60, align: 'center' },
            { title: '序号', type: 'index', width: 70, align: 'center' },
            { title: '关联入库单号', key: 'storage_number', minWidth: 200, align: 'center' },
            { title: '生产批次号', key: 'batch_number', minWidth: 200, align: 'center' },
            { title: '生产数量', key: 'batch_num', width: 100, align: 'center' },
            { title: '本次入库数量', key: 'current_quantity', width: 130, align: 'center' },
            { title: '状态', key: 'storage_status', width: 110, align: 'center' },
            { title: '入库记录员', key: 'created_by', width: 130, align: 'center' },
            { title: '入库时间', key: 'created_at', width: 130, align: 'center'},
            { title: '入库类型', key: 'storage_type', width: 100, align: 'center' },
            { title: '慕可代码', key: 'mk_code', width: 140, align: 'center' },
            { title: '包材名称', key: 'packing', minWidth: 190, align: 'center' },
            { title: '标类型', key: 'mark_type', width: 120, align: 'center' },
            { title: '入库仓位号', key: 'position_number', width: 110, align: 'center' }
          ],
        recordData: [],
        recordPageProps: {
            page: 1,
            total: 0,
            perPage: 10
          },

        detailData: {
          delivery_file: [],
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
            isPass: 'yes',
            opinion: ''
          }
        },
        finishedModal: {
          show: false,
          title: '完成入库',
          subTitle: '已确认入库记录',
          checkTitle: '完成入库',
          form: {
            id: '',
            isPass: 'yes',
            opinion: '',
            storageRecordIds: []
          }
        },
        cancelModal: {
          show: false,
          form: {
            id: '',
            opinion: '',
          }

        },
        rules: {
          isPass: [{required: true, message: '必填项', trigger: 'change'}],
          opinion: [{required: true, message: '必填项', trigger: 'blur'}],
          batchNumber: [{required: true, message: '必填项', trigger: 'blur'}]
        },
        applyStatusList: [
          {value: 'pendingReview', label: '待审核'},
          {value: 'pendingStorage', label: '待入库'},
          {value: 'inStock', label: '入库中'},
          {value: 'completed', label: '完成入库'},
          {value: 'overrule', label: '已驳回'},
        ],
        storageType: [
          {value: 'manual', label: '手动入库'},
          {value: 'scan', label: '扫码入库'}
        ]
      }
    },
    methods: {
      reivew() {
        let currentTab = this.currentTab
        let selectName = [currentTab + 'Selected']
        let page = this[currentTab + 'PageProps'].page
        let selection = this[selectName][page]

        if(selection.length === 0) return this.$Message.warning('请选择')
        if(selection.length > 1) return this.$Message.warning('只能审核一项')

        let status = selection[0].applyStatus

        if(status === '已驳回') return this.$Message.warning('已驳回无法审核')
        if(status !== '待审核') return this.$Message.warning('已审核')


        this.getStorageDetail(selection[0].id).then(code => {
          code === 0 && (this.spinShow = false)
        })

        this.reviewModal.form.id = selection[0].id
        this.reviewModal.show = true
      },
      manualStorage() {
        let currentTab = this.currentTab
        let selectName = [currentTab + 'Selected']
        let page = this[currentTab + 'PageProps'].page
        let selection = this[selectName][page]

        if(selection.length === 0) return this.$Message.warning('请选择')
        if(selection.length > 1) return this.$Message.warning('只能选择一项')

        let {id, applyStatus, actualQuantity, expectedQuantity} = selection[0]
        if(applyStatus !== '待入库' && applyStatus !== '入库中') return this.$Message.warning('待入库或入库中才可以手动入库')
        if(actualQuantity >= expectedQuantity) return this.$Message.warning('已达到预计入库量最大值，无法手动入库')

        this.$router.push({
          path: '/storage-management/storage-manual',
          query: {applyId: id}
        })
      },
      finishedStorage() {
        let currentTab = this.currentTab
        let selectName = [currentTab + 'Selected']
        let page = this[currentTab + 'PageProps'].page
        let selection = this[selectName][page]

        if(selection.length === 0) return this.$Message.warning('请选择')
        if(selection.length > 1) return this.$Message.warning('只能审核一项')

        let status = selection[0].applyStatus
        if(status !== '入库中') return this.$Message.warning('请确认入库申请单的状态')

        this.getStorageDetail(selection[0].id).then(code => {
          code === 0 && (this.spinShow = false)
        })

        this.finishedModal.form.id = selection[0].id
        this.finishedModal = {
          ...this.finishedModal,
          show: true,
          title: '完成入库',
          subTitle: '已确认入库记录',
          checkTitle: '完成入库',
        }
      },

      confirmStorage() {
        let currentTab = this.currentTab
        let selectName = [currentTab + 'Selected']
        let selection = []

        for(let page in this[selectName]) {
          this[selectName][page].forEach(items => {
            selection.push(items)
          })
        }

        if(selection.length === 0) return this.$Message.warning('请选择')

        let applyIds = []
        let recordIds = []
        let storageStatus = []

        selection.forEach(items => {
          applyIds.push(items.apply_id)
          recordIds.push(items.id)
          storageStatus.push(items.storage_status)
        })

        let isSameApplyId = applyIds.some(id => id !== applyIds[0])
        if(isSameApplyId) return this.$Message.warning('请选择同一入库申请单')

        let isPendingConfirme = storageStatus.some(status => status !== '待确认')
        if(isPendingConfirme) return this.$Message.warning('请选择待确认状态的入库申请单')

        this.finishedModal.form.storageRecordIds = recordIds

          this.getStorageRecordDetail(recordIds[0]).then(() => {
          return this.getPendingConfirmRecord(recordIds)
        }).then((code) => {
          console.log(code, 'code')
          code === 0 && (this.spinShow = false)
        })

        this.finishedModal = {
          ...this.finishedModal,
          show: true,
          title: '确认入库',
          subTitle: '待确认入库记录',
          checkTitle: '确认',
        }
        this.finishedModal.form.id = applyIds[0]

      },
      cancelStorage(id) {
        let currentTab = this.currentTab
        let selectName = [currentTab + 'Selected']
        let page = this[currentTab + 'PageProps'].page
        let selection = this[selectName][page]

        if(selection.length === 0) return this.$Message.warning('请选择')
        if(selection.length > 1) return this.$Message.warning('只能作废一项')

        let check = selection[0].storage_status === '待确认' || selection[0].storage_status === '已驳回'
        if(selection[0].storage_status === '已作废') return this.$Message.warning('已作废')
        if(!check) return this.$Message.warning('待确认或已驳回才能作废入库记录')

        this.cancelModal.form.id = selection[0].id

        this.cancelModal.show = true
      },

      exportStorageData() {
        let params = JSON.parse(JSON.stringify(this.searchForm[this.currentTab]))
        delete params.page
        delete params.perPage
        this.$API.exportStorageRecord(params).then(res => {
          this.handelExportData(res)
        })
      },
      handelExportData(data) {
        // console.log(res)
        if (typeof window.chrome !== 'undefined') {
          // Chrome version
          var link = document.createElement('a');
          link.href = window.URL.createObjectURL(data);
          link.click();
        } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
          // IE version
          window.navigator.msSaveBlob(data);
        } else {
          // Firefox version
          var file = new File([data], { type: 'application/force-download' });
          window.open(URL.createObjectURL(file));
        }
        this.$Message.success('导出成功')
      },

      edit() {
        let currentTab = this.currentTab
        let selectName = [currentTab + 'Selected']
        let page = this[currentTab + 'PageProps'].page
        let selection = this[selectName][page]

        if(selection.length === 0) return this.$Message.warning('请选择')
        if(selection.length > 1) return this.$Message.warning('只能修改一项')
        let id = selection[0].id
        let check = null
        if(this.currentTab === 'application'){
          check = selection[0].applyStatus === '待审核' || selection[0].applyStatus === '已驳回'
          if(!check) return this.$Message.warning('待审核或已驳回才能修改')

          this.$router.push({
            path: '/storage-management/storage-add',
            query: {id}
          })
          return
        }

        check = selection[0].storage_status === '待确认' || selection[0].storage_status === '已驳回'
        if(!check) return this.$Message.warning('待确认或已驳回才能修改')

        console.log(id, 'edit')
        this.$router.push({
          path: '/storage-management/storage-manual',
          query: {
            recordId: id,
            currentQuantity: selection[0].current_quantity
          }
        })
        // if(this.application.selection.length > 1) return this.$Message.error('一次只能操作一条数据')
      },
      // table 选项操作
      selectionChange(selection) {
        let currentTab = this.currentTab
        let selectName = currentTab + 'Selected'
        let pagePropsName = currentTab + 'PageProps'
        let page = this[pagePropsName].page
        this[selectName][page] = selection
      },
      // 改变当前分页
      changePage (page, key) {
        this[key].page = page
        this.getList();
      },
      // 改变分页size
      changePageSize (pageSize, key) {
        this[key].perPage = pageSize
        this.getList();
      },
      // 日期
      dateChange (date) {
        this.searchForm[this.currentTab].createdTime = date
        this.getList('search');
      },
      submit(modal, form) {

        this.$refs[form].validate(val => {
          if (!val) return
          let params = JSON.parse(JSON.stringify(this[modal].form))

          let api = ''
          if(modal === 'reviewModal') {
            api = 'reviewStorage'
          }else if(modal === 'finishedModal'){
            if(this[modal].title === '完成入库'){
              api = 'finishedStotageApply'
              delete params.isPass
              delete params.storageRecordIds
            }else {
              api = 'confirmStorageRecord'
            }
          }else if(modal === 'cancelModal'){
            api = 'cancelStorageRecord'
          }

          // return console.log(params)
          this.$API[api](params).then(res => {
            if (res.code !== 0) return
            this.$Message.success(res.msg)
            this.getList('search')
            this[modal].show = false
          })
        })

      },
      // 申请列表
      getList(type) {
        let params = this.searchForm[this.currentTab]
        let currentTab = this.currentTab
        let selectName = currentTab + 'Selected'

        if(type === 'search') {
          this[selectName] = {1: []}
          this[this.currentTab + 'PageProps'].page = 1
        }

        let api = this.currentTab === 'application' ? 'getStorageList' : 'getStorageRecord'

        params.page = this[this.currentTab + 'PageProps'].page
        params.perPage = this[this.currentTab + 'PageProps'].perPage

        console.log(this[this.currentTab + 'PageProps'].page)
        this.tableLodaing = true
        this.$API[api](params).then(res => {
          // console.log(res)
          if(res.code !== 0) return

          let {count, page, list} = res.data
          if (this[selectName][params.page] && this[selectName][params.page].length) {
            // 选中数组中该页有数据  赋值checked
            list.forEach(items => {
              let isHas = this[selectName][page].find(selectItem => selectItem.id === items.id)
              if (isHas) {
                items._checked = true
              }
            })
          }

          this.tableLodaing = false
          this[this.currentTab + 'Data'] = list
          this[this.currentTab + 'PageProps'].page = page
          this[this.currentTab + 'PageProps'].total = count
        })
      },

      // 申请详情
      getStorageDetail(id) {
        this.spinShow = true
        return this.$API.getStorageDetail(id).then(res => {
          // console.log(res)
          if(res.code !== 0) return
          this.detailData = res.data
          this.detailData.delivery_file = res.data.delivery_file
          if(res.data.storage_record.length > 0) {
            this.detailData.curStorageTotal = res.data.storage_record.reduce((pre, cur) => {
              return pre + cur.current_quantity
            }, 0)
          }
          return res.code
        })
      },

      // 记录详情
      getStorageRecordDetail(id) {
        this.spinShow = true
        return this.$API.getStorageRecordDetail(id).then(res => {
          // console.log(res)
          if(res.code !== 0) return
          this.detailData = {
            created_by: res.data.createdBy,
            created_at: res.data.createdAt,
            storage_number: res.data.storageNumber,
            supplier_order_number: res.data.supplierOrderNumber,
            amount: res.data.amount,
            expected_quantity: res.data.expectedQuantity,
            order_time: res.data.orderTime,
            supplier: res.data.supplier,
            packing: res.data.packing,
            packing_type: res.data.packingType,
            position_number: res.data.positionNumber,
            remark: res.data.remark,
            delivery_file: res.data.fileItems,
            box_file: res.data.boxItems,
          }

          if(res.data.storage_record && res.data.storage_record.length > 0) {
            this.detailData.curStorageTotal = res.data.storage_record.reduce((pre, cur) => {
              return pre + cur.current_quantity
            }, 0)
          }
          return res.code
        })
      },

      // 待确认入库记录
      getPendingConfirmRecord(ids) {
        return this.$API.getStorageRecordByIds({ids}).then(res => {
          if(res.code === 0) {
            this.detailData.storage_record = res.data.map(items => {
              return {
                created_by: items.createdBy,
                created_at: items.createdAt,
                batch_number: items.batchNumber,
                mark_type: items.markType,
                storage_type: items.storageType,
                batch_num: items.batchNum,
                current_quantity: items.currentQuantity
              }
            })
            if(res.data.length > 0) {
              this.detailData.curStorageTotal = res.data.reduce((pre, cur) => {
                return pre + cur.currentQuantity
              }, 0)
              // console.log(this.detailData.curStorageTotal, 'this.detailData.curStorageTotal')
            }
          }
          return res.code
        })
      },

      switchMarkType(markType) {
        let types = {
          J: '平标',
          P: '卷标'
        }
        return types[markType]
      }
    },
    watch: {
      ['reviewModal.show'](cur) {
        if(!cur) {
          this.reviewModal.form = {
            id: '',
            isPass: 'yes',
            opinion: ''
          }
          this.$refs.reviewForm.resetFields()
        }
      },
      ['finishedModal.show'](cur) {
        if(!cur) {
          this.finishedModal.form = {
            id: '',
            isPass: 'yes',
            opinion: '',
            storageRecordIds: []
          }
          this.$refs.finishedForm.resetFields()
        }
      },
      currentTab(cur) {
        // this.searchForm[cur] = {} 清空？
        this.getList()
      }
    },
    computed: {
      finished() {
        return this.finishedModal.title === '完成入库'
      }
    },
    mounted() {
      this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))

      let {tab, supplierOrderNumber} = this.$route.params

      if(tab) {
        tab && (this.currentTab = tab)
        supplierOrderNumber && (this.searchForm[tab].supplierOrderNumber = supplierOrderNumber)
        console.log(this.searchForm[tab])
      }else {
        this.getList()
      }
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
  .width-160 {
    width: 160px;
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