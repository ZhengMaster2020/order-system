<template>
  <div>
    <Card>
      <Row type="flex" justify="end" style="padding-bottom: 24px; margin-bottom: 24px; border-bottom: 1px solid #ccc; ">
        <Button type="primary" @click="submit" :loading="submintLodaing">确认提交</Button>
      </Row>

      <Form :model="form" ref="form" inline :rules="rules">
        <FormItem label="创建人">
          <Input class="width-200" v-model="form.createdBy" readonly/>
        </FormItem>
        <FormItem label="排序" prop="sort">
          <InputNumber :min="1" class="width-200" v-model="form.sort"/>
        </FormItem>
        <FormItem label="状态">
          <InputNumber :min="1" class="width-200" v-model="form.status" readonly/>
          <!--          <Select clearable placeholder="状态" class="width-200" v-model="form.status">-->
          <!--            <Option value="enable">启用</Option>-->
          <!--            <Option value="disable">停用</Option>-->
          <!--          </Select>-->
        </FormItem>
        <Row>
          <FormItem label="问题" prop="problem">
            <Input style="width: 810px" v-model="form.problem"/>
          </FormItem>
        </Row>
        <Row>
          <FormItem label="解答" prop="answer">
            <Input style="width: 810px" v-model="form.answer"/>
          </FormItem>
        </Row>
      </Form>
      <Spin size="large" fix v-if="spinShow"></Spin>
    </Card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        applicant: '',
        submintLodaing: false,
        spinShow: false,
        form: {
          sort: 1,
          problem: '',
          answer: '',
          createdBy: '',
          status: '',
        },
        rules: {
          sort: [{required: true, type: 'number', message: '必填项', trigger: 'blur'}],
          problem: [{required: true, message: '必填项', trigger: 'blur'}],
          answer: [{required: true, message: '必填项', trigger: 'blur'}],
        }
      }
    },
    methods: {
      submit() {
        this.$refs.form.validate(val => {
          if (val) {
            this.submintLodaing = true
            let params = {
              data: {},
              id: ''
            }
            let apiKey = 'addFQAlist'
            let successMsg = '添加成功'
            let paramsKeys = ['sort', 'problem', 'answer']
            paramsKeys.forEach(key => {
              !!this.form[key] && (params.data[key] = this.form[key])
            })
            // return console.log(this.form)
            if (this.id) {
              apiKey = 'editFQAlist'
              successMsg = '修改成功'
              params.id = this.id
            }
            this.$API[apiKey](params).then(res => {
              if (res.code === 0) {
                this.$Message.success(successMsg)
                this.$router.push('/inquire-anomaly-tracking/FQA-setting')
              }
            }).finally(() => {
              this.submintLodaing = false
            })
          }
        })
      },

      // 获取计划详情
      getFQADetail(id) {
        this.$API.getFQAlistDetail({id}).then(res => {
          if (res.code === 0) {
            for (let key in this.form) {
              this.form[key] = res.data[key]
            }
          }
        })
      }
    },
    mounted() {
      let userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
      this.form.createdBy = userInfo.realName
      this.id = this.$route.query.id
      !!this.id && this.getFQADetail(this.id)
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

</style>