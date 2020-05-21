<template>
  <div>
    <Card>
      <Row type="flex" justify="end" style="padding-bottom: 24px; margin-bottom: 24px; border-bottom: 1px solid #ccc; ">
        <Button type="error" class="margin-right-10" @click="delConfirm" v-if="pageTitle === 'edit'">删除</Button>
        <Button type="primary" @click="submit" :loading="submintLodaing">确认提交</Button>
      </Row>
      <Form :model="form" ref="form" inline :rules="rules">
        <FormItem label="创建人" prop="applicant">
          <Input class="width-200" v-model="form.createdBy" readonly/>
        </FormItem>
        <FormItem label="渠道名称" prop="channel">
          <Input class="width-200" v-model="form.channel"/>
        </FormItem>
        <FormItem label="渠道排序" prop="sort">
          <InputNumber :min="0" class="width-200" v-model="form.sort"/>
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
        pageTitle: 'add',
        form: {
          createdBy: '',
          channel: '',
          sort: null,
        },
        rules: {
          channel: [{required: true, message: '必填项', trigger: 'change'}],
          sort: [{required: true, type: 'number', message: '必填项', trigger: 'change'}],
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
            let apiKey = 'addChannelLists'
            let successMsg = '添加成功'
            let paramsKeys = ['sort', 'channel']
            paramsKeys.forEach(key => {
              !!this.form[key] && (params.data[key] = this.form[key])
            })
            if (this.id) {
              apiKey = 'editChannelLists'
              successMsg = '修改成功'
              params.id = this.id
            }

            this.$API[apiKey](params).then(res => {
              if (res.code === 0) {
                this.$Message.success(successMsg)
                this.$router.push('/inquire-anomaly-tracking/channel-store-settings')
              }
            }).finally(() => {
              this.submintLodaing = false
            })
          }
        })
      },

      delConfirm() {
        this.$Modal.confirm({
          title: '删除',
          content: '<p>确认删除该渠道?</p>',
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            this.$API.delChannelLists(this.id).then(res => {
              res.code === 0 && this.$Message.success(res.msg)
              this.$router.push('/inquire-anomaly-tracking/channel-store-settings')
            })
          },
        })
      },

      // 获取计划详情
      getChannelDetail(id) {
        this.$API.getChannelListsDetail({id}).then(res => {
          if (res.code === 0) {
            for (let key in this.form) {
              this.form[key] = res.data[key]
            }
          }
        })
      }
    },
    mounted() {
      this.id = this.$route.query.id

      if (this.id) {
        this.getChannelDetail(this.id)
        this.pageTitle = 'edit'
        return
      }
      let userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
      this.form.createdBy = userInfo.realName
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