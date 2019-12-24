<template>
  <div class="box-code-mangement">
    <!-- <Row class="title">
      <Col span="24">箱码管理</Col>
    </Row> -->
    <Row class="search-form">
      <Col :xs="24" :md="6">
        <div class="date-box">
          <span>生产日期：</span>
          <Date-picker v-model="searchData.time" class="date" type="datetimerange" placeholder="选择日期和时间" @change="getList"></Date-picker>
        </div>
      </Col>
      <Col :xs="24" :md="4">
        <Input v-model="searchData.title" clearable placeholder="标题"></Input>
      </Col>
      <Col :xs="24" :md="4">
        <Input v-model="searchData.createdBy" clearable placeholder="操作人员"></Input>
      </Col>
      <Col :xs="24" :md="4">
        <!-- <InputNumber v-model="searchData.orderId" style="width: 100%" placeholder="归属订单"></InputNumber> -->
        <Select
          v-model="searchData.orderId"
          filterable
          remote
          :remote-method="serachOrder"
          :loading="searchLoading">
          <Option v-for="(option, index) in searchList" :value="option.id" :key="index">{{option.orderNumber}}</Option>
        </Select>
      </Col>
      <Col :xs="24" :md="6">
        <Button type="primary" @click="getList">查询</Button>
        <Button type="primary" @click="showCreateModal">生成箱码</Button>
      </Col>
    </Row>
    <Row style="padding-top: 20px;">
      <Table :loading="tableLoading" :columns="column" border :data="tableData">
        <template slot='action' slot-scope="{row, index}" >
          <a v-if="row.fileItems.length" target="_blank" :href="row.fileItems[0].url">下载表格</a>
          <div v-if="!row.fileItems.length" style="color: #ccc; cursor:no-drop;">下载表格</div>
        </template>
      </Table>
    </Row>
    <Row>
      <div style="margin: 10px;overflow: hidden">
        <div class="pages-L">共 {{pageProps.totalCount}} 条</div>
        <div style="float: right;">
          <Page size="small" :total="pageProps.totalCount" :current="pageProps.page" show-sizer show-elevator @on-change="changePage" @on-page-size-change="changePageSize"></Page>
        </div>
      </div>
    </Row>
    <Modal
      v-model="createModal"
      title="生成箱码">
      <Form ref="createForm" :model="formData" :rules="rules">
        <FormItem label="标题：" style="padding-left: 2em;" prop="title">
          <Input style="width: 70%;" v-model="formData.title" placeholder="箱码标题"></Input>
        </FormItem>
        <FormItem label="生成数量：" prop="generationCount">
          <InputNumber :precision="0" v-model="formData.generationCount" placeholder="箱码数量"></InputNumber>
        </FormItem>
        <FormItem label="归属订单：" prop="relation">
          <RadioGroup v-model="formData.relation">
            <Radio label="after">后关联</Radio>
            <Radio label="before">前关联</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem v-if="formData.relation === 'before'" label="　　　　　　">
          <Select
            style="width: 70%;"
            v-model="formData.orderId"
            filterable
            remote
            :remote-method="serachOrder"
            :loading="searchLoading"
            placeholder="订单编号">
            <Option v-for="(option, index) in searchList" :value="option.id" :key="index">{{option.orderNumber}}</Option>
          </Select>
        </FormItem>
      </Form>
      <div class="footer" style="t: right;" slot="footer">
        <Button @click="createModal = false">取消</Button>
        <Button type="primary" @click="submit" :loading="btnLoading">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    created () {
      this.getList();
    },
    data () {
      return {
        searchData: {
          time: '',
          title: '',
          createdBy: '',
          orderId: null
        },
        column: [
          {
            key: 'title',
            title: '标题',
            align: 'center'
          },
          {
            key: 'generationCount',
            title: '生成数量',
            align: 'center'
          },
          {
            key: 'orderNumber',
            title: '归属订单',
            align: 'center'
          },
          {
            key: 'createdAt',
            title: '生成日期',
            align: 'center',
            render: (h, params) => {
              return h('div', this.format(params.row.createdAt, 'yyyy-MM-dd'),)
            }
          },
          {
            key: 'createdBy',
            title: '操作人员',
            align: 'center'
          },
          {
            slot: 'action',
            title: '操作',
            align: 'center',
          }
        ],
        tableData: [],
        pageProps: { // 列表分页属性
          page: 1,
          perPage: 10,
          totalCount: 0
        },
        tableLoading: false,
        createModal: false,
        formData: {
          title: '',
          generationCount: 0,
          relation: 'after',
          orderId: ''
        },
        rules: {
          title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
          generationCount: [{ required: true, type: 'number', message: '生成数量不能为空', trigger: 'blur' }],
          relation: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        },
        btnLoading: false,
        searchLoading: false,
        searchList: []
      }
    },
    methods: {
      // 获取列表
      getList () {
        this.tableLoading = true
        let searchData = {...this.searchData}
        try {
          searchData.startAtBegin = this.format(((searchData.time[0].getTime()+'').substr(0,10)), 'yyyy-MM-dd hh:mm:ss')
          searchData.endAtBegin = this.format((searchData.time[1].getTime()+'').substr(0,10), 'yyyy-MM-dd hh:mm:ss')
        } catch (err ) {}
        this.$API.boxCodeList({
          ...searchData,
          ...this.pageProps
        }).then(res => {
          this.tableLoading = false
          if (res.code === 0) {
            this.tableData = res.data.data
            this.pageProps.totalCount = res.data.count
          }
        })
      },
      // 改变分页
      changePage (e) {
        this.pageProps.page = e
        this.getList();
      },
      changePageSize (e) {
        this.pageProps.perPage = e
        this.getList();
      },
      // 格式化日期
      padLeftZero (str) {
        return ('00' + str).substr(str.length);
      },
      format (time, fmt) {
        if (!time || time === 'Invalid Date' || time === '0') {
            return '';
        }
        let date = new Date(Number(time) * 1000);
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }

        let obj = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds()
        };
        for (let k in obj) {
            if (new RegExp(`(${k})`).test(fmt)) {
                let str = obj[k] + '';
                fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : this.padLeftZero(str));
            }
        }
        return fmt;
      },
      // 显示生成箱码弹窗
      showCreateModal () {
        this.createModal = true
      },
      // 创建箱码
      submit () {
        this.$refs.createForm.validate((valid) => {
          if (valid) {
              if (this.formData.relation === 'before' && !this.formData.orderId) {
                this.$Message.warning('前关联必须填写订单')
                return;
              }
              this.btnLoading = true;
              this.$API.boxCodeCreate(this.formData).then((res) => {
                if(res.code === 0) {
                  this.$Message.success('添加成功')
                  this.createModal = false;
                  this.btnLoading = false;
                  this.formData = {
                    title: '',
                    generationCount: 0,
                    relation: 'after',
                    orderId: ''
                   }
                  this.getList();
                }
              })
          } else {
              this.$Message.warning('请验证表单信息')
          }
        })
      },
      serachOrder (query) {
        this.searchLoading = true
        this.$API.searchOrderNum({
          orderNumber: query
        }).then((res) => {
          this.searchLoading = false;
          this.searchList = res.data
        })
      }
    }
  }
</script>

<style lang="less" scoped>
.box-code-mangement{
  .search-form{
    background: #f6f6f6;
    padding: 15px 5px;
    border-radius: 8px;
    .date-box{
      display: flex;
      align-items: center;
      span{
        flex: 0 0 5em;
      }
      .date{
        flex: 1;
      }
    }
  }
}
</style>
