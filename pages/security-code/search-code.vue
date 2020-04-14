<template>
  <div class="search-code">
    <Card>
      <Row slot="title">
        <Row>
          <Col :xs="24" :sm="12" :md="6" :lg="2">
            <Input placeholder="防伪码" v-model="search[selectTab].securityCode" @on-enter="getList('search')" clearable></Input>
          </Col>
          <Col :xs="24" :sm="12" :md="6" :lg="2" v-if="selectTab === 'new'">
            <Input placeholder="序列号" v-model="search[selectTab].serialCode" @on-enter="getList('search')" clearable></Input>
          </Col>
          <Col :xs="24" :sm="12" :md="6" :lg="2">
            <Select clearable v-model="search[selectTab].brand">
              <Option v-for="(item, index) in selectTab === 'new' ? newBrandList : oldBrandList" :value="item.value" :key="index">{{item.label}}</Option>
            </Select>
          </Col>
          <Col :xs="24" :sm="12" :md="6" :lg="2">
            <Input placeholder="购买渠道" @on-enter="getList('search')" clearable v-model="search[selectTab].purchaseChannels"></Input>
          </Col>
          <Col :xs="24" :sm="12" :md="6" :lg="2">
            <Input placeholder="购买店铺" @on-enter="getList('search')" clearable v-model="search[selectTab].shop"></Input>
          </Col>
          <Col :xs="24" :sm="12" :md="6" :lg="2" v-if="selectTab === 'new'">
            <Input placeholder="用户昵称" @on-enter="getList('search')" clearable v-model="search[selectTab].wechatNickname"></Input>
          </Col>
          <Col :xs="24" :sm="12" :md="6" :lg="2" v-if="selectTab === 'new'">
            <Input placeholder="需求编号" @on-enter="getList('search')" clearable v-model="search[selectTab].masterId"></Input>
          </Col>
          <Col :xs="24" :sm="12" :md="6" :lg="3">
            <DatePicker type="datetime" @on-change="getList('search')" clearable placeholder="查询时间起" v-model="search[selectTab].startTime"></DatePicker>
          </Col>
          <Col :xs="24" :sm="12" :md="6" :lg="3">
            <DatePicker type="datetime" @on-change="getList('search')" clearable placeholder="查询时间止" v-model="search[selectTab].endTime"></DatePicker>
          </Col>
          <Col :xs="24" :sm="12" :md="6" :lg="2">
            <Button type="primary" @click="getList('search')">搜索</Button>
          </Col>
        </Row>
        <Row class="margin-top-10">
          <Col span="24">
            <Button type="primary" @click="showExportModal">导出查询数据</Button>
          </Col>
        </Row>
      </Row>
      <Row>
        <Tabs v-model="selectTab" @on-click="changeTab">
          <TabPane label="新防伪码查询记录" name="new">
            <Table
              :style="selectTab !== 'new' ? 'height: 0;': ''"
              :columns="newColumn"
              ref="newTable"
              :data="newData"
              :loading="isTableLoading"
              border></Table>
              <!-- @on-selection-change="(list) => { changeSelect(list, 'selectNewList') }" -->
            <div class="foot-page">
              共{{newPageProps.count}}条
              <Page transfer
                :total="newPageProps.count"
                :page-size="newPageProps.perPage"
                size="small"
                show-elevator
                show-sizer
                @on-change="(page) => { changePage(page, 'newPageProps') }"
                @on-page-size-change="(size) => { changePageSize(size, 'newPageProps') }" />
            </div>
          </TabPane>
          <TabPane label="旧防伪码查询记录" name="old">
            <Table
              :style="selectTab !== 'old' ? 'height: 0;': ''"
              :columns="oldColumn"
              ref="oldTable"
              :data="oldData"
              :loading="isTableLoading"
              border></Table>
              <!-- @on-selection-change="(list) => { changeSelect(list, 'selectOldList') }" -->
            <div class="foot-page">
              共{{oldPageProps.count}}条
              <Page transfer
                :total="oldPageProps.count"
                :page-size="oldPageProps.perPage"
                size="small"
                show-elevator
                show-sizer
                @on-change="(page) => { changePage(page, 'oldPageProps') }"
                @on-page-size-change="(size) => { changePageSize(size, 'oldPageProps') }" />
            </div>
          </TabPane>
        </Tabs> 
      </Row>
    </Card>
    <Modal
      class="exportModal"
      width="50%"
      v-model="isShowExportModal">
      <div slot="header">
        <div class="export-title">导出查询数据</div>
      </div>
      <Divider>导出记录</Divider>
      <div class="input-box">
        <Form>
          <Row v-for="(item, index) in exportList" :key="index">
            <Col span="2">
              <FormItem :label="index === 0 ? '序号':''">
                <Input readonly :value="index + 1"></Input>
              </FormItem>
            </Col>
            <Col span="5">
              <FormItem :label="index === 0 ? '导出人':''">
                <Input readonly :value="item.createdBy"></Input>
              </FormItem>
            </Col>
            <Col span="5">
              <FormItem :label="index === 0 ? '导出时间':''">
                <Input readonly :value="$format(item.createdAt, 'yyyy-MM-dd hh:mm:ss')"></Input>
              </FormItem>
            </Col>
            <Col span="5">
              <FormItem :label="index === 0 ? '导出反馈':''">
                <Input readonly :value="item.ext.exportFeedback"></Input>
              </FormItem>
            </Col>
            <Col span="7">
              <FormItem :label="index === 0 ? '备注':''">
                <Input readonly :value="item.ext.remark"></Input>
              </FormItem>
            </Col>
          </Row>
          <div v-if="!exportList.length" class="no-list">暂无记录</div>
        </Form>
        <div class="foot-page">
          共{{exportListPageProps.count}}条
          <Page transfer
            :total="exportListPageProps.count"
            :page-size="exportListPageProps.perPage"
            :page-size-opts="[5,10,15,20]"
            size="small"
            show-elevator
            show-sizer
            @on-change="changeExportPage"
            @on-page-size-change="changeExportPageSize" />
        </div>
      </div>
      <Divider>导出</Divider>
      <div class="input-box">
        <Form ref="exportForm" :model="exportForm" :rules="exportRules">
          <Row>
            <Col span="5">
              <FormItem label="当前导出人">
                <Input readonly v-model="userData.realName"></Input>
              </FormItem>
            </Col>
            <Col span="5">
              <FormItem label="导出秘钥" prop="verifyCode">
                <Input type="password" v-model="exportForm.verifyCode"></Input>
              </FormItem>
            </Col>
            <Col span="14">
              <FormItem label="备注">
                <Input v-model="exportForm.remark"></Input>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <div class="modal-footer" slot="footer">
        <Button type="primary" class="left" @click="getKey">获取秘钥</Button>
        <Button type="default" @click="isShowExportModal = false">取消</Button>
        <Button type="primary" @click="exportData" :loading="isExportLoading">确认导出</Button>
      </div>
      <Spin fix v-if="exportListLoading"></Spin>
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
        selectTab: 'new', // tab的name  new/old
        newBrandList: [
          {label: 'WIS', value: 'WIS'},
          {label: '柏菲娜', value: 'BOOFINA'},
          {label: 'IRY', value: 'IRY'},
          {label: 'MVE', value: 'MVE'},
          {label: '魔渍', value: 'MOZI'},
          {label: 'KONO', value: 'KONO'},
          {label: '墨雪', value: 'MOXUE'}
        ],
        oldBrandList: [
          {label: 'WIS', value: '1'},
          {label: '柏菲娜', value: '2'},
          {label: 'IRY', value: '3'},
          {label: 'MVE', value: '4'},
          {label: '魔渍', value: '5'},
          {label: 'KONO', value: '6'},
          {label: '墨雪', value: '7'}
        ],
        search: { // 搜索数据
          old: {},
          new: {}
        },
        isTableLoading: false, // table加载中
        newPageProps: { // 新列表分页
          page: 1,
          count: 0,
          perPage:  10
        },
        oldPageProps: { // 旧列表分页
          page: 1,
          count: 0,
          perPage:  10
        },
        newColumn: [ // 新防伪码表头
          // {type: 'selection', width: 60, align: 'center'},
          {type: 'index', title: '序号', minWidth: 65, align: 'center'},
          {key: 'serialCode', title: '序列号', minWidth: 100, align: 'center'},
          {key: 'securityCode', title: '防伪码', minWidth: 100, align: 'center'},
          {key: 'productionDate', title: '编码生成日期', minWidth: 100, align: 'center'},
          {key: 'masterId', title: '需求编号', minWidth: 100, align: 'center'},
          {key: 'brand', title: '品牌', minWidth: 80, align: 'center'},
          {key: 'purchaseChannels', title: '渠道', minWidth: 100, align: 'center'},
          {key: 'shop', title: '购买店铺', minWidth: 80, align: 'center'},
          // {key: 'scanAt', title: '扫码时间', minWidth: 100, align: 'center'},
          {key: 'createdAt', title: '查询日期', minWidth: 120, align: 'center'},
          {key: 'isSucceed', title: '是否成功', minWidth: 70, align: 'center'},
          {key: 'wechatNickname', title: '用户昵称', minWidth: 100, align: 'center'},
          {key: 'securityCodeLink', title: '链接', minWidth: 160, align: 'center'},
          {key: 'ipLocation', title: 'IP地址', minWidth: 100, align: 'center'}
        ],
        oldColumn: [ // 旧防伪码表头
          // {type: 'selection', width: 60, align: 'center'},
          {type: 'index', title: '序号', minWidth: 65, align: 'center'},
          {key: 'securityCode', title: '防伪码', minWidth: 100, align: 'center'},
          {key: 'productionDate', title: '编码生成日期', minWidth: 100, align: 'center'},
          {key: 'brand', title: '品牌', minWidth: 80, align: 'center'},
          {key: 'purchaseChannels', title: '渠道', minWidth: 100, align: 'center'},
          {key: 'shop', title: '购买店铺', minWidth: 80, align: 'center'},
          {key: 'createdAt', title: '查询日期', minWidth: 120, align: 'center'},
          {key: 'isSucceed', title: '是否成功', minWidth: 65, align: 'center'},
          {key: 'ipLocation', title: 'IP地址', minWidth: 80, align: 'center'}
        ],
        newData: [], // 新防伪码数据
        oldData: [], // 旧防伪码数据
        isShowExportModal: false, // 是否显示导出弹窗
        exportList: [], // 导出记录
        exportListLoading: false, // 导出加载
        exportListPageProps: { // 导出记录分页
          page: 1,
          count: 0,
          perPage: 5
        },
        isExportLoading: false,
        exportForm: { // 导出表单
          verifyCode: null,
          remark: ''
        },
        exportRules: {
          verifyCode: [{ required: true, message: '秘钥不能为空', trigger: 'blur' }]
        }, // 导出规则
        exportLoading: false, // 导出中
        // selectNewList: [], // 新列表选中
        // selectOldList: [], // 旧列表选中
        userData: {}
      }
    },
    methods: {
      getList (type) {
        let pageProps = null
        let search = this.getSearch()
        let tableDataKey = null
        let apiKey = null
        switch (this.selectTab) {
          case 'new':
            pageProps = this.newPageProps
            tableDataKey = 'newData'
            apiKey = 'getSecurityHistoryNewList'
            // this.selectNewList = []
            break;
          case 'old':
            pageProps = this.oldPageProps
            tableDataKey = 'oldData'
            apiKey = 'getSecurityHistoryOldList'
            // this.selectOldList = []
            break;
        }
        if (type === 'search') {
          pageProps.page = 1;
          pageProps.perPage = 10;
        }
        this.isTableLoading = true;
        
        this.$API[apiKey]({...pageProps, ...search})
          .then(res => {
            this.isTableLoading = false;
            if (res.code === 0) {
              pageProps.count = res.data.count
              this[tableDataKey] = res.data.data
            }
          })
          .catch(() => {
            this.isTableLoading = false;
          })
      },
      // 改变tab
      changeTab (name) {
        if (!this[name + 'Data'].length) {
          this.getList()
        }
      },
      // 显示导出弹窗
      showExportModal () {
        // let key = this.selectTab === 'new' ? 'selectNewList' : 'selectOldList'
        // if (this[key].length === 0) {
        //   this.$Message.warning('请选择一项进行导出')
        //   return;
        // }
        // if (this[key].length > 1) {
        //   this.$Message.warning('只能选择一项进行导出')
        //   return;
        // }
        this.userData = JSON.parse(window.localStorage.getItem('userInfo'))
        this.exportListPageProps = {
          page: 1,
          count: 0,
          perPage: 5
        }
        this.exportForm = {
          verifyCode: null,
          remark: ''
        }
        this.getExportList();
        this.isShowExportModal = true
      },
      // 改变当前分页
      changePage (page, key) {
        this[key].page = page;
        this.getList();
      },
      // 改变分页size
      changePageSize (pageSize, key) {
        this[key].perPage = pageSize;
        this.getList();
      },
      // 改变当前分页
      changeExportPage (page) {
        this.exportListPageProps.page = page;
        this.getExportList();
      },
      // 改变分页size
      changeExportPageSize (pageSize) {
        this.exportListPageProps.perPage = pageSize;
        this.getExportList();
      },
      // // 改变选中
      // changeSelect (list, key) {
      //   this[key] = JSON.parse(JSON.stringify(list))
      // },
      // 查询导出记录
      getExportList () {
        // let key = this.selectTab === 'new' ? 'selectNewList' : 'selectOldList'
        // let id = this[key][0].id;
        this.exportListLoading = true;
        this.$API.getSecurityExportList({
          type: this.selectTab,
          ...this.exportListPageProps
        }).then(res => {
          this.exportListLoading = false;
          if (res.code === 0) {
            this.exportList = res.data.list;
            this.exportListPageProps.count = res.data.count
          }
        }).catch(() => {
          this.exportListLoading = false;
        })
      },
      // 获取秘钥
      getKey () {
        this.$API.getSecurityExportKey()
          .then(res => {
            if (res.code === 0) {
              if (res.data && res.data.indexOf('失败') > -1) {
                this.$Message.error(res.data)
              } else if (res.data && res.data.indexOf('有效期') > -1) {
                this.$Message.warning(res.data)
              } else {
                this.$Message.success(res.data)
              }
            }
          })
      },
      // 获取搜索数据
      getSearch () {
        // 搜索对象处理
        let search = JSON.parse(JSON.stringify(this.search[this.selectTab]))
        for (let key in search) {
          if (!search[key] && search[key] !== 0) {
            delete search[key]
          } else {
            if (key === 'startTime' || key === 'endTime') {
              search[key] = this.$format(new Date(search[key]).getTime() / 1000, 'yyyy-MM-dd hh:mm:ss');
            }
            if (this.selectTab === 'old') {
              if (key === 'securityCode') {
                search.code = search.securityCode
                delete search[key]
              } else if (key === 'purchaseChannels') {
                search.channel = search.purchaseChannels
                delete search[key]
              } else if (key === 'shop') {
                search.keyword = search.shop
                delete search[key]
              }
            }
          }
        }
        return search
      },
      // 导出
      exportData () {
        this.$refs.exportForm.validate((valid) => {
          if (!valid) {
            this.$Message.warning('请验证表单');
            return;
          }
          this.isExportLoading = true;
          this.$API.exportSecurityList({
            type: this.selectTab,
            ...this.exportForm,
            ...this.getSearch()
          }).then(res => {
            // let data = new Blob([res], {
            //   type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            // })
            let data = res
            this.isExportLoading = false;
            this.isShowExportModal = false;
            if (typeof window.navigator.msSaveBlob !== 'undefined') {
              // IE version
              window.navigator.msSaveBlob(data);
            } else {
              // Firefox version
              var link = document.createElement('a');
              link.href = window.URL.createObjectURL(data);
              link.click();
            }
          }).catch((err) => {
            this.isExportLoading = false;
          })
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  /deep/ .ivu-input-wrapper, /deep/ .ivu-select{
    width: 100%;
  }
  .exportModal /deep/ .ivu-modal-header{
    padding: 14px 0;
    padding-bottom: 0;
    border-bottom: 0;
  }
  .exportModal /deep/ .ivu-modal-body{
    padding: 16px 0;
    padding-top: 0;
  }
  .export-title{
    font-size: 17px;
    padding-left: 2rem;
    line-height: 1.8;
    font-weight: bold;
  }
  .input-box{
    padding: 0 16px;
  }
  .no-list{
    text-align: center;
    padding: 15px 0;
    color: #ccc;
    font-size: 14px;
  }
  .modal-footer{
    text-align: right;
    position: relative;
  }
  .modal-footer /deep/ .left{
    position: absolute;
    left: 0;
  }
  .foot-page {
    padding: 10px;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  /deep/ thead .ivu-table-cell-with-selection{
    display: none;
  }
</style>