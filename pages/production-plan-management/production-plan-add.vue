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
          <InputNumber :min="1"
                       :precision='0'
                       :formatter="value => `${value}`.replace(/\B(?=(?:\d{3})+\b)/g, ',')"
                       :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                       class="width-200"
                       v-model="form.generationCount"/>
        </FormItem>
        <FormItem label="计划年份" prop="year">
          <Select v-model="form.year" clearable placeholder="计划年份" class="width-200">
            <Option v-for="year in lastFiveYears" :key="year.label" :value="year.label">{{year.value}}</Option>
          </Select>
        </FormItem>
        <FormItem label="Q季度" prop="quarter">
          <Select v-model="form.quarter" clearable placeholder="品牌" class="width-200">
            <Option v-for="quarter in quarterList" :key="quarter.label" :value="quarter.label">{{quarter.value}}
            </Option>
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
        <div style="position: relative">
          <div class="necessary margin-bottom-10 font-size-12">计划文件</div>
          <Upload
          ref="upload"
          :show-upload-list="false"
          :action="fileUploadURL"
          :headers="fileUploadHeaders"
          :max-size="15360"
          :default-file-list="form.fileItems"
          :before-upload="beforeUpload"
          :on-success="onsuccess"
          :on-remove="onremove"
          :on-error="onerror"
          :on-exceeded-size="onOverMaxSize"
          >
            <Button icon="ios-cloud-upload-outline" class="margin-bottom-10">Upload files</Button>
          </Upload>
          <div class="upload-list" v-for="(file, index) in form.fileItems" :key="index">
            <a :href="file.url" :download="file.name" class="download-link">
              {{file.name}}
            </a>
            <Icon type="ios-trash-outline" size="14" class="icon-trash" @click="onremove(index)"/>
          </div>
        </div>
      </Form>
      <Spin size="large" fix v-if="spinShow"></Spin>
    </Card>
  </div>
</template>

<script>
  import Cookies from 'js-cookie'
  import {SERVER_BASE_URL} from '../../api/config'

  export default {
    data() {
      return {
        applicant: '',
        submintLodaing: false,
        spinShow: false,
        fileUrl: '',
        fileUploadURL: `${SERVER_BASE_URL}traceability/traceability/upload`,
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
          brand: [{required: true, message: '必填项', trigger: 'change'}],
          isFillPlan: [{required: true, message: '必填项', trigger: 'change'}],
          quarter: [{required: true, message: '必填项', trigger: 'change'}],
          year: [{required: true, message: '必填项', trigger: 'change'}],
          generationCount: [{required: true, type: 'number', message: '必填项', trigger: 'blur'}],
          planName: [{required: true, message: '必填项', trigger: 'change'}],
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
          if (val) {
            if (this.form.fileItems.length <= 0) return this.$Message.error('请上传计划文件')
            // return console.log(this.form)
            this.submintLodaing = true
            if (this.id) {
              let param = {
                id: this.id,
                params: this.form
              }
              this.$API.editProductionPlan(param).then(res => {
                if (res.code === 0) {
                  this.$Message.success('编辑成功')
                  this.$router.push('/production-plan-management/production-plan-list')
                }
              }).finally(() => {
                this.submintLodaing = false
              })
              return
            }
            this.$API.addProductionPlan(this.form).then(res => {
              if (res.code === 0) {
                this.$Message.success('添加成功')
                this.$router.push('/production-plan-management/production-plan-list')
              }
            }).finally(() => {
              this.submintLodaing = false
            })
          }
        })
      },
      beforeUpload(file) {
        const check = /.txt$/.test(file.name)
         if (check) {
          this.$Message.warning('请不要上传txt格式的文件')
        }
        return !check;
      },
      onsuccess(response) {
        if (response.code === 0) {
          this.$Message.success(response.msg)
          this.form.fileItems.push(response.data.fileUploadVo)
        } else {
          this.$Message.error('上传有误')
        }
      },
      onerror(error) {
        this.$Message.error('上传失败')
      },
      onOverMaxSize() {
        this.$Message.warning('上传文件最大15m')
      },
      onremove(index) {
        this.form.fileItems.splice(index, 1)
      },
      // 获取后五年
      getLastFiveYear() {
        let currentYear = new Date().getFullYear()
        this.lastFiveYears.push({
          label: currentYear + '',
          value: currentYear + ''
        })
        for (let i = 0; i < 5; i++) {
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
          if (res.code === 0) {
            this.form.nextId = res.data.list.filter(users => users.realName === this.form.nextBy)[0].id
          }
        })
      },
      // 获取计划详情
      getProductionPlanDetail(id) {
        this.spinShow = true
        this.$API.getProductionPlanDetail({id}).then(res => {
          if (res.code === 0) {
            let data = res.data
            let year = data.planNumber.match(/\d{4}/g)[0]
            this.form.year = year
            this.applicant = data.createdBy
            for (let key in this.form) {
              if (data[key]) {
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
      if (this.id) {
        this.getProductionPlanDetail(this.id)
      }
    }
  }
</script>

<style scoped>
  .width-200 {
    width: 200px;
  }

  .font-size-12 {
    font-size: 12px;
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

  .upload-list {
    padding: 3px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .upload-list:hover {
    background-color: #f3f3f3;
  }

  .upload-list .download-link {
    display: block;
    flex: 1;
  }

  .upload-list .icon-trash {
    display: none;
  }

  .upload-list:hover .icon-trash {
    display: block;
    cursor: pointer;
  }
</style>