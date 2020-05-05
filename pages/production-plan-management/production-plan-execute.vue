<template>
  <div>
    <Card>
      <Row type="flex" justify="end" style="padding-bottom: 24px; margin-bottom: 24px; border-bottom: 1px solid #ccc; ">
        <Button type="primary" @click="submit" :loading="submintLodaing">确认执行</Button>
      </Row>
      <Form inline ref="form" :model="baseicData" :rules="rules">
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
            <Input class="width-195" v-model="baseicData.reivewer" readonly/>
          </FormItem>
          <FormItem label="审核时间" prop="planStatus">
            <Input style="width: 200px" v-model="baseicData.planStatus" readonly/>
          </FormItem>
          <FormItem label="审核意见" prop="opinion">
            <Input style="width: 200px" v-model="baseicData.opinion" readonly/>
          </FormItem>
        </Row>

        <Row class="margin-bottom-10 title">指定生产批次号</Row>
        <Row class="margin-bottom-10">
          <Col span="4" class="necessary font-size-12">生成类型</Col>
          <Col span="4" class="necessary font-size-12">批次数量</Col>
          <Col span="4" class="necessary font-size-12">剩余可生成数量</Col>
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
              <Input class="width-195" v-model="batchData.num"/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem>
              <Input class="width-195" v-model="batchData.remainingQuantity"/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem :prop="'form.' + index + '.markType'" :rules='rules.markType'>
              <Select v-model="batchData.markType" clearable class="width-195">
                <Option value="prenatal">产前样</Option>
                <Option value="goods">大货样</Option>
              </Select>
            </FormItem>
          </Col>

          <Col span="4">
            <FormItem>
              <Button shape="circle" icon="md-add" @click="addBatchData"></Button>
              <Button shape="circle" icon="md-remove" @click="delBatchData(index)"></Button>
            </FormItem>
          </Col>
        </Row>
      </Form>

    </Card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        submintLodaing: false,
        baseicData: {
          reivewer: '',
          planStatus: '',
          createdBy: '',
          opinion: '',
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
          form: [
            {
              planId: '',
              produceType: '',
              num: '',
              remainingQuantity: '',
              markType: '',
            }
          ],
        },

        rules: {
          produceType: [{required: true, message: '必填项', trigger: 'change'}],
          num: [{required: true, message: '必填项', trigger: 'blur'}],
          markType: [{required: true, message: '必填项', trigger: 'change'}],
        }
      }
    },
    methods: {
      submit() {
        this.$refs.form.validate(val => {
          if (val) {
            // if(this.form.fileItems.length < 0 ) return this.$Message.error('请上传计划文件')
            // this.submintLodaing = true
            // this.$API.addProductionPlan(this.form).then(res => {
            //   if(res.code === 0){
            //     this.$Message.success(res.message)
            //     this.$router.push('production-plan-management/production-plan-list')
            //   }
            // }).finally(() => {
            //   this.submintLodaing = false
            // })
          }
        })
      },
      addBatchData(){
        this.baseicData.form.push({
          planId: '',
          produceType: '',
          num: '',
          remainingQuantity: '',
          markType: '',
        })
      },
      delBatchData(index){
        this.baseicData.form.splice(index, 1)
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