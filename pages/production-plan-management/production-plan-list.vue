<template>
  <div>
    <Card>
<!--      Form-->
      <Form ref="searchForm" :model="searchForm" inline>
       <Row type="flex" justify="space-between">
         <Col>
           <FormItem prop="name">
             <Input v-model="searchForm.createdBy" placeholder="申请人" class="width-120" />
           </FormItem>
           <FormItem prop="name">
             <Input v-model="searchForm.planNumber" placeholder="计划编号" class="width-120" />
           </FormItem>
           <FormItem prop="name">
             <Select v-model="searchForm.brand" clearable placeholder="品牌" class="width-120">
               <Option v-for="brand in brandList" :key="brand.label" :value="brand.label">{{brand.value}}</Option>
             </Select>
           </FormItem>
           <FormItem prop="name">
             <Select v-model="searchForm.planStatus" clearable placeholder="计划状态" class="width-120">
               <Option v-for="status in planStatus" :key="status.label" :value="status.label">{{status.value}}</Option>
             </Select>
           </FormItem>
           <FormItem prop="name">
             <Input v-model="searchForm.planName" placeholder="计划名称" class="width-120" />
           </FormItem>
           <FormItem prop="user">
             <Select v-model="searchForm.isFillPlan" clearable placeholder="是否补Q计划" class="width-120">
               <Option value="yes">是</Option>
               <Option value="no">否</Option>
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
              <Button type="primary" @click="addPlan">添加计划</Button>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="reviewPlan">经理审核</Button>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="executePlan">执行计划</Button>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="finishedPlan">执行完毕</Button>
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

    <!-- TODO: 权限判断 经理审核  -->
    <Modal
    v-model="reviewModal.modal"
    title="计划审核"
    width="1000">
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
        <FormItem label="计划编号">
          <Input class="width-180" v-model="reviewModal.data.planNumber" readonly/>
        </FormItem>
        <FormItem label="品牌">
          <Input class="width-180" v-model="reviewModal.data.brand" readonly/>
<!--          <Select v-model="reviewModal.brand" clearable placeholder="品牌" class="width-180" readonly>-->
<!--            <Option v-for="brand in brandList" :key="brand.label" :value="brand.label">{{brand.value}}</Option>-->
<!--          </Select>-->
        </FormItem>
        <FormItem label="计划数量">
          <Input class="width-180" v-model="reviewModal.data.generationCount" readonly/>
        </FormItem>
        <FormItem label="季度">
          <Input class="width-180" v-model="reviewModal.data.quarter" readonly/>
<!--          <Select v-model="reviewModal.quarter" clearable placeholder="品牌" class="width-180" readonly>-->
<!--            <Option v-for="brand in quarterList" :key="brand.label" :value="brand.label">{{brand.value}}</Option>-->
<!--          </Select>-->
        </FormItem>
        <FormItem label="是否补Q计划">
          <Input class="width-180" v-model="reviewModal.data.isFillPlan" readonly/>
<!--          <Select v-model="reviewModal.isFillPlan" clearable placeholder="是否补Q计划" class="width-180" readonly>-->
<!--            <Option value="yes">是</Option>-->
<!--            <Option value="no">否</Option>-->
<!--          </Select>-->
        </FormItem>
        <FormItem label="计划名称">
          <Input class="width-180" v-model="reviewModal.data.planName" readonly/>
        </FormItem>
        <FormItem label="计划文件">
          <div style="padding-top: 33px">
            <a href="javascript:;" v-for="(file, index) in reviewModal.data.fileItems" :key="index">{{file.name}}</a>
          </div>

        </FormItem>

        <div class="title">
          <span class="line"></span>
          <div class="title-text">审核</div>
          <span class="line"></span>
        </div>
        <FormItem label="经办人">
          <Input class="width-180" v-model="reviewModal.reivewer" />
        </FormItem>
        <FormItem label="审核" prop="planStatus">
          <RadioGroup v-model="reviewModal.form.planStatus" class="width-120">
            <Radio label="pendingExecuted">通过</Radio>
            <Radio label="overrule">驳回</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="审核意见" prop="opinion">
          <Input style="width: 200px" v-model="reviewModal.form.opinion" />
        </FormItem>


      </Form>
      <div class="modal-footer" slot="footer">
        <Button type="default" >取消</Button>
        <Button type="primary" @click="submit">确认</Button>
      </div>
    </Modal>

    <!-- TODO: 权限判断 执行完毕  -->
    <Modal
    v-model="finishedModal.modal"
    title="执行完毕"
    width="1000">
      <Form inline ref="finishedForm" :model="finishedModal.form" :rules="rules">
        <div class="title">
          <span class="line"></span>
          <div class="title-text">基础信息</div>
          <span class="line"></span>
        </div>

        <FormItem label="申请人">
          <Input class="width-180" v-model="finishedModal.name" readonly/>
        </FormItem>
        <FormItem label="申请时间">
          <Input class="width-180" v-model="finishedModal.name" readonly/>
        </FormItem>
        <FormItem label="计划编号">
          <Input class="width-180" v-model="finishedModal.name" readonly/>
        </FormItem>
        <FormItem label="品牌">
          <Input class="width-180" v-model="finishedModal.name" readonly/>
<!--          <Select v-model="finishedModal.brand" clearable placeholder="品牌" class="width-180" readonly>-->
<!--            <Option v-for="brand in brandList" :key="brand.label" :value="brand.label">{{brand.value}}</Option>-->
<!--          </Select>-->
        </FormItem>
        <FormItem label="计划数量">
          <Input class="width-180" v-model="finishedModal.name" readonly/>
        </FormItem>
        <FormItem label="季度">
          <Input class="width-180" v-model="finishedModal.name" readonly/>
<!--          <Select v-model="finishedModal.quarter" clearable placeholder="品牌" class="width-180" readonly>-->
<!--            <Option v-for="brand in quarterList" :key="brand.label" :value="brand.label">{{brand.value}}</Option>-->
<!--          </Select>-->
        </FormItem>
        <FormItem label="是否补Q计划">
          <Input class="width-180" v-model="finishedModal.name" readonly/>
<!--          <Select v-model="finishedModal.isFillPlan" clearable placeholder="是否补Q计划" class="width-180" readonly>-->
<!--            <Option value="yes">是</Option>-->
<!--            <Option value="no">否</Option>-->
<!--          </Select>-->
        </FormItem>
        <FormItem label="计划名称">
          <Input class="width-180" v-model="finishedModal.name" readonly/>
        </FormItem>
        <FormItem label="计划文件">
          <div style="padding-top: 33px">
            <a href="javascript:;"> sdd.doc</a>
            <a href="javascript:;"> sdd.doc</a>
            <a href="javascript:;"> sdd.doc</a>
            <a href="javascript:;"> sdd.doc</a>
          </div>

        </FormItem>

        <div class="title">
          <span class="line"></span>
          <div class="title-text">关闭计划</div>
          <span class="line"></span>
        </div>
        <FormItem label="经办人">
          <Input class="width-180" v-model="finishedModal.name" />
        </FormItem>
        <FormItem label="实际执行数量">
          <InputNumber class="width-180" v-model="finishedModal.realNum" />
        </FormItem>
        <FormItem label="关闭意见" prop="opinion">
          <Input style="width: 200px" v-model="finishedModal.form.opinion" />
        </FormItem>


      </Form>
      <div class="modal-footer" slot="footer">
        <Button type="default" >取消</Button>
        <Button type="primary" @click="submit">确认</Button>
      </div>
    </Modal>

    <!-- TODO: 权限判断 状态详情  -->
    <Modal
    v-model="statusDetailModal.modal"
    title="计划审核"
    width="1000">
      <Form inline>
        <div class="title">
          <span class="line"></span>
          <div class="title-text">基础信息</div>
          <span class="line"></span>
        </div>

        <FormItem label="申请人">
          <Input class="width-180" v-model="statusDetailModal.form.base.createdBy" readonly/>
        </FormItem>
        <FormItem label="申请时间">
          <Input class="width-180" v-model="statusDetailModal.form.base.createdAt" readonly/>
        </FormItem>
        <FormItem label="计划编号">
          <Input class="width-180" v-model="statusDetailModal.form.base.planNumber" readonly/>
        </FormItem>
        <FormItem label="品牌">
          <Input class="width-180" v-model="statusDetailModal.form.base.brand" readonly/>
        </FormItem>
        <FormItem label="计划数量">
          <Input class="width-180" v-model="statusDetailModal.form.base.generationCount" readonly/>
        </FormItem>
        <FormItem label="季度">
          <Input class="width-180" v-model="statusDetailModal.form.base.quarter" readonly/>
        </FormItem>
        <FormItem label="是否补Q计划">
          <Input class="width-180" v-model="statusDetailModal.form.base.isFillPlan" readonly/>
        </FormItem>
        <FormItem label="计划名称">
          <Input class="width-180" v-model="statusDetailModal.form.base.planName" readonly/>
        </FormItem>
        <FormItem label="计划文件">
          <div style="padding-top: 33px">
            <a href="javascript:;" v-for="(file, index) in statusDetailModal.form.base.fileItems" :key="index">{{file.name}}</a>
          </div>

        </FormItem>
      <!-- ------------------------ 经理审核 ----------------------------------- -->
        <div class="title">
          <span class="line"></span>
          <div class="title-text">经理审核</div>
          <span class="line"></span>
        </div>
        <FormItem label="经办人">
          <Input class="width-180" v-model="statusDetailModal.form.managerReview.createdBy" readonly/>
        </FormItem>
        <FormItem label="审核">
          <Input class="width-180" v-model="statusDetailModal.form.managerReview.planStatus" readonly/>
        </FormItem>
        <FormItem label="审核意见">
          <Input style="width: 200px" v-model="statusDetailModal.form.managerReview.opinion" readonly/>
        </FormItem>
        <!-- ------------------------ 执行情况 ----------------------------------- -->
        <div class="title">
          <span class="line"></span>
          <div class="title-text">执行情况</div>
          <span class="line"></span>
        </div>
        <FormItem label="总执行数量">
          <Input class="width-180" v-model="statusDetailModal.form.situation.batchNum" readonly/>
        </FormItem>
        <FormItem label="批次数量">
          <Input style="width: 200px" v-model="statusDetailModal.form.situation.batchCount" readonly/>
        </FormItem>
        <FormItem >
          <div style="padding-top: 33px">
            <a href="javascript:;" >查看批次记录</a>
          </div>
        </FormItem>

        <!-- ------------------------ 关闭信息 ----------------------------------- -->
        <div class="title">
          <span class="line"></span>
          <div class="title-text">关闭信息</div>
          <span class="line"></span>
        </div>
        <FormItem label="执行人">
          <Input class="width-180" v-model="statusDetailModal.form.managerReview.createdBy" readonly/>
        </FormItem>
        <FormItem label="实际执行数量">
          <Input class="width-180" v-model="statusDetailModal.form.managerReview.planStatus" readonly/>
        </FormItem>
        <FormItem label="关闭意见">
          <Input style="width: 200px" v-model="statusDetailModal.form.managerReview.opinion" readonly/>
        </FormItem>
      </Form>
      <div class="modal-footer" slot="footer">
        <Button type="default" >取消</Button>
        <Button type="primary" @click="submit">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        currentTab: 'planList',
        quarterList: [
          {value: 'Q1', label: 'Q1'},
          {value: 'Q2', label: 'Q2'},
          {value: 'Q3', label: 'Q3'},
          {value: 'Q4', label: 'Q4'},
        ],
        brandList: [
          {value: 'WIS', label: 'WIS'},
          {value: '柏菲娜', label: 'BOOFINA'},
          {value: 'IRY', label: 'IRY'},
          {value: 'MVE', label: 'MVE'},
          {value: '魔渍', label: 'MOZI'},
          {value: 'KONO', label: 'KONO'},
          {value: '墨雪', label: 'MOXUE'},
        ],
        planStatus: [
          {value: '待经理审核', label: 'pendingManagerReview'},
          {value: '待执行', label: 'pendingExecuted'},
          {value: '已驳回', label: 'overrule'},
          {value: '执行中', label: 'executing'},
          {value: '执行完毕', label: 'finished'},
        ],
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
            {
              title: '计划状态',
              key: 'planStatus',
              align: 'center',
              render: (h, {row}) => {
                let text = this.getPlanStatus(row.planStatus)
                return h('a', {
                  attrs: {
                    href: 'javascript:void(0)'
                  },
                  on: {
                    click: () => {
                      this.statusDetailModal.modal = true
                      this.getPlanStatusDetail(row.id)
                    }
                  }
                }, text)
              }
            },
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
        },
        reviewModal: {
          modal: false,
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
          modal: false,
          name: 'aa',
          isFillPlan: '',
          brand: '',
          quarter: '',
          form: {
            id: '',
            realNum: 0,
            opinion: ''
          }
        },
        statusDetailModal: {
          modal: false,
          form: {
            base: {
              createdBy: '',
              createdAt: '',
              planNumber: '',
              brand: '',
              generationCount: '',
              quarter: '',
              isFillPlan: '',
              planName: '',
              fileItems: '',
            },
            managerReview: {
              createdBy: '',
              planStatus: '',
              opinion: '',
            },
            situation: {
              batchNum: '',
              batchCount: '',
            },
            finished: {
              createdBy: '',
              planStatus: '',
              opinion: '',
            },
          }
        },
        rules: {
          planStatus: [{ required: true, message: '必填项', trigger: 'blur' }],
          opinion: [{ required: true, message: '必填项', trigger: 'blur' }]
        }
      }
    },
    created() {
      this.getPlanList()

    },
    methods: {
      // Form 操作
      search(){
        this.getPlanList()
      },

      // 操作验证
      operationVerify(){
        let msg
        if(this.planList.selection.length <= 0) return msg = '请选择一条数据'
        if(this.planList.selection.length > 1) return msg = '一次只能操作一条数据'
      },
      // 添加计划
      addPlan() {
        let msg = this.operationVerify()
        if(msg) return this.$Message.error(msg)
        this.$router.push({
          name: 'production-plan-management/production-plan-add',
          params: {
            id: this.planList.selection[0].id
          },
        })
      },
      // 经理审核
      reviewPlan() {
        let msg = this.operationVerify()
        if(msg) return this.$Message.error(msg)
        this.reviewModal.modal = true
        let id = this.planList.selection[0].id
        let userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
        this.reviewModal.reivewer = userInfo.realName
        this.reviewModal.form.id = id

        // 计划详情
        this.$API.getProductionPlanDetail({id}).then(res => {
          if(res.code === 0){
            let data = res.data
            for(let key in this.reviewModal.data){
              if(data[key]){
                this.reviewModal.data[key] = data[key]
              }
            }
            this.reviewModal.form.opinion = data.ext.opinion
            this.reviewModal.form.planStatus = data.ext.planStatus
          }
          // console.log(this.reviewModal)
        })
      },
      // 执行计划
      executePlan(){
        let msg = this.operationVerify()
        if(msg) return this.$Message.error(msg)
        this.$router.push({
          name: 'production-plan-management/production-plan-execute',
          params: {
            id: this.planList.selection[0].id
          },
        })
      },
      // 执行完毕
      finishedPlan() {
        this.finishedModal.modal = true
        // 获取用户信息
        let userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
        this.finishedModal.name = userInfo.realName
        // 获取用户信息
        if(this.planList.selection.length > 1) return this.$Message.error('一次只能操作一条数据')
      },
      // modal 确认操作
      submit(modal){
        if(modal === 'reviewModal') {

        }
        if(modal === 'finishedPlan') {

        }
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
      // 计划列表参数
      planListParams(currentTab, form){
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
      getPlanList() {
        let currentTab = this.currentTab
        let params = this.planListParams(currentTab, this.searchForm)
        this.$API.getProductionPlan(params).then(res => {
          if(res.code === 0){
            let { list, count, page, perPage } = res.data
            this[currentTab].data = list
            this[currentTab].pageProps.page = page
            this[currentTab].pageProps.perPage = perPage
            this[currentTab].pageProps.total = count
          }
        })
      },
      // 获取详情
      getPlanStatusDetail(id) {
        // this.statusDetailModal.form base managerReview situation finished

        this.$API.getPlanStatusDetail({id}).then(res => {
          if(res.code === 0) {
            let { detail, situation, log } = res.data
            for(let key in this.statusDetailModal.form.base){
              if(detail[key]){
                this.statusDetailModal.form.base[key] =detail[key]
              }
            }
            for(let key in this.statusDetailModal.form.situation){
              console.log(situation[0][key])
              if(situation[0][key] != null){
                this.statusDetailModal.form.base[key] = situation[key]
              }
            }
            if(log){
              log.forEach(items => {
                this.statusDetailModal.form[items.title].createdBy = items.createdBy
                this.statusDetailModal.form[items.title].opinion = items.ext.opinion
              })
            }
          }
        })
      },
      // 筛选计划状态
      getPlanStatus(val){
        let text
        if(val === 'pendingManagerReview' ) return text = '待经理审核'
        if(val === 'pendingExecuted' ) return text = '待执行'
        if(val === 'overrule' ) return text = '已驳回'
        if(val === 'executing' ) return text = '执行中'
        if(val === 'finished' ) return text = '执行完毕'
        if(val === '' ) return text = ''
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
  .line{
    width: 100%;
    border-top: 1px solid #e9ebed;
  }
}
.modal-footer{
  text-align: right;
  position: relative;
}
.modal-footer /deep/ .left{
  position: absolute;
  left: 0;
}
</style>