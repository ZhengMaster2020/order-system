<template>
  <div class="code-management">
    <Row class="search-form" type="flex" justify="space-between">
        <Col :md="12">
          <Input v-model="searchData.accountName" placeholder="账号名称" style="width:150px" clearable @on-enter="getList('search')"/>
          <Select v-model="searchData.accountType" style="width:150px" placeholder="账号类型" clearable>
            <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Button type="primary" icon="ios-search" @click="getList('search')">查询</Button>
        </Col>
        <Col :md="3" style="textAlign:right">
          <Button type="primary" @click="openModel('新增账号')">增加账号</Button>
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
    <!-- 增加、编辑账号弹窗 -->
    <Modal
      v-model="addData.modal"
      :title="modalType"
      @on-cancel="closeModal()"
      :styles="{top: '50%',marginTop: '-300px'}"
    >
      <div style="padding: 0 75px 0 50px">
        <Form ref="addData.data" :model="addData.data" :rules="addDataRule" label-position="right" :label-width="100">
          <FormItem label="账号名称：" prop="accountName">
            <Input v-model="addData.data.accountName" clearable/>
          </FormItem>
          <FormItem label="密码：" prop="accountPassword">
            <Input v-model="addData.data.accountPassword" type="password" clearable/>
          </FormItem>
          <FormItem label="确认密码：" prop="accountPasswordConfirm">
            <Input v-model="addData.data.accountPasswordConfirm" type="password" clearable/>
          </FormItem>
          <FormItem label="绑定手机号：" prop="accountTelephone">
            <Input v-model="addData.data.accountTelephone" clearable number/>
          </FormItem>
          <FormItem label="账号类型：" prop="accountType">
            <Select v-model="addData.data.accountType" placeholder="请选择账号类型，再搜索">
              <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <div v-if="isShowSelect">
          <FormItem>
            <Select v-model="addData.data.accountTypeName" placeholder="输入搜索关键词···" filterable remote :remote-method="getAccount" :loading="loadingSelect" :disabled="!addData.data.accountType">
              <Option v-for="item in accountList" :value="item.name" :key="item.name">{{ item.name }}</Option>
            </Select>
          </FormItem>
          </div>
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
        loadingSelect: false,
        isShowSelect: true,
        modalType: '',
        searchData: {
          accountName: '',
          accountType: ''
        },
        listData: {
          columns: [
            {key: 'index', type: 'index', title: '序号', width: 65, align: 'center'},
            {key: 'accountName', title: '账号名称', align: 'center'},
            {key: 'accountPassword', title: '密码', align: 'center'},
            {key: 'accountTelephone', title: '绑定手机', align: 'center'},
            {
              key: 'accountType',
              title: '账号类型',
              align: 'center',
              render: (h, params) => {
                return h('div', this.formatType(params.row.accountType, params.row.accountTypeName))
              }
            },
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
                        this.openModel('编辑')
                          this.getDetail(params.row.id)
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
                          let param = {
                            id: params.row.id
                          }
                          this.$API.accountNumberDelete(param).then((res) => {
                            this.$Message.success('删除成功')
                            this.getList()
                          })
                      }
                    }
                  },[
                    h('Button', {
                    props: {
                      icon: 'md-trash'
                    }
                  })
                  ])
                ])
              }
            }
          ],
          data: [],
          loading: false
        },
        addData: {
          loading: false,
          modal: false,
          data: {
            accountName: '',
            accountPassword: '',
            accountPasswordConfirm: '',
            accountTelephone: '',
            accountType: '',
            accountTypeName: ''
          }
        },
        addDataRule: {
          accountName: [
              { required: true, message: '请输入账号名称', trigger: 'blur' }
          ],
          accountPassword: [
              { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          accountPasswordConfirm: [
              { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          accountTelephone: [
              { required: true, type: 'number', message: '请输入手机号', trigger: 'blur' }
          ],
          accountType: [
              { required: true, message: '账号类型', trigger: 'change' }
          ]
        },
        pageProps: { // 列表分页属性
          page: 1,
          perPage: 10,
          totalCount: 0
        },
        typeList: [
          {
            value: 'processingFactory',
            label: '加工厂'
          },
          {
            value: 'warehouse',
            label: '仓库'
          },{
            value: 'cooperative',
            label: '合作商'
          }
        ],
        accountList: []
      }
    },
    mounted() {
      this.getList()
    },
    watch: {
      'addData.data.accountType': function(newVal, oldVal){
      console.log("TCL: oldVal", oldVal)
      console.log("TCL: newVal", newVal)
      if(!!oldVal){
        this.addData.data.accountTypeName = ''
        }
      }
    },
    methods:{
      changePage (e) {
        this.pageProps.page = e
        this.getList();
      },
      changePageSize (e) {
        this.pageProps.perPage = e
        this.getList();
      },
      // 查询数据
      getList (type) {
        if(type == 'search'){
          this.pageProps.page = 1
          this.pageProps.perPage = 10
        }
        let params = this.searchData
        params.page = this.pageProps.page
        params.perPage = this.pageProps.perPage
        this.listData.loading = true
        this.$API.accountNumberList(params).then((res) => {
          if(res.code === 0){
            this.listData.data = res.data.data
            this.pageProps.totalCount = res.data.count
            this.pageProps.page = res.data.page
            this.pageProps.perPage = res.data.perPage
          }
        }).finally(()=>{
          this.listData.loading = false
        })
      },
      // 校验弹框
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
            if (valid) {
                  this.addAccount()
            } else {
                this.$Message.error('请填写信息')
            }
        })
      },
      // 校验重置
      handleReset (name) {
        this.$refs[name].resetFields()
        this.addData.data.accountTypeName = ''
      },
      // 关闭弹窗
      closeModal () {
        this.handleReset('addData.data')
        this.addData.modal = false
      },
      //打开弹窗
      openModel (title) {
        this.modalType = title
        this.addData.modal = true
      },
      getAccount (query) {
          if (query !== '') {
            this.loadingSelect = true
            let params = {}
            params.searchName = query
            params.type = this.addData.data.accountType
            this.$API.accountNumberSearch(params).then((res) => {
              if(res.code == 0){
                this.accountList = res.data
              }
            })
          }
          this.loadingSelect = false
      },
      //添加
      addAccount () {
        if(!this.addData.data.accountTypeName){
          this.$Message.error('请填写账号类型名称')
          return
        }
        let params = JSON.parse(JSON.stringify(this.addData.data))
        params.accountTelephone = String(params.accountTelephone)
        this.addData.loading = true
        if (this.modalType == '新增账号') {
          this.$API.accountNumberAdd(params).then((res)=>{
              this.addData.modal=false
              this.$Message.success('添加成功')
              this.handleReset('addData.data')
              this.getList()
          }).finally(() => {
            this.addData.loading = false
          })
        } else {
          this.$API.accountNumberEdit(params).then((res)=>{
              this.addData.modal=false
              this.$Message.success('编辑成功')
              this.handleReset('addData.data')
              this.getList()
          }).finally(() => {
            this.addData.loading = false
          })
        }
      },
      // 详情
      getDetail (id) {
        this.$API.accountNumberDetail({id:id}).then((res) => {
          if(res.code == 0){
          this.addData.data = res.data
          this.addData.data.accountTelephone = Number(this.addData.data.accountTelephone)
          this.isShowSelect = false
          }
        }).finally(() => {
          this.isShowSelect = true
        })
      },
      // 列表，账号类型
      formatType (type, name) {
        let typeAccount = ''
        switch(type)
          {
              case 'cooperative':
                  typeAccount = '合作商'
                  break
              case 'warehouse':
                  typeAccount = '仓库'
                  break
              case 'processingFactory':
                  typeAccount = '加工厂'
                  break
          }
          if(typeAccount!=''){
            return  `${typeAccount}:${name}`
          }
      },
      // 类型改变清空名字
      clearName(e){
      console.log("TCL: clearName -> e", e)
        
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
