<template>
  <div class="code-management">
    <Row slot="title" class="count">
        <Col span="2" order="4">
          <p>123456</p>
          <p>生成总数</p>
        </Col>
        <Col span="2" order="4">
          <p>1242</p>
          <p>最近生成数量</p>
        </Col>
    </Row>
    <Row class="search-form">
      <Col :sm="24">
        <Form ref="searchData" :model="searchData" class="searchData">
          <FormItem label="生成日期" :label-width="80">
            <DatePicker v-model="searchData.startTime" type="date" placeholder="开始时间" style="width: 200px"></DatePicker>
          </FormItem>
          <FormItem>
            <span>-</span>
          </FormItem>
          <FormItem>
            <DatePicker v-model="searchData.endTime" type="date" placeholder="结束时间" style="width: 200px"></DatePicker>
          </FormItem>
          <FormItem>
            <Input v-model="searchData.brand" placeholder="品牌" clearable @on-enter="getList('searchData')"></Input>
          </FormItem>
          <FormItem>
            <Input v-model="searchData.userName" placeholder="操作人员" clearable @on-enter="getList('searchData')"></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" icon="ios-search" @click="getList('searchData', 'noPage')">查询</Button>
          </FormItem>
          <FormItem style="float:right">
            <Col span="12"><Button type="primary" icon="md-repeat" @click="generateCode">生成防伪码</Button></Col>
          </FormItem>
        </Form>
      </Col>
    </Row>
    <Row class="margin-top-10">
      <Table :columns="listData.columns" :data="listData.data" size="small" border @on-selection-change="selectCheck(e)" highlight-row :loading="loading">
        <!-- 操作 -->
        <template slot-scope="{ row, index }" slot="action">
            <Button size="small" :disabled="row.isComputed === 0 || fileSrc[index] == ''"><a :href="fileSrc[index]">下载表格</a></Button>  
          </Poptip>
        </template>
      </Table>
      <div style="margin: 10px;overflow: hidden">
        <div class="pages-L">共 {{pageProps.totalCount}} 条</div>
        <div style="float: right;">
          <Page size="small" :total="pageProps.totalCount" :current="pageProps.page" show-sizer show-elevator @on-change="changePage" @on-page-size-change="changePageSize"></Page>
        </div>
      </div>
    </Row>

    <!-- 生成防伪码弹窗 -->
    <Modal
      v-model="generateStatus"
      title="生成防伪码"
      @on-cancel="cancel('generateData')">
      <Form ref="generateData" :model="generateData" :rules="generateRule" class="generateData">
        <FormItem label="品牌：" prop="brand" :label-width="90">
          <Input v-model="generateData.brand" clearable></Input>
        </FormItem>
        <FormItem label="生成数量：" prop="generationCount" :label-width="90">
          <Input v-model="generateData.generationCount" clearable number></Input>
        </FormItem>
      </Form>    
      <div slot="footer">
          <Button type="primary" :loading="generateLoading" @click="confirm('generateData')" :disabled="isdisabled">生成</Button>
          <Button type="default" :loading="generateLoading" @click="cancel('generateData')">取消</Button>
      </div>
    </Modal>
  </div>  
</template>
<script>
  export default {
    data () {
      // 生成数量校验
      const validateCountCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('生成数量不能为空'));
                } else if (value >1000000 || value <=0) {
                    callback(new Error('请输入1~1000000的有效数字'));
                } else {
                    callback();
                }
      };
      return {
        generateStatus: false,
        generateLoading: false,
        isdisabled: false,
        isNo: false,
        loading: false,
        isComputed: [],
        fileSrc: [],
        generateData: {
          brand: '',
          generationCount: ''
        },
        generateRule: {
          brand: [
            { required: true, message: '品牌不能为空', trigger: 'blur' }
          ],
          generationCount: [
            { required: true, validator: validateCountCheck, trigger: 'blur' }
          ]
        },
        searchData: {
          startTime: '',
          endTime: '',
          brand: '',
          userName: ''
        },
        rulesForm: {},
        listData: {
          columns: [
            {type: 'selection', width: 60, align: 'center'},
            {key: 'index', type: 'index', title: '序号', width: 65, align: 'center'},
            {key: 'brand', title: '品牌', minWidth: 100, sortable: true, align: 'center'},
            {key: 'generationCount', title: '生成数量', minWidth: 120, sortable: true, align: 'center'},
            {key: 'createdAt', title: '生成日期', minWidth: 100, sortable: true, align: 'center'},
            {key: 'userName', title: '操作人员', minWidth: 100, sortable: true, align: 'center'},
            { key: 'action', title: '操作', width: 150, align: 'center', slot: 'action' }
          ],
          data: []
        },
        pageProps: { // 列表分页属性
             page: 1,
             perPage: 10,
             currentPage: 1,
             totalCount: 0
        }
      }
    },
    mounted() {
      this.getList()
    },
    methods:{
      // 生成防伪码
      generateCode () {
        this.generateStatus = true
        this.isdisabled = false
        this.generateData.brand = ''
        this.generateData.generationCount = ''
      },
      // 確定生成
      confirm (required) {
        this.handleSubmit (required)
        let params = this.generateData
        if(this.isNo === false){
          this.$API.securityCodeCreate(params).then((res) => {
          if(res.code === 0){
          }
        })
        }
      },
      selectCheck () {},
      changePage (e) {
        this.pageProps.page = e
        this.getList();
      },
      changePageSize (e) {
        this.pageProps.perPage = e
        this.getList();
      },
      // 取消生成
      cancel (name) {
        this.generateStatus = false
        this.$refs[name].resetFields();
      },
      // 弹窗校验
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$Message.success('提交成功');
            this.isdisabled = true
            this.generateStatus = false
            this.getList ()
          } else {
             this.$Message.error('请填写信息');
             this.isNo = true
             return this.isNo
             }
          })
      },
      // 获取数据
      getList (e, noPage) {
        let params = this.searchData
        params.page = this.pageProps.page
        params.perPage = this.pageProps.perPage
        if (noPage === 'noPage') {
          delete params.page
          delete params.perPage
        }
        this.fileSrc = []
        this.$API.securityCodeList(params).then((res) => {
          //console.log(res)
          this.loading = true
          if(res.code === 0){
             this.listData.data = res.data.list
             this.pageProps.perPage = res.data.perPage
             this.pageProps.totalCount = res.data.count
             Object.keys(res.data.list).map((key) => {
                let keys = res.data.list[key]
                this.isComputed.push(keys['isComputed'])
                // 判断有没有链接，没有为空
                if(keys['isComputed'] === 0){
                  this.fileSrc.push('')
                }
                if(keys['isComputed'] === 1 && keys['fileItem'].length===0){
                  this.fileSrc.push('')
                }
                Object.keys(keys['fileItem']).map((key) => {
                    this.fileSrc.push(keys['fileItem'][key]['url'])
                 })
                 //console.log(this.fileSrc)
             })
          }
        }).then(() => {
          this.loading = false
        })
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
