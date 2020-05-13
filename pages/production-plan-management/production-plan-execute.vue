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
            <a :href="file.url" :download="file.name" class="download-link" v-for="(file, index) in baseicData.fileItems" :key="index">{{file.name}}</a>
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
              <Select v-model="batchData.produceType" class="width-195" @on-change="(val) => {markTypeChange(val, index)}">
                <Option value="prenatal">产前样</Option>
                <Option value="goods">大货样</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem :prop="'form.' + index + '.num'" :rules='rules.num'>
              <InputNumber :min="0"
                           :max="batchData.remainingQuantity"
                           :precision='0'
                           :formatter="value => `${value}`.replace(/\B(?=(?:\d{3})+\b)/g, ',')"
                           :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                           class="width-195" v-model="batchData.num"
                           @on-change="(val) => {numChange(val, index)}"/>
            </FormItem>
          </Col>

          <Col span="4">
            <FormItem :prop="'form.' + index + '.markType'" :rules='rules.markType'>
              <Select v-model="batchData.markType"
                      class="width-195"
                      >
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
              remainingQuantity: 0,
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
            let isCheck = this.baseicData.form.find(items => items.num === 0)
            if(isCheck) return this.$Message.warning('批次数量不可为 0')
            let remainingQuantity = this.baseicData.remainingQuantity
            this.baseicData.form.map(batchDatas => {
              batchDatas.planId = this.planId
              batchDatas.remainingQuantity = remainingQuantity
            })
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
        if(this.baseicData.remainingQuantity <= 0) return
        this.baseicData.remainingQuantity -= 1
        let total = this.getTotalNum(this.baseicData.form)
        this.baseicData.form.push({
          planId: '',
          produceType: '',
          num: 0,
          remainingQuantity: this.realNum - total <= 0 ? 0 : this.realNum - total,
          markType: '',
        })
      },
      delBatchData(index){
        this.baseicData.form.splice(index, 1)
        let total = this.getTotalNum(this.baseicData.form)
        this.baseicData.remainingQuantity = this.realNum - total
      },
      getTotalNum(arr){
        let totalNum = 0
        arr.forEach(items => totalNum += items.num )
        return totalNum
      },
      numChange(val, index){
        let total = this.getTotalNum(this.baseicData.form)
        let prenatalMax = 10000
        let goodsMax = 1000000
        let remainNum = this.realNum - total <= 0 ? 0 : this.realNum - total
        this.baseicData.remainingQuantity = remainNum
        this.baseicData.form.map((items, indx) => {
          if(items.produceType === 'prenatal'){
            items.remainingQuantity = (remainNum + items.num) >= prenatalMax ? prenatalMax : (remainNum + items.num)
          }else if(items.produceType === 'goods'){
            items.remainingQuantity = (remainNum + items.num) >= goodsMax ? goodsMax : (remainNum + items.num)
          }else {
            items.remainingQuantity = remainNum + items.num
          }
          if(index === indx){
            items.num = val > remainNum + items.num ? remainNum + items.num : val
          }
        })
      },
      markTypeChange(markType, index) {
        let prenatalMax = 10000
        let goodsMax = 1000000
        let total = this.getTotalNum(this.baseicData.form)
        let remainNum = this.realNum - total <= 0 ? 0 : this.realNum - total
        let data = this.baseicData.form[index]
        if(data.produceType === 'prenatal'){
          data.remainingQuantity = data.num >= prenatalMax ? prenatalMax : remainNum
          data.num = data.num >= prenatalMax ? prenatalMax : data.num
        }else if(data.produceType === 'goods'){
          data.remainingQuantity = data.num >= goodsMax ? goodsMax : remainNum
          data.num = data.num >= goodsMax ? goodsMax : data.num
        }
        let newTotal = this.getTotalNum(this.baseicData.form)
        let newRemainNum = this.realNum - newTotal <= 0 ? 0 : this.realNum - newTotal
        this.baseicData.remainingQuantity = newRemainNum

      },
      // 计划详情
      getProductionPlanDetail(id) {
        let total = this.getTotalNum(this.baseicData.form)
        this.$API.getProductionPlanDetail({id}).then(res => {
          if(res.code === 0){
            let data = res.data
            let generaNum = Math.ceil(data.generationCount * 110 / 100)
            this.realNum = generaNum - data.realNum
            for(let key in this.baseicData) {
              if(key !== 'form'){
                if(data[key]){
                  this.baseicData[key] = data[key]
                }
              }
              this.baseicData.opinion = data.ext.opinion
              this.baseicData.planStatus = data.ext.planStatus
              this.baseicData.remainingQuantity = this.realNum - total
              this.baseicData.form[0].remainingQuantity = this.realNum - total
              this.baseicData.auditAt = this.$format(data.auditAt, 'yyyy-MM-dd hh:mm:ss')
              this.baseicData.isFillPlan = data.isFillPlan === 'yes' ? '是' : '否'
            }
          }
        })
      }

    },
  }
</script>

<style lang="less" scoped>
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

  .download-link {
    margin-right: 20px;
    &:hover {
     background-color: #f3f3f3;
    }
  }
</style>