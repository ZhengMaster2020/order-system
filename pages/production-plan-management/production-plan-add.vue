<template>
  <div>
    <Card>
      <Row type="flex" justify="end" style="padding-bottom: 24px; margin-bottom: 24px; border-bottom: 1px solid #ccc; ">
        <Button type="primary" @click="submit" :loading="submintLodaing">确认提交</Button>
      </Row>

      <Form :model="form" ref="form" inline :rules="rules">
        <FormItem label="申请人">
          <Input class="width-200" v-model="applicant"/>
        </FormItem>
        <FormItem label="品牌" prop="brand">
          <Select v-model="form.brand" clearable placeholder="品牌" class="width-200">
            <Option v-for="brand in brandList" :key="brand.label" :value="brand.label">{{brand.value}}</Option>
          </Select>
        </FormItem>
        <FormItem label="计划数量" prop="generationCount">
          <InputNumber :min="1" class="width-200" v-model="form.generationCount"/>
        </FormItem>
        <FormItem label="计划年份" prop="year">
          <Select v-model="form.year" clearable placeholder="计划年份" class="width-200">
            <Option v-for="year in lastFiveYears" :key="year.label" :value="year.label">{{year.value}}</Option>
          </Select>
        </FormItem>
        <FormItem label="Q季度" prop="quarter">
          <Select v-model="form.quarter" clearable placeholder="品牌" class="width-200">
            <Option v-for="quarter in quarterList" :key="quarter.label" :value="quarter.label">{{quarter.value}}</Option>
          </Select>
        </FormItem>
        <FormItem label="计划名称" prop="planName">
          <Input class="width-200" v-model="form.planName"/>
        </FormItem>
        <FormItem label="是否补Q计划" prop="isFillPlan">
          <Select v-model="form.isFillPlan" clearable placeholder="是否补Q计划" class="width-200">
            <Option value="yes">是</Option>
            <Option value="no">否</Option>
          </Select>
        </FormItem>
        <FormItem label="下级经办人">
          <Input class="width-200" v-model="form.nextBy" readonly/>
        </FormItem>
        <FormItem label="备注">
          <Input style="width: 420px" v-model="form.remark"/>
        </FormItem>
        <div>
          <div class="necessary margin-bottom-10">计划文件</div>
            <Upload
            multiple
            :action="fileUploadURL"
            :headers="fileUploadHeaders"
            :on-success="onsuccess"
            :on-error="onerror"
            >
              <Button icon="ios-cloud-upload-outline">Upload files</Button>
            </Upload>
        </div>
      </Form>
      <Spin size="large" fix v-if="spinShow"></Spin>
    </Card>
  </div>
</template>

<script>
  import Cookies from 'js-cookie'
  import { SERVER_BASE_URL } from '../../api/config'
  export default {
    data() {
      return {
        applicant: '',
        submintLodaing: false,
        spinShow: false,
        fileUploadURL: `${ SERVER_BASE_URL }traceability/traceability/upload`,
        fileUploadHeaders: {
          Authorization: Cookies.get('authorization')
        },
        lastFiveYears: [],
        form: {
          generationCount: 1,
          year: '',
          planName: '',
          nextId: '',
          nextBy: '李时达',
          remark: '',
          fileItems: [],
          brand: '',
          isFillPlan: '',
          quarter: '',
        },
        rules: {
          brand: [{ required: true, message: '必填项', trigger: 'change' }],
          isFillPlan: [{ required: true, message: '必填项', trigger: 'change' }],
          quarter: [{ required: true, message: '必填项', trigger: 'change' }],
          year: [{ required: true, message: '必填项', trigger: 'change' }],
          generationCount: [{ required: true, type: 'number', message: '必填项', trigger: 'blur' }],
          planName: [{ required: true, message: '必填项', trigger: 'change' }],
        },
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
      }
    },
    methods: {
      submit() {
        this.$refs.form.validate(val => {
          if(val) {
            if(this.form.fileItems.length <= 0 ) return this.$Message.error('请上传计划文件')
            // return console.log(this.form)
            this.submintLodaing = true
            if(this.id){
              let param = {
                id: this.id,
                params: this.form
              }
              this.$API.editProductionPlan(param).then(res => {
                if(res.code === 0){
                  this.$Message.success(res.msg)
                  this.$router.push('/production-plan-management/production-plan-list')
                }
              }).finally(() => {
                this.submintLodaing = false
              })
            }
            this.$API.addProductionPlan(this.form).then(res => {
              if(res.code === 0){
                this.$Message.success(res.msg)
                this.$router.push('/production-plan-management/production-plan-list')
              }
            }).finally(() => {
              this.submintLodaing = false
            })
          }
        })
      },
      onsuccess( response) {
        if(response.code === 0){
          this.form.fileItems.push(response.data.fileUploadVo)
        }else {
          this.$Message.error('上传有误')
        }
      },
      onerror( error ) {
        this.$Message.error('上传失败')
      },
      // 获取前五年
      getLastFiveYear(){
        let currentYear = new Date().getFullYear()
        this.lastFiveYears.push({
          label: currentYear + '',
          value: currentYear + ''
        })
        for(let i = 0; i < 4; i++){
          currentYear++
          this.lastFiveYears.push({
            label: currentYear + '',
            value: currentYear + ''
          })
        }
      },
      // 获取下级经办人
      getNextByUser() {
        // 先默认 李时达
        this.$API.searchUSers({name: this.form.nextBy}).then(res => {
          if(res.code === 0){
            this.form.nextId = res.data.list.filter(users => users.realName === this.form.nextBy)[0].id
          }
        })
      },
      // 获取计划详情
      getProductionPlanDetail(id) {
        this.spinShow = true
        this.$API.getProductionPlanDetail({id}).then(res => {
          if(res.code === 0){
            let data = res.data
            for(let key in this.form) {
                if(data[key]){
                  this.form[key] = data[key]
                }
            }
          }
        }).finally(() => {
          this.spinShow = false
        })
      }
    },
    mounted() {
      let userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
      this.id = this.$route.query.id
      this.applicant = userInfo.realName
      this.getNextByUser()
      this.getLastFiveYear()
      if(this.id){
        this.getProductionPlanDetail(this.id)
      }
    }
  }
</script>

<style scoped>
.width-200 {
  width: 200px;
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