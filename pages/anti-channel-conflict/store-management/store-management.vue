<template>
  <div class="code-management">
    <Row class="search-form" type="flex" justify="space-between">
        <Col :md="12">
          <Input v-model="searchData.securityCode" placeholder="加工厂名称" style="width:150px" clearable @on-enter="getList('search')"/>
          <Input v-model="searchData.securityCode" placeholder="负责人" style="width:150px" clearable @on-enter="getList('search')"/>
          <Button type="primary" icon="ios-search" @click="getList('search')">查询</Button>
        </Col>
        <Col :md="3" style="textAlign:right">
          <Button type="primary" @click="openModal('add')">新增仓库</Button>
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
    <!-- 新增、编辑仓库弹窗 -->
    <Modal
      v-model="addData.modal"
      title="新增"
      @on-cancel="closeModal()"
      :styles="{top: '50%',marginTop: '-250px'}"
    >
      <div style="padding: 0 75px 0 50px">
        <Form ref="addData.data" :model="addData.data" :rules="addDataRule" label-position="right" :label-width="100">
          <FormItem label="仓库名称：" prop="name">
            <Input v-model="addData.data.name" clearable/>
          </FormItem>
          <FormItem label="负责人：" prop="passwork">
            <Input v-model="addData.data.passwork" clearable/>
          </FormItem>
          <FormItem label="所在地址：" prop="passworks">
            <Input v-model="addData.data.passworks" clearable/>
          </FormItem>
        </Form> 
      </div>   
      <div slot="footer">
          <Button type="primary" :loading="addData.loading" @click="handleSubmit('addData.data')" >确定</Button>
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
            {key: 'serialCode', title: '仓库名称', align: 'center'},
            {key: 'securityCode', title: '所在地址', align: 'center'},
            {key: 'securityCodeLink', title: '负责人', maxWidth: 120, align: 'center'},
            {
              key: 'securityCodeLink',
              title: '出入库详情',
              maxWidth: 130,
              align: 'center',
              render: (h, params) => {
                return h('Tooltip', {
                  props: {
                    content: '查看',
                    placement: 'top'
                  }
                }, [ h('Button', {
                    props: {
                      type: 'primary',
                      icon: 'md-search'
                    },
                    on: {
                      'click': () => {
                        this.$router.push('view-data')
                      }
                    }
                  })
                ])
              }
            },
            {
              key: 'do',
              title: '操作',
              maxWidth: 180,
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
                        this.openModal('edit')
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
          modalType: '',
          data: {
            name: '',
            passwork: '',
            passworks: '',
            tel: '',
            type: '',
          }
        },
        addDataRule: {
          name: [
              { required: true, message: '请输入仓库名称', trigger: 'blur' }
          ],
          passwork: [
              { required: true, message: '请输入负责人', trigger: 'blur' }
          ],
          passworks: [
              { required: true, message: '请输入所在地址', trigger: 'blur' }
          ]
        },
        pageProps: { // 列表分页属性
          page: 1,
          perPage: 10,
          totalCount: 0
        }
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
      },
      // 打开弹出
      openModal (type) {
        this.addData.modal = true
        this.addData.modalType = type
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
