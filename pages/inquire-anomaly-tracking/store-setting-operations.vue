<template>
  <div>
    <Card>
      <Row type="flex" justify="end" style="padding-bottom: 24px; margin-bottom: 24px; border-bottom: 1px solid #ccc; ">
        <Button type="error" :loading="submintLodaing" class="margin-right-10">删除</Button>
        <Button type="primary" @click="submit" :loading="submintLodaing">确认提交</Button>
      </Row>

      <Form :model="form" ref="form" inline :rules="rules">
        <FormItem label="状态" prop="status">
          <Select clearable placeholder="状态" class="width-200" v-model="form.status">
            <Option value="enable">启用</Option>
            <Option value="disable">停用</Option>
          </Select>
        </FormItem>
        <FormItem label="店铺名称">
          <Input class="width-200" v-model="form.name"/>
        </FormItem>
        <FormItem label="关键词">
          <Input class="width-200" v-model="form.keyword"/>
        </FormItem>
        <FormItem label="店铺排序" >
          <InputNumber :min="1" class="width-200" v-model="form.generationCount"/>
        </FormItem>
        <FormItem label="是否显示">
          <Select clearable class="width-200">
            <Option value="yes">是</Option>
            <Option value="no">否</Option>
          </Select>
        </FormItem>
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
          nextBy: '李时达',
          remark: '',
          fileItems: [],
          brand: '',
          isFillPlan: 'no',
          quarter: '',
          status: '',
          keyword: '',
          name: '',
          sort: '',
        },
        rules: {
          status: [{required: true, message: '必填项', trigger: 'change'}],
          sort: [{required: true, message: '必填项', trigger: 'blur'}],
          name: [{required: true, message: '必填项', trigger: 'blur'}],
        }
      }
    },
    methods: {
      submit() {
        this.$refs.form.validate(val => {
          if (val) {
            // return console.log(this.form)
            this.submintLodaing = true
            if (this.id) {
              let param = {
                id: this.id,
                params: this.form
              }
              // this.$API.editProductionPlan(param).then(res => {
              //   if (res.code === 0) {
              //     this.$Message.success('编辑成功')
              //     this.$router.push('/production-plan-management/production-plan-list')
              //   }
              // }).finally(() => {
              //   this.submintLodaing = false
              // })
              return
            }
            // this.$API.addProductionPlan(this.form).then(res => {
            //   if (res.code === 0) {
            //     this.$Message.success('添加成功')
            //     this.$router.push('/production-plan-management/production-plan-list')
            //   }
            // }).finally(() => {
            //   this.submintLodaing = false
            // })
          }
        })
      },



      // 获取计划详情
      getProductionPlanDetail(id) {

      }
    },
    mounted() {
      this.id = this.$route.query.id
      // this.getNextByUser()
      if (this.id) {
        // this.getProductionPlanDetail(this.id)
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

</style>