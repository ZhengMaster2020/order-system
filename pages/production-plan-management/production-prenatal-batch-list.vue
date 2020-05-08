<template>
  <div>
    <Card>
      <!--      Form-->
      <Form ref="searchForm" :model="searchForm" inline>
        <Row type="flex" justify="space-between">
          <Col>
            <FormItem>
              <Input v-model="searchForm.createdBy" placeholder="创建人" class="width-120"/>
            </FormItem>
            <FormItem>
              <DatePicker type="datetime"
                          format="yyyy-MM-dd HH:mm:ss"
                          placeholder="创建时间"
                          class="width-120" @on-change="dateChange"/>
            </FormItem>
            <FormItem>
              <Input v-model="searchForm.planNumber" placeholder="下单编号" class="width-120"/>
            </FormItem>
            <FormItem>
              <Input v-model="searchForm.batchNumber" placeholder="生产批次号" class="width-120"/>
            </FormItem>
            <FormItem>
              <FormItem prop="name">
                <Select v-model="searchForm.brand" clearable placeholder="品牌" class="width-120">
                  <Option v-for="brand in brandList" :key="brand.label" :value="brand.label">{{brand.value}}</Option>
                </Select>
              </FormItem>
            </FormItem>
            <FormItem>
              <Input v-model="searchForm.planName" placeholder="所属计划名称" class="width-120"/>
            </FormItem>
            <FormItem>
              <Input v-model="searchForm.supplier" placeholder="生成供应商" class="width-120"/>
            </FormItem>
            <FormItem>
              <Select clearable placeholder="是否导出" style="width: 100px" v-model="searchForm.processStatus">
                <Option value="notExported">未导出</Option>
                <Option value="exported">已导出</Option>
              </Select>
            </FormItem>
            <FormItem>
              <Select clearable placeholder="是否撤销" style="width: 100px" v-model="searchForm.produceStatus">
                <Option value="unrevoked">未撤销</Option>
                <Option value="revoked">已撤销</Option>
              </Select>
            </FormItem>
          </Col>
          <Col>
            <FormItem>
              <Button type="primary" @click="search">搜索</Button>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem>
              <Button type="primary" @click="cancelProduction">撤销生产</Button>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="exportList">导表处理</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>

      <!--      Tabs-->
      <Tabs v-model="currentTab">
        <TabPane label="计划列表" name="prenatalBatch">

          <!--          Table-->
          <Table border
                 :columns="prenatalBatch.columns"
                 :data="prenatalBatch.data"
                 @on-selection-change="selection => { selectionChange(selection) }"
                 :loading="tableLoading"/>

          <!--          Page-->
          <div class="foot-page">
            共{{prenatalBatch.pageProps.total}}条
            <Page transfer
                  :total="prenatalBatch.pageProps.total"
                  :page-size="prenatalBatch.pageProps.perPage"
                  size="small"
                  show-elevator
                  show-sizer
                  @on-change="(page) => { changePage(page, 'prenatalBatch') }"
                  @on-page-size-change="(size) => { changePageSize(size, 'prenatalBatch') }"/>
          </div>
        </TabPane>
      </Tabs>
    </Card>

    <!--  TODO: 已处理数量接口 导表处理  -->
    <Modal
    v-model="exportModal.modal"
    title="导表处理"
    width="1000">
      <Form inline ref="exportForm" :model="exportModal.form" :rules="rules">
        <div class="title">
          <span class="line"></span>
          <div class="title-text">关联采购下单编号</div>
          <span class="line"></span>
        </div>

        <FormItem label="采购下单编号" prop="supplierOrderNumber">
          <Input class="width-180" v-model="exportModal.form.supplierOrderNumber" @on-change="getMKCode"/>
        </FormItem>
        <FormItem label="慕可代码" prop="mkCode">
          <!--          <Input class="width-180" v-model="exportModal.form.mkCode" readonly/>-->
          <Select v-model="exportModal.form.mkCode" class="width-180" @on-change="getSupplierInfo">
            <Option v-for="code in mkCodeList" :key="code.label" :value="code.label">{{code.value}}</Option>
          </Select>
        </FormItem>
        <FormItem label="包材名称">
          <Input class="width-180" v-model="exportModal.form.packageName" readonly/>
        </FormItem>
        <FormItem label="生产供应商">
          <Input class="width-180" v-model="exportModal.form.supplier" readonly/>
        </FormItem>
        <FormItem label="下单数量">
          <Input class="width-180" v-model="exportModal.form.orderQuantity" readonly/>
        </FormItem>
        <FormItem label="已处理数量">
          <Input class="width-180" v-model="exportModal.form.processedNum" readonly/>
        </FormItem>
        <FormItem label="意见" prop="opinion">
          <Input class="width-180" v-model="exportModal.form.opinion" />
        </FormItem>

        <div class="title">
          <span class="line"></span>
          <div class="title-text">已选生产批次号信息</div>
          <span class="line"></span>
        </div>
        <Row>
          <FormItem style="visibility: hidden;">
            <Input style="width: 100px"/>
          </FormItem>
          <FormItem label="操作人">
            <Input class="width-200" v-model="exportModal.operator" readonly/>
          </FormItem>
          <FormItem label="已选生成数量汇总">
            <Input class="width-200" v-model="exportModal.generateQuantity" readonly/>
          </FormItem>
          <FormItem label="所属计划名称">
            <Input class="width-200" v-model="exportModal.planName" readonly/>
          </FormItem>
          <FormItem label="品牌">
            <Input class="width-200" v-model="exportModal.brand" readonly/>
          </FormItem>
        </Row>

        <Row v-for="(items, index) in exportModal.form.data" :key="index">
          <FormItem :label="index === 0? '序号': ''">
            <Input style="width: 100px" v-model="items.index" readonly/>
          </FormItem>
          <FormItem :label="index === 0? '生产批次号': ''">
            <Input class="width-200" v-model="items.batch_number" readonly/>
          </FormItem>
          <FormItem :label="index === 0? '生产数量': ''">
            <Input class="width-200" v-model="items.num" readonly/>
          </FormItem>
          <FormItem :label="index === 0? '生产类型': ''">
            <Input class="width-200" v-model="items.produce_type" readonly/>
          </FormItem>
          <FormItem :label="index === 0? '标类型': ''">
            <Input class="width-200" v-model="items.mark_type" readonly/>
          </FormItem>
        </Row>
      </Form>

      <Spin size="large" fix v-if="spinShow"></Spin>

      <div class="modal-footer" slot="footer">
        <Button type="default" @click="exportModal.modal = false">取消</Button>
        <Button type="primary" @click="submit('exportModal', 'exportForm')">确认</Button>
      </div>
    </Modal>

  <!--  撤销生产  -->
    <Modal
    v-model="cancelProductModal.modal"
    title="撤销生产"
    width="1000">
      <Form inline ref="cancelProductForm" :model="cancelProductModal.form" :rules="rules">
        <div class="title">
          <span class="line"></span>
          <div class="title-text">撤销</div>
          <span class="line"></span>
        </div>

        <FormItem label="撤销人">
          <Input class="width-180" v-model="cancelProductModal.operator" readonly/>
        </FormItem>
        <FormItem label="意见" prop="opinion">
          <Input class="width-180" v-model="cancelProductModal.form.opinion" />
        </FormItem>

      <div class="modal-footer" slot="footer">
        <Button type="default" @click="cancelProductModal.modal = false">取消</Button>
        <Button type="primary" @click="submit('cancelProductModal', 'cancelProductForm')">确认</Button>
      </div>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import Cookies from 'js-cookie'
  let debounce = function (fn, delay) {
    let timerId
    return function () {
      if (timerId) clearTimeout(timerId)
      timerId = setTimeout(() => {
        fn.apply(this, arguments)
      }, delay)
    }
  }
  export default {
    data() {
      return {
        tableLoading: false,
        spinShow: false,
        currentTab: 'prenatalBatch',
        searchForm: {
          createdBy: '',
          createdAt: '',
          batchNumber: '',
          brand: '',
          planName: '',
          planNumber: '',
          supplier: '',
          processStatus: '',
          produceStatus: ''
        },
        brandList: [
          {value: 'WIS', label: 'WIS'},
          {value: '柏菲娜', label: 'BOOFINA'},
          {value: 'IRY', label: 'IRY'},
          {value: 'MVE', label: 'MVE'},
          {value: '魔渍', label: 'MOZI'},
          {value: 'KONO', label: 'KONO'},
          {value: '墨雪', label: 'MOXUE'},
        ],
        mkCodeList: [],
        prenatalBatch: {
          columns: [
            {type: 'selection', width: 60, align: 'center'},
            {title: '序号', type: 'index', width: 70, align: 'center'},
            {title: '批号创建人', key: 'created_by', align: 'center', minWidth: 100},
            {
              title: '创建时间',
              key: 'created_at',
              align: 'center',
              minWidth: 100,
              render: (h, {row}) => h('span', {}, this.$format(row.created_at, 'yyyy-MM-dd hh:mm:ss'))
            },
            {title: '所属计划名称', key: 'plan_name', align: 'center', minWidth: 110},
            {
              title: '品牌',
              key: 'brand',
              align: 'center',
              minWidth: 80,
              render: (h, {row}) => h('span', {}, this.getBrand(row.brand))
            },
            {title: '生产批次号', key: 'batch_number', align: 'center', minWidth: 100},
            {title: '生产数量', key: 'num', align: 'center', minWidth: 100},
            {
              title: '入库数量',
              key: 'quantity_inbound',
              align: 'center',
              minWidth: 100,
              render: (h, {row}) => h('a', {attrs: {href: 'javascript:void(0)'}}, row.quantity_inbound)
            },
            {
              title: '已出库数量',
              key: 'quantity_shipped',
              align: 'center',
              minWidth: 100,
              render: (h, {row}) => h('a', {attrs: {href: 'javascript:void(0)'}}, row.quantity_shipped)
            },
            {
              title: '生产状态', key: 'produce_status', align: 'center', minWidth: 100, render: (h, {row}) => {
               return h('span', {
                  style: {
                    color: row.produce_status === 'revoked' ? 'red' : ''
                  }
                }, this.getProduceStatus(row.produce_status))
              }
            },
            {
              title: '处理状态',
              key: 'process_status',
              align: 'center',
              minWidth: 100,
              render: (h, {row}) => h('span', {}, row.process_status === 'notExported' ? '未处理' : '已处理')
            },
            {
              title: '激活状态',
              key: 'enable_status',
              align: 'center',
              minWidth: 100,
              render: (h, {row}) => h('span', {}, row.enable_status === 'disabled' ? '未激活' : '已激活')
            },
            {title: '下单编号', key: 'supplier_order_number', align: 'center', minWidth: 100},
            {title: '生产供应商', key: 'supplier', align: 'center', minWidth: 100},
            {
              title: '生产类型',
              key: 'produce_type',
              align: 'center',
              minWidth: 100,
              render: (h, {row}) => h('span', {}, row.produce_type === 'prenatal' ? '产前样' : '大货样')
            },
            {
              title: '标类型',
              key: 'mark_type',
              align: 'center',
              minWidth: 100,
              render: (h, {row}) => h('span', {}, row.mark_type === 'P' ? '平标' : '卷标')
            },
          ],
          data: [],
          selection: [],
          pageProps: {
            page: 1,
            total: 0,
            perPage: 10
          },
        },
        exportModal: {
          modal: false,
          operator: '',
          generateQuantity: '',
          planName: '',
          brand: '',
          form: {
            ids: [],
            supplierOrderNumber: '',
            mkCode: '',
            packageName: '',
            orderQuantity: '',
            supplierId: '',
            supplier: '',
            processedNum: '',
            opinion: '',
            data: [
              {
                id: '',
                realNum: 0,
                opinion: ''
              },
              {
                id: '',
                realNum: 0,
                opinion: ''
              }
            ]
          }
        },
        cancelProductModal: {
          modal: false,
          operator: '',
          form: {
            opinion: '',
          },

        },
        rules: {
          supplierOrderNumber: [{required: true, message: '必填项', trigger: 'change'}],
          mkCode: [{required: true, message: '必填项', trigger: 'blur'}],
          opinion: [{required: true, message: '必填项', trigger: 'blur'}]
        }
      }
    },
    mounted() {
      let {planNumber, planName} = this.$route.params
      this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
      this.exportModal.operator = this.userInfo.realName
      this.cancelProductModal.operator = this.userInfo.realName
      this.exportModal.planNumber = planNumber
      this.searchForm.planName = planName
      this.getProductionBatch()
    },
    methods: {
      // Form 操作
      search() {
        this.getProductionBatch()
      },
      cancelProduction() {
        let selection = this.prenatalBatch.selection
        if(!selection.length) return this.$Message.error('一次只能撤销一条')
        let produce_status = selection[0].produce_status
        let process_status = selection[0].process_status
        let isCheck = produce_status === 'generated' && process_status === 'notExported'
        if(!isCheck) return this.$Message.error('已生成且未处理的才可撤销')
        this.cancelProductModal.modal = true

      },
      exportList() {
        let selection = this.prenatalBatch.selection
        if (!selection.length) return this.$Message.error('请选择')
        let firstId = selection[0].plan_id
        let brand = selection[0].brand
        let planName = selection[0].plan_name
        let iSsamePlan = selection.every(items => {
          console.log(items.plan_id)
          return items.plan_id === firstId
        })
        if (!iSsamePlan) return this.$Message.error('批量操作需是同一生产计划号')
        let ids = selection.map(items => items.id)
        let params = {
          ids,
          page: 1,
          perPge: 10000
        }

        this.exportModal.brand = brand
        this.exportModal.planName = planName
        this.exportModal.form.ids = ids
        this.exportModal.generateQuantity = selection.reduce((pre, cur) => {
          return pre + cur.num
        }, 0)
        // console.log(this.exportModal.generateQuantity)

        this.exportModal.modal = true
        this.spinShow = true
        this.$API.getProductionBatchExportDetail(params).then(res => {
          if (res.code === 0) {
            this.exportModal.form.data = res.data.list.map((items, index) => {
              items.index = ++index
              items.produce_type = items.produce_type === 'prenatal'? '产前样' : '大货样'
              items.mark_type = items.mark_type === 'P'? '平标' : '卷标'
              return items
            })
          }
        }).finally(() => {
          this.spinShow = false
        })

      },
      // table 选项操作
      selectionChange(selection) {
        this.prenatalBatch.selection = selection
      },
      dateChange(date) {
        // console.log(date)
        this.searchForm.createdAt = date
      },
      // 改变当前分页
      changePage(page, key) {
        this[key].page = page;
        // this.getList();
      },
      // 改变分页size
      changePageSize(pageSize, key) {
        this[key].perPage = pageSize;
        // this.getList();
      },
      // 计划列表参数
      planListParams(currentTab, form) {
        let {page, perPage} = this[currentTab].pageProps
        let params = {}
        for (let key in form) {
          if (form[key]) {
            params[key] = form[key]
          }
        }
        params.page = page
        params.perPage = perPage
        return params
      },
      getProductionBatch() {
        let currentTab = this.currentTab
        let params = this.planListParams(currentTab, this.searchForm)
        this.tableLoading = true
        this.$API.getProductionBatch(params).then(res => {
          if (res.code === 0) {
            let {list, count, page, perPage} = res.data
            this[currentTab].data = list
            this[currentTab].pageProps.page = page
            this[currentTab].pageProps.perPage = perPage
            this[currentTab].pageProps.total = count
          }
        }).finally(() => {
          this.tableLoading = false
        })
      },
      getMKCode: debounce(function () {
        let params = {}
        let supplierOrderNumber = this.exportModal.form.supplierOrderNumber
        if (!supplierOrderNumber) return
        params.order_no = supplierOrderNumber
        let token = Cookies.get('authorization')
        Cookies.set('authorization', 'Bearer nTYEm7oNMGChXer3AhIy4cBkTYcQfdUOdJJVuQ3X', {
          expires: 1
        })
        this.$API.getOrderPacking(params).then(res => {
          if (res.code === 200) {
            let data = res.data
            this.mkCodeList = data.map(items => {
              return {
                label: items.mk_code,
                value: items.mk_code
              }
            })
          }
          this.$API.getProductionBatchCountNum({orderNumber: supplierOrderNumber}).then(res => {
            console.log(res, 'getProductionBatchCountNum')
            if (res.code === 0) {
              this.exportModal.form.processedNum = res.data.processedNumber
            }
          }).catch(err => {
            Cookies.set('authorization', token, {
              expires: 1
            })
          }).finally(() => {
            Cookies.set('authorization', token, {
              expires: 1
            })
            console.log(Cookies.get('authorization'))
          })
        })

      }, 500),
      getSupplierInfo() {
        let params = {}
        let {supplierOrderNumber, mkCode} = this.exportModal.form
        // console.log(supplierOrderNumber, mkCode, 'change')
        if(!supplierOrderNumber) return
        if(!mkCode) return
        params.order_no = this.exportModal.form.supplierOrderNumber
        params.mk_code = this.exportModal.form.mkCode
        let token = Cookies.get('authorization')
        Cookies.set('authorization', 'Bearer nTYEm7oNMGChXer3AhIy4cBkTYcQfdUOdJJVuQ3X', {
          expires: 1
        })
        this.$API.getOrderPacking(params).then(res => {
          if (res.code === 200) {
            let data = res.data
            this.exportModal.form.packageName = data[0].packing
            this.exportModal.form.supplier = data[0].supplier
            this.exportModal.form.supplierId = data[0].supplier_id
            this.exportModal.form.orderQuantity = data[0].amount
          }
        }).finally(()=>{
            Cookies.set('authorization', token, {
              expires: 1
            })
          console.log(Cookies.get('authorization'))
        })
      },
      submit(modal, form) {
        this.$refs[form].validate(val => {
          if(!val) return
          if(modal === 'exportModal'){
            console.log(this.exportModal)
            return
          }
          console.log(this.cancelProductModal.form)
        })
      },
      // 筛选品牌
      getBrand(val) {
        let brands = {
          WIS: 'WIS',
          BOOFINA: '柏菲娜',
          IRY: 'IRY',
          MVE: 'MVE',
          MOZI: '魔渍',
          KONO: 'KONO',
          MOXUE: '墨雪'
        }
        return brands[val]
      },
      // 筛选生产状态
      getProduceStatus(val) {
        let produceStatus = {
          'generating': '生成中',
          'generated': '已生成',
          'revoked': '已撤销'
        }
        return produceStatus[val]
      }
    }
  }
</script>

<style lang="less" scoped>
  .width-120 {
    width: 120px;
  }

  .width-180 {
    width: 180px;
  }

  .width-200 {
    width: 200px;
  }

  .foot-page {
    padding: 10px;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    .title-text {
      flex-shrink: 0;
      padding: 0 10px;
    }

    .line {
      width: 100%;
      border-top: 1px solid #e9ebed;
    }
  }

  /deep/ .ivu-modal-header {
    padding-bottom: 0;
    border-bottom: none;
  }

  /deep/ .ivu-modal-body {
    padding-top: 0;
  }

  .modal-footer {
    text-align: right;
    position: relative;
  }

  .modal-footer /deep/ .left {
    position: absolute;
    left: 0;
  }
</style>