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
              @on-selection-change="(list) => { changeSelect(list, 'selectNewList') }"
              border></Table>
              <!-- @on-selection-change="(list) => { changeSelect(list, 'selectNewList') }" -->
            <div class="foot-page">
              共{{newPageProps.count}}条
              <Page
                transfer
                :current="newPageProps.page"
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
              @on-selection-change="(list) => { changeSelect(list, 'selectOldList')}"
              border></Table>
            <div class="foot-page">
              共{{oldPageProps.count}}条
              <Page transfer
                :current="oldPageProps.page"
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
                <Input v-if ="item.ext" readonly :value="item.ext.exportFeedback"></Input>
              </FormItem>
            </Col>
            <Col span="7">
              <FormItem :label="index === 0 ? '备注':''">
                <Input v-if ="item.ext" readonly :value="item.ext.remark"></Input>
              </FormItem>
            </Col>
          </Row>
          <div v-if="!exportList.length" class="no-list">暂无记录</div>
        </Form>
        <div class="foot-page">
          共{{exportListPageProps.count}}条
          <Page
            transfer
            :current="exportListPageProps.page"
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

<!--    日志-->
    <Modal class="log-Modal" width="1150" v-model="logModal.show">
      <Form :model="logModal.traceData">
        <Divider>防伪码基础信息</Divider>
        <Row>
          <Col span="12">

            <FormItem label="查询链接地址">
              <Input :value="logModal.traceData.link" readonly />
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="品牌">
              <Input :value="logModal.traceData.brand" readonly />
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="序列号">
              <Input :value="logModal.traceData.serialCode" readonly />
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="防伪码">
              <Input :value="logModal.traceData.securityCode" readonly />
            </FormItem>
          </Col>
        </Row>
<!--    aaa    TODO:调出库列表接口-->
        <Row>
          <Col span="4">
            <FormItem label="编码生成时间">
              <Input :value="selectTab === 'new'? logModal.traceData.createdAt : logModal.traceData.scodeBuildTime" readonly />
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="是否激活">
              <Input :value="!logModal.traceData.enableStatus ? '' : logModal.traceData.enableStatus === 'disabled' ? '否' : '是'" readonly />
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="是否失效">
              <Input :value="logModal.traceData.isSucceed" readonly />
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="所属生产批次号">
              <Input :value="logModal.traceData.batchNumber" readonly />
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="所属包材订单号">
              <Input :value="logModal.traceData.supplierOrderNumber" readonly />
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="包材供应商">
              <Input :value="logModal.traceData.supplier" readonly />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="4">
            <FormItem label="出库时间">
              <Input :value="logModal.traceData.created_at" readonly />
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="出库序列号范围">
<!--              <Input :value="logModal.traceData.range" readonly />-->
              <Select :value="logModal.traceData.firstRange" placeholder="">
                <Option v-for="(range, index) in rangeList" :key="index" :value="range.value" :label="range.label"/>
              </Select>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="所属灌包订单号">
              <Input :value="logModal.traceData.gb_order_sn" readonly />
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="OEM供应商">
              <Input :value="logModal.traceData.supplier" readonly />
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="慕可代码">
              <Input :value="logModal.traceData.mk_code" readonly />
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="产品名称">
              <Input :value="logModal.traceData.product_name" readonly />
            </FormItem>
          </Col>
        </Row>

        <div class="title">
          <span class="line"></span>
          <div class="title-text">查询记录</div>
          <span class="line"></span>
        </div>
        <div class="input-box">
          <Row v-for="(item, index) in logModal.list" :key="index">
            <Col span="2">
              <FormItem :label="index === 0 ? '序号':''">
                <Input readonly :value="index + 1" />
              </FormItem>
            </Col>
            <Col span="4">
              <FormItem :label="index === 0 ? '查询时间':''">
                <Input readonly :value="item.createdAt" />
              </FormItem>
            </Col>
            <Col span="3">
              <FormItem :label="index === 0 ? 'IP':''">
                <Input readonly :value="item.ip" />
              </FormItem>
            </Col>
            <Col span="4">
              <FormItem :label="index === 0 ? '查询地区':''">
                <Input readonly :value="item.ipLocation" />
              </FormItem>
            </Col>
            <Col span="3">
              <FormItem :label="index === 0 ? '渠道':''">
                <Input readonly :value="item.purchaseChannels" />
              </FormItem>
            </Col>
            <Col span="3">
              <FormItem :label="index === 0 ? '店铺':''">
                <Input readonly :value="item.shop" />
              </FormItem>
            </Col>
            <Col span="3">
              <FormItem :label="index === 0 ? '用户昵称':''">
                <Input readonly :value="item.wechatNickname" />
              </FormItem>
            </Col>
            <Col span="2">
              <FormItem :label="index === 0 ? '查询结果':''">
                <Input readonly :value="item.isSucceed === 'yes' ? '成功' : '失败'" />
              </FormItem>
            </Col>
          </Row>
        </div>
      </Form>

      <div class="modal-footer" slot="footer">
        <Button type="default" @click="logModal.show = false">取消</Button>
      </div>
      <Spin fix v-if="spinShow"></Spin>
    </Modal>
  </div>
</template>

<script>
  const EXPORT_MAX = 4200; // 导出最大数量
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
          {type: 'selection', width: 60, align: 'center'},
          {type: 'index', title: '序号', minWidth: 65, align: 'center'},
          {key: 'serialCode', title: '序列号', minWidth: 100, align: 'center'},
          {key: 'securityCode', title: '防伪码', minWidth: 100, align: 'center',
            render: (h, {row}) => {
              return h('a', {
                attrs: {
                  href: 'javascript:void(0)'
                },
                on: {
                  click: () => {
                    this.getNewLog(row)
                  }
                }
              }, row.securityCode)
            }
          },
          {key: 'brand', title: '品牌', minWidth: 80, align: 'center'},
          {key: 'purchaseChannels', title: '渠道', minWidth: 100, align: 'center'},
          {key: 'shop', title: '购买店铺', minWidth: 110, align: 'center'},
          // {key: 'scanAt', title: '扫码时间', minWidth: 100, align: 'center'},
          {key: 'createdAt', title: '查询日期', width: 110, align: 'center'},
          {key: 'isSucceed', title: '是否成功', minWidth: 70, align: 'center'},
          {key: 'isOneDay', title: '是否24小时内查询', minWidth: 70, align: 'center'},
          {key: 'wechatNickname', title: '用户昵称', minWidth: 100, align: 'center'},
          {key: 'securityCodeLink', title: '链接', minWidth: 160, align: 'center'},
          {key: 'ipLocation', title: 'IP地址', width: 120, align: 'center'},
          {key: 'productionDate', title: '编码生成日期', minWidth: 140, align: 'center'},
          {key: 'masterId', title: '需求编号', minWidth: 100, align: 'center'},
        ],
        oldColumn: [ // 旧防伪码表头
          {type: 'selection', width: 60, align: 'center'},
          {type: 'index', title: '序号', minWidth: 65, align: 'center'},
          {key: 'securityCode', title: '防伪码', minWidth: 100, align: 'center',
            render: (h, {row}) => {
              return h('a', {
                attrs: {
                  href: 'javascript:void(0)'
                },
                on: {
                  click: () => {
                    this.getOldLog(row)
                  }
                }
              }, row.securityCode)
            }},
          {key: 'productionDate', title: '编码生成日期', minWidth: 130, align: 'center'},
          {key: 'brand', title: '品牌', minWidth: 80, align: 'center'},
          {key: 'purchaseChannels', title: '渠道', minWidth: 100, align: 'center'},
          {key: 'shop', title: '购买店铺', minWidth: 80, align: 'center'},
          {key: 'createdAt', title: '查询日期', minWidth: 130, align: 'center'},
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
        selectNewList: [], // 新列表选中
        selectOldList: [], // 旧列表选中
        userData: {},
        exportSelectIdList: [], // 导出选中信息
        spinShow: false,
        logModal: {
          show: false,
          list: [],
          traceData: {}
        },
        rangeList: [],
      }
    },
    methods: {
      getNewLog(row){
        let {brand, masterId, serialCode, securityCode, securityCodeLink, productionDate, isSucceed} = row
        let uniqueCode = ''
        if(securityCodeLink.indexOf('?') !== -1) {
          securityCodeLink.substr(securityCodeLink.indexOf('?')).split('&').map(items => {
            if(items.indexOf('uniqueCode') != -1) {
              uniqueCode = items.split('=')[1]
            }
          })
        }else {
          let arr = securityCodeLink.split('/')
          let index = arr.indexOf('uniqueCode')
          uniqueCode = arr[index + 1]
        }

        this.newBrandList.forEach(items => {
          if(items.label === brand){
            brand = items.value
          }
        })
        this.spinShow = true
        this.logModal.show = true
        this.$API.getNewSecurityCodeLog({brand, masterId, serialCode, securityCode, uniqueCode}).then(res => {
          this.logModal.list = res.data.list
          this.logModal.traceData = Array.isArray(res.data.traceData) ? {} : res.data.traceData
          this.logModal.traceData.createdAt = productionDate
          this.logModal.traceData.isSucceed = isSucceed
        }).then(() => {
          // brand serialCode 获取出库相应信息
          // let rangeStr = 'A00000001-A00000003'
          this.$API.getOutboundLog({brand: row.brand, serialCode, page: 1, perPage: 10}).then(res => {
            this.spinShow = false
            // console.log(res)

            if(res.code !== 0 || res.data.list.length === 0) return
            // 取第一条 按理说：序列号查找到的会是单条数据
            let data = res.data.list[0]

            this.logModal.traceData = {
              ...this.logModal.traceData,
              created_at: data.created_at,
              firstRang: '',
              gb_order_sn: data.gb_order_sn,
              supplier: data.supplier,
              mk_code: data.mk_code,
              product_name: data.product_name,
            }
            // 序列号范围
            this.getRangeList(data.range)
          })
        })
      },
      getOldLog(row) {
        let {brand, securityCode, productionDate, isSucceed} = row
        // 品牌参数转换
        this.oldBrandList.forEach(items => {
          if(items.label === brand){
            brand = items.value
          }
        })
        this.spinShow = true
        this.logModal.show = true
        // 没有出库信息
        this.$API.getOldSecurityCodeLog({brand, code: securityCode})
          .then(res => {
            this.logModal.list = res.data.list.map(items => {
              items.purchaseChannels = items.channel
              items.shop = items.keyword
              // items.wechatNickname = items.wechatNickname // 没有微信名
              return items
            })
            let traceData = res.data.traceData
            if(Array.isArray(traceData)) {
              this.logModal.traceData = {}
            }else {
              traceData.securityCode = traceData.code
              traceData.scodeBuildTime = productionDate
              traceData.isSucceed = isSucceed
              traceData.brand = row.brand
              this.logModal.traceData = traceData
            }
            this.spinShow = false
          })
      },
      getList (type) {
        let pageProps = null
        let search = this.getSearch()
        let tableDataKey = null
        let apiKey = null
        let selectList = null
        switch (this.selectTab) {
          case 'new':
            pageProps = this.newPageProps
            tableDataKey = 'newData'
            apiKey = 'getSecurityHistoryNewList'
            selectList = this.selectNewList
            break;
          case 'old':
            pageProps = this.oldPageProps
            tableDataKey = 'oldData'
            apiKey = 'getSecurityHistoryOldList'
            selectList = this.selectOldList
            break;
        }
        if (type === 'search') {
          pageProps.page = 1;
          pageProps.perPage = 10;
          selectList = []
          this.selectTab === 'new' ? this.selectNewList = [] : this.selectOldList = []
        }
        this.isTableLoading = true;
        // 用于判断请求时是否改变了分页、每页显示数量、新旧列表
        let page = pageProps.page
        let prePage = pageProps.prePage
        let selectTab = this.selectTab
        this.$API[apiKey]({...pageProps, ...search})
          .then(res => {
            this.isTableLoading = false;
            if (res.code === 0 && res.data.data) {
              if (pageProps.page !== page || pageProps.prePage !== prePage || this.selectTab !== selectTab) return;
              if (selectList.length && selectList[page] && selectList[page].length) {
                // 选中数组中该页有数据  赋值checked
                res.data.data.forEach(item => {
                  if (selectList[page].find(it => it.id === item.id)) {
                    item._checked = true
                  }
                })
              }
              pageProps.count = res.data.count
              this[tableDataKey] = res.data.data
            } else {
              this[tableDataKey] = []
            }
          })
          .catch(() => {
            this.isTableLoading = false;
          })
      },
      getRangeList(rangeStr){
        let letter = rangeStr.substr(0, 1)
        let rangeArr = rangeStr.split('-')
        let start = parseInt(rangeArr[0].substr(1))
        let end = parseInt(rangeArr[1].substr(1))
        let list = []
        list.push(rangeArr[0])
        for(let i = 0; i < end - start; i++){
          // console.log(++start)
          list.push(this.formatSerialCode(letter, ++start + ''))
        }
        list.push(rangeArr[1])

        list.forEach(items => {
          this.rangeList.push({
            value: items,
            label: items
          })
        })
        this.logModal.traceData.firstRange = rangeArr[0]
      },
      // 序列码格式 编号大写 + 8位数字
      formatSerialCode(letter, num) {
        num = num + ''
        let zeroLength = 8 - num.length
        let fixZero = ''
        for(let i = 0; i < zeroLength; i++){
          fixZero += '0'
        }
        return letter + fixZero + num
      },

      // 改变tab
      changeTab (name) {
        if (!this[name + 'Data'].length) {
          this.getList()
        }
      },
      // 显示导出弹窗
      showExportModal () {
        if (this.isTableLoading) return;
        let selectList = this.selectTab === 'new' ? this.selectNewList : this.selectOldList
        let exportSelectIdList = [] // 导出数组(id)
        selectList.forEach(items => {
          if (items) {
            items.forEach(item => {
              exportSelectIdList.push(item.id)
            })
          }
        })
        console.log(exportSelectIdList.length, 'exportSelectIdList.length')
        if (!exportSelectIdList.length) {
          let isCanExport = true;
          for (let key in this.search[this.selectTab]) {
            if (this.search[this.selectTab][key]) {
              isCanExport = false;
            }
          }
          if (isCanExport) {
            this.$Message.warning('请筛选条件后导出')
            return;
          }
          console.log(this[this.selectTab + 'PageProps'].count, "this[this.selectTab + 'PageProps'].count")
          if (this[this.selectTab + 'PageProps'].count > EXPORT_MAX) {
            this.$Message.warning('数据量过大，请联系管理员')
            return;
          }
        } else {
          if (exportSelectIdList.length > EXPORT_MAX) {
            this.$Message.warning('数据量过大，请联系管理员')
            return;
          }
        }
        this.exportSelectIdList = exportSelectIdList
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
      changeSelect (list, key) {
        let pageProps = this[this.selectTab + 'PageProps']
        this[key][pageProps.page] = JSON.parse(JSON.stringify(list))
      },
      // 查询导出记录
      getExportList () {
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
              if (res.data.phone) {
                this.$Message.success('验证码已发送至' + res.data.phone + ',请注意查收!')
              }
            }
          }).catch(err => {})
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
          let apiName = this.selectTab === 'new' ? 'exportNewSecurityList' : 'exportOldSecurityList'
          this.isExportLoading = true;
          let postData = {
            ...this.exportForm,
            ...this.getSearch()
          }
          if (this.exportSelectIdList.length) {
            // 勾选导出时传check和id数组
            postData.id = this.exportSelectIdList;
            postData.check = 1
          }
          this.$API[apiName](postData).then(res => {
            this.isExportLoading = false;
            if (res.code === 0) {
              let data = res
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
            } else {
              this.$Message.error(res.subMsg)
            }
          }).catch((err) => {
            this.isExportLoading = false;
          })
        })
      }
    },
    watch: {
      isShowExportModal(cur) {
        if(!cur){
          this.$refs.exportForm.resetFields()
          this.exportForm = {
            verifyCode: null,
            remark: ''
          }
        }
      }
    },
    watch: {
      ['logModal.show'](cur) {
        if(!cur) {
          this.logModal.list = []
          this.logModal.traceData = {}
        }
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
  // /deep/ thead .ivu-table-cell-with-selection{
  //   display: none;
  // }
  .log-Modal /deep/ .ivu-modal-body {
    padding: 20px 10px;
  }
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    .title-text {
      flex-shrink: 0;
      padding: 0 10px;
    }

    .line {
      width: 100%;
      border-top: 1px dashed #000;
    }
  }
</style>