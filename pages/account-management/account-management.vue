<template>
  <div class="code-management">
    <Row class="search-form" type="flex" justify="space-between">
        <Col :md="12">
          <Input v-model="searchData.securityCode" placeholder="账号名称" style="width:150px" clearable @on-enter="getList('search')"/>
          <Select v-model="searchData.type" style="width:150px" placeholder="账号类型">
            <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Button type="primary" icon="ios-search" @click="getList('search')">查询</Button>
        </Col>
        <Col :md="3" style="textAlign:right">
          <Button type="primary" @click="addData.modal = true">增加账号</Button>
        </Col>
    </Row>
    <Row class="margin-top-10">
      <Table :columns="listData.columns" :data="listData.data" size="small" border highlight-row :loading="listData.loading"></Table>
      <div style="margin: 10px;overflow: hidden">
        <div class="pages-L">共 {{pageProps.totalCount}} 条</div>
        <div style="float: right;">
          <Page size="small" :total="pageProps.totalCount" :current="pageProps.page" show-sizer show-elevator @on-change="changePage" @on-page-size-change="changePageSize"></Page>
        </div>
      </div>
    </Row>
    <!-- 增加账号弹窗 -->
    <Modal
      v-model="addData.modal"
      title="新增账号"
      @on-cancel="closeModal()"
      :styles="{top: '50%',marginTop: '-300px'}"
    >
      <div style="padding: 0 75px 0 50px">
        <Form ref="addData.data" :model="addData.data" :rules="addDataRule" label-position="right" :label-width="100">
          <FormItem label="账号名称：" prop="name">
            <Input v-model="addData.data.name" clearable/>
          </FormItem>
          <FormItem label="密码：" prop="passwork">
            <Input v-model="addData.data.passwork" clearable number/>
          </FormItem>
          <FormItem label="确认密码：" prop="passworks">
            <Input v-model="addData.data.passworks" clearable number/>
          </FormItem>
          <FormItem label="绑定手机号：" prop="tel">
            <Input v-model="addData.data.tel" clearable number/>
          </FormItem>
          <FormItem label="账号类型：" prop="type">
            <Select v-model="addData.data.type" placeholder="请选择">
              <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Select v-model="addData.data.code" placeholder="输入搜索关键词···" filterable>
              <Option v-for="item in accountList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Form> 
      </div>   
      <div slot="footer">
          <Button type="primary" :loading="addData.loading" @click="handleSubmit('addData.data')" >添加</Button>
          <Button type="default" :loading="addData.loading" @click="closeModal()">取消</Button>
      </div>
    </Modal>
  </div>  
</template>
<script>
  export default {
    data () {
      return {
        searchData: {
          securityCode: '',
          type: ''
        },
        listData: {
          columns: [
            {key: 'index', type: 'index', title: '序号', width: 65, align: 'center'},
            {key: 'serialCode', title: '账号名称', align: 'center'},
            {key: 'securityCode', title: '密码', align: 'center'},
            {key: 'securityCodeLink', title: '绑定手机', align: 'center'},
            {key: 'brand', title: '账号类型', align: 'center'},
            {
              key: 'do',
              title: '操作',
              maxWidth: 230,
              align: 'center',
              render: (h, params) => {
                return h('div',{
                    style: {
                      padding: '5px 0'
                    }
                  }, [
                  h('Tooltip', {
                    props: {
                      content: '编辑',
                      placement: 'top'
                    }
                  }, [
                    h('Button', {
                    props: {
                      type: 'primary',
                      icon: 'md-create'
                    },
                    style: {
                      marginRight: '8px'
                    },
                    on: {
                      'click': () => {
                        //this.productId = params.row.id
                        alert('1212')
                      }
                    }
                  })
                  ]),
                  h('Poptip', {
                    props: {
                      confirm: true,
                      title: '您确认删除这条内容吗？',
                      transfer: true
                    },
                    on: {
                      'on-ok': () => {
                          // let param = {
                          //   id: params.row.id
                          // }
                          // this.$API.deleteProduct(param).then((res) => {
                          //   this.$Message.success('删除成功')   
                          //   this.getList()                       
                          // })
                          alert('sds')
                      }
                    }
                  },[
                    h('Button', {
                    props: {
                      icon: 'md-trash',
                      disabled: !!params.row.code
                    }
                  })
                  ])
                ])
              }
            }
          ],
          data: [{serialCode: 'sd'}]
        },
        addData: {
          loading: false,
          modal: false,
          data: {
            name: '',
            passwork: '',
            passworks: '',
            tel: '',
            type: ''
          }
        },
        addDataRule: {
          name: [
              { required: true, message: '请输入账号名称', trigger: 'blur' }
          ],
          passwork: [
              { required: true, type: 'number', message: '请输入密码', trigger: 'blur' }
          ],
          passworks: [
              { required: true, type: 'number', message: '请输入密码', trigger: 'blur' }
          ],
          tel: [
              { required: true, type: 'number', message: '请输入手机号', trigger: 'blur' }
          ],
          type: [
              { required: true, message: '请选择账号类型', trigger: 'change' }
          ]
        },
        pageProps: { // 列表分页属性
          page: 1,
          perPage: 10,
          totalCount: 0
        },
        typeList: [
          {
            value: '加工厂',
            label: '加工厂'
          },
          {
            value: '仓库',
            label: '仓库'
          },{
            value: '合作商',
            label: '合作商'
          }
        ],
        accountList: []
      }
    },
    mounted() {
      //this.getList()
    },
    methods:{
      changePage (e) {
        this.pageProps.page = e
        //this.getList();
      },
      changePageSize (e) {
        this.pageProps.perPage = e
        //this.getList();
      },
      // 查询数据
      getList () {
        let params = this.searchData
        params.page = this.pageProps.page
        params.perPage = this.pageProps.perPage
        this.$API.securityCodeQuery(params).then((res) => {
          //console.log(res)
          if(res.code === 0){
            this.listData.data = res.data.list
            this.pageProps.totalCount = res.data.count
          }
        })
        this.pageProps.page = 1
        this.pageProps.perPage = 10
      },
      // 校验弹框
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
            if (valid) {
                this.$Message.success('Success!')
                addData.modal=false
            } else {
                this.$Message.error('请填写信息')
            }
        })
      },
      // 校验重置
      handleReset (name) {
        this.$refs[name].resetFields()
      },
      // 关闭弹窗
      closeModal () {
        this.handleReset('addData.data')
        this.addData.modal = false
      }
    }
  }
</script>

<style lang="less">
.code-management {
  .count {
    padding: 20px 0px 20px 30px;
    border: 2px solid #eee;
    border-radius: 10px;
  }
  .ivu-form-item {
    display: inline-block;
    margin-bottom: 0px;
  }
  .search-form {
    background-color: #eee;
    margin-top: 10px;
    padding: 10px 10px;
  }
}
</style>
