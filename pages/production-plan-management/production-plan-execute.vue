<template>
  <div>
    <Card>
      <Row type="flex" justify="end" style="padding-bottom: 24px; margin-bottom: 24px; border-bottom: 1px solid #ccc; ">
        <Button type="primary" @click="submit" :loading="submintLodaing">确认执行</Button>
      </Row>
      <Form inline ref="form" :model="baseicData">
        <Row class="title">基础信息</Row>
        <FormItem label="申请人">
          <Input class="width-195" v-model="baseicData.createdBy" readonly/>
        </FormItem>
        <FormItem label="申请时间">
          <Input class="width-195" v-model="baseicData.createdAt" readonly/>
        </FormItem>
        <FormItem label="计划编号">
          <Input class="width-195" v-model="baseicData.planNumber" readonly/>
        </FormItem>
        <FormItem label="品牌">
          <Input class="width-195" v-model="baseicData.brand" readonly/>
        </FormItem>
        <FormItem label="计划数量">
          <Input class="width-195" v-model="baseicData.generationCount" readonly/>
        </FormItem>
        <FormItem label="季度">
          <Input class="width-195" v-model="baseicData.quarter" readonly/>
        </FormItem>
        <FormItem label="是否补Q计划">
          <Input class="width-195" v-model="baseicData.isFillPlan" readonly/>
        </FormItem>
        <FormItem label="计划名称">
          <Input class="width-195" v-model="baseicData.planName" readonly/>
        </FormItem>
        <FormItem label="计划文件">
          <div style="padding-top: 33px">
            <a href="javascript:;" v-for="(file, index) in baseicData.fileItems" :key="index">{{file.name}}</a>
          </div>
        </FormItem>

        <Row>
          <FormItem label="审核人">
            <Input class="width-195" v-model="baseicData.auditBy" readonly/>
          </FormItem>
          <FormItem label="审核时间">
            <Input style="width: 200px" v-model="baseicData.auditAt" readonly/>
          </FormItem>
          <FormItem label="审核意见">
            <Input style="width: 200px" v-model="baseicData.opinion" readonly/>
          </FormItem>
        </Row>

        <Row class="margin-bottom-10 title">
          <Col>
            指定生产批次号
          </Col>
          <Col>
            <FormItem label="剩余可生成数量" class="margin-top-10">
              <Input class="width-195" v-model="baseicData.remainingQuantity" readonly/>
            </FormItem>
          </Col>
        </Row>
        <Row class="margin-bottom-10">
          <Col span="4" class="necessary font-size-12">生成类型</Col>
          <Col span="4" class="necessary font-size-12">批次数量</Col>
          <Col span="4" class="necessary font-size-12">标类型</Col>
        </Row>
        <Row v-for="(batchData, index) in baseicData.form" :key="index">
          <Col span="4">
            <FormItem :prop="'form.' + index + '.produceType'" :rules='rules.produceType'>
              <Select v-model="batchData.produceType" clearable class="width-195">
                <Option value="prenatal">产前样</Option>
                <Option value="goods">大货样</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem :prop="'form.' + index + '.num'" :rules='rules.num'>
              <InputNumber :min="0" :max="realNum" class="width-195" v-model="batchData.num" @on-change="(val) => {numchange(val, index)}"/>
            </FormItem>
          </Col>

          <Col span="4">
            <FormItem :prop="'form.' + index + '.markType'" :rules='rules.markType'>
              <Select v-model="batchData.markType" clearable class="width-195">
                <Option value="P">平标</Option>
                <Option value="J">卷标</Option>
              </Select>
            </FormItem>
          </Col>

          <Col span="4">
            <FormItem>
              <Button shape="circle" icon="md-add" @click="addBatchData" v-if="index === 0"></Button>
              <Button shape="circle" icon="md-remove" @click="delBatchData(index)" v-else></Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
<!--      <Spin size="large" fix v-if="spinShow"></Spin>-->
    </Card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        submintLodaing: false,
        // spinShow: false,
        baseicData: {
          auditBy: '',
          auditAt: '',
          opinion: '',

          createdBy: '',
          createdAt: '',
          planNumber: '',
          planName: '',
          generationCount: '',
          isFillPlan: '',
          brand: '',
          quarter: '',
          fileItems: [],
          remainingQuantity: 0,
          form: [
            {
              planId: '',
              produceType: '',
              num: 0,
              markType: '',
            }
          ],
        },
        realNum: 0,
        rules: {
          produceType: [{required: true, message: '必填项', trigger: 'change'}],
          num: [{required: true, type: 'number', message: '必填项', trigger: 'blur'}],
          markType: [{required: true, message: '必填项', trigger: 'change'}],
        }
      }
    },
    mounted() {
      this.planId = this.$route.query.id
      this.getProductionPlanDetail(this.planId)
    },
    methods: {
      submit() {
        this.$refs.form.validate(val => {
          if (val) {
            this.baseicData.form.map(batchDatas => {
              batchDatas.planId = this.planId
              batchDatas.remainingQuantity = this.baseicData.remainingQuantity
            })
            // console.log(this.baseicData.form)
            let param = {
              id: this.planId,
              params: {
                batchData: this.baseicData.form
              }
            }
            this.$API.executeProductionPlan(param).then(res => {
              if(res.code === 0) {
                this.$Message.success(res.msg)
                this.$router.push('/production-plan-management/production-plan-list')
              }
            })
          }
        })
      },
      addBatchData(){
        this.baseicData.form.push({
          planId: '',
          produceType: '',
          num: 0,
          markType: '',
        })
      },
      delBatchData(index){
        if(this.baseicData.form.length <= 1) return
        this.baseicData.form.splice(index, 1)
        let total = this.getTotalNum(this.baseicData.form)
        this.baseicData.remainingQuantity = this.realNum - total
      },
      getTotalNum(arr){
        let totalNum = 0
        arr.forEach(items => {
          totalNum += items.num
        })
        return totalNum
      },
      numchange(val, index){
        // console.log(val, index)
        let total = this.getTotalNum(this.baseicData.form)
        this.baseicData.remainingQuantity = this.realNum - total
      },
      // 计划详情
      getProductionPlanDetail(id) {
        this.$API.getProductionPlanDetail({id}).then(res => {
          if(res.code === 0){
            let data = res.data
            // this.realNum = data.realNum
            this.realNum = 100
            for(let key in this.baseicData) {
              if(key !== 'form'){
                if(data[key]){
                  this.baseicData[key] = data[key]
                  this.baseicData.opinion = data.ext.opinion
                  this.baseicData.planStatus = data.ext.planStatus
                  // this.baseicData.remainingQuantity = data.realNum
                  this.baseicData.remainingQuantity = 100
                }
              }
            }
          }
        })
        //   .finally(() => {
        //   this.spinShow = false
        // })
      }

    },
  }
</script>

<style scoped>
.width-195 {
  width: 195px;
}
.font-size-12 {
  font-size: 12px;
}
.title {
  font-size: 16px;
  font-weight: 700;
}
.necessary:before {
  content: '*';
  display: inline-block;
  margin-right: 4px;
  line-height: 1;
  font-family: SimSun;
  font-size: 12px;
  color: #ed4014;
}
</style>