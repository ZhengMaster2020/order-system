<template>
  <div>
    <Card>
      <Row type="flex" justify="end" style="padding-bottom: 24px; margin-bottom: 24px; border-bottom: 1px solid #ccc; ">
        <Button type="error" class="margin-right-10" @click="delConfirm" v-if="pageTitle === 'edit'">删除</Button>
        <Button type="primary" @click="submit" :loading="submintLodaing">确认提交</Button>
      </Row>

      <Form :model="form" ref="form" inline :rules="rules">
        <FormItem label="渠道" prop="channelId">
          <Select clearable filterable placeholder="渠道" class="width-200" v-model="form.channelId">
            <Option v-for="channel in channelList" :value="channel.id" :key="channel.id">{{channel.channel}}</Option>
          </Select>
        </FormItem>
        <FormItem label="店铺名称" prop="shop">
          <Input class="width-200" v-model="form.shop"/>
        </FormItem>
        <FormItem label="关键词" prop="keywords">
          <Input class="width-200" v-model="form.keywords"/>
        </FormItem>
        <FormItem label="店铺排序" prop="sort">
          <InputNumber :min="0" class="width-200" v-model="form.sort"/>
        </FormItem>
        <FormItem label="是否显示" prop="isShow">
          <Select class="width-200" v-model="form.isShow">
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
        pageTitle: 'add',
        channelList: [],
        form: {
          channelId: '',
          keywords: '',
          shop: '',
          sort: null,
          isShow: '',
        },
        rules: {
          status: [{required: true, message: '必填项', trigger: 'change'}],
          channelId: [{required: true, type: 'number', message: '必填项', trigger: 'change'}],
          sort: [{required: true, type: 'number', message: '必填项', trigger: 'change'}],
          keywords: [{required: true, message: '必填项', trigger: 'blur'}],
          shop: [{required: true, message: '必填项', trigger: 'blur'}],
          isShow: [{required: true, message: '必填项', trigger: 'change'}],
        }
      }
    },
    methods: {
      submit() {
        this.$refs.form.validate(val => {
          if (!val) return

          this.submintLodaing = true
          let params = {
            data: {},
          }
          let apiKey = 'addStoreLists'
          let successMsg = '添加成功'
          for (let key in this.form) {
            !!this.form[key] && (params.data[key] = this.form[key])
          }

          if (this.channelId && this.shopId) {
            apiKey = 'editStoreLists'
            successMsg = '修改成功'
            params.channelId = this.channelId
            params.shopId = this.shopId
          }
          params.data.sort = this.form.sort == 0 ? 0 : this.form.sort

          // return console.log(params)
          this.$API[apiKey](params).then(res => {
            if (res.code === 0) {
              this.$Message.success(successMsg)
              this.$router.push('/inquire-anomaly-tracking/channel-store-settings')
            }
          }).finally(() => {
            this.submintLodaing = false
          })
        })
      },

      delConfirm() {
        this.$Modal.confirm({
          title: '删除',
          content: '<p>确认删除该店铺?</p>',
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            this.$API.delStoreLists(this.channelId, this.shopId).then(res => {
              res.code === 0 && this.$Message.success(res.msg)
              this.$router.push('/inquire-anomaly-tracking/channel-store-settings')
            })
          },
        })
      },

      getStoreDetail(channelId, shopId) {
        this.$API.getStoreListsDetail({channelId, shopId}).then(res => {
          if (res.code === 0) {
            for (let key in this.form) {
              this.form[key] = res.data[key]
            }
          }
        })
      },

      getChannelLists() {
        this.$API.getChannelLists({}).then(res => {
          if (res.code === 0) {
            this.channelList = res.data
          }
        })
      }
    },
    mounted() {
      let {channelId, shopId} = this.$route.query
      this.channelId = channelId
      this.shopId = shopId
      // console.log(channelId, shopId)
      if (!!channelId) {
        if (!!shopId) {
          this.getStoreDetail(channelId, shopId)
          this.pageTitle = 'edit'
        }
      }
      this.getChannelLists()
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