<template>
  <div>
    <Card>
      <!--      Form-->
      <Form ref="listSearchForm" :model="listSearchForm" inline v-show="currentTab === 'outboundList'">
        <Row>
          <Input v-model="listSearchForm.brand" placeholder="品牌" class="width-120 margin-bottom-10"/>
          <Input v-model="listSearchForm.gbOrderSn" placeholder="灌包订单号" class="width-120 margin-bottom-10"/>
          <Input v-model="listSearchForm.mkCode" placeholder="慕可代码" class="width-120 margin-bottom-10"/>
          <Input v-model="listSearchForm.productName" placeholder="产品名称" class="width-120 margin-bottom-10"/>
          <Input v-model="listSearchForm.createdBy" placeholder="申请人" class="width-120 margin-bottom-10"/>
          <Input v-model="listSearchForm.outboundOrderSn" placeholder="出库单号" class="width-120 margin-bottom-10"/>
          <Button type="primary" class="margin-bottom-10" @click="search">搜索</Button>
        </Row>
        <Row>
          <Button type="primary" class="margin-bottom-10" @click="addPlan">导出数据</Button>
          <Button type="primary" class="margin-bottom-10" @click="$router.push('/outbound-management/outbound-add')">
            添加出库单
          </Button>
          <Button type="primary" class="margin-bottom-10" @click="showReviewModal('出库单审核')">审核</Button>
          <Button type="primary" class="margin-bottom-10" @click="printOutboundSn">打印出库</Button>
          <Button type="primary" class="margin-bottom-10" @click="manualOutbound">手动出库</Button>
          <Button type="primary" class="margin-bottom-10" @click="showReviewModal('完成出库')">完成出库</Button>
          <Button type="primary" class="margin-bottom-10" @click="editApply">修改</Button>
        </Row>
      </Form>

      <Form ref="recordSearchForm" :model="recordSearchForm" inline v-show="currentTab === 'outboundRecord'">
        <Row>
          <Input v-model="recordSearchForm.name" placeholder="品牌" class="width-120 margin-bottom-10"/>
          <Input v-model="recordSearchForm.name" placeholder="灌包订单号" class="width-120 margin-bottom-10"/>
          <Input v-model="recordSearchForm.name" placeholder="慕可代码" class="width-120 margin-bottom-10"/>
          <Input v-model="recordSearchForm.name" placeholder="产品名称" class="width-120 margin-bottom-10"/>
          <Input v-model="recordSearchForm.name" placeholder="出库记录人" class="width-120 margin-bottom-10"/>
          <Input v-model="recordSearchForm.name" placeholder="出库时间" class="width-120 margin-bottom-10"/>
          <Input v-model="recordSearchForm.name" placeholder="出库单号" class="width-120 margin-bottom-10"/>
          <Input v-model="recordSearchForm.name" placeholder="供应商" class="width-120 margin-bottom-10"/>
          <Input v-model="recordSearchForm.name" placeholder="序列号" class="width-120 margin-bottom-10"/>
          <Button type="primary" class="margin-bottom-10">搜索</Button>
        </Row>
        <Row>
          <Button type="primary" class="margin-bottom-10">导出数据</Button>
          <Button type="primary" class="margin-bottom-10" @click="outboundConfirm">出库确认</Button>
          <Button type="primary" class="margin-bottom-10" @click="repeal">作废</Button>
          <Button type="primary" class="margin-bottom-10" @click="$router.push('/outbound-management/outbound-add')">
            修改
          </Button>
        </Row>
      </Form>


      <!--      Tabs-->
      <Tabs v-model="currentTab">
        <TabPane label="出库申请单" name="outboundList">
          <!--          Table-->
          <Table border
                 :columns="outboundList.columns"
                 :data="outboundList.data"
                 :loading="tableLoading"
                 :style="currentTab !== 'outboundList' ? 'height: 0;': ''"
                 @on-selection-change="selectionChange">
          </Table>
          <!--          Page-->
          <div class="foot-page">
            共{{outboundList.pageProps.total}}条
            <Page transfer
                  :total="outboundList.pageProps.total"
                  :page-size="outboundList.pageProps.perPage"
                  size="small"
                  show-elevator
                  show-sizer
                  @on-change="(page) => { changePage(page, 'outboundList') }"
                  @on-page-size-change="(size) => { changePageSize(size, 'outboundList') }"/>
          </div>
        </TabPane>


        <TabPane label="出库记录" name="outboundRecord">
          <!--          Table-->
          <Table border
                 :columns="outboundList.columns"
                 :data="outboundList.data"
                 :loading="tableLoading"
                 :style="currentTab !== 'outboundRecord' ? 'height: 0;': ''"
                 @on-selection-change="selectionChange">
          </Table>
          <!--          Page-->
          <div class="foot-page">
            共{{outboundList.pageProps.total}}条
            <Page transfer
                  :total="outboundList.pageProps.total"
                  :page-size="outboundList.pageProps.perPage"
                  size="small"
                  show-elevator
                  show-sizer
                  @on-change="(page) => { changePage(page, 'outboundList') }"
                  @on-page-size-change="(size) => { changePageSize(size, 'outboundList') }"/>
          </div>
        </TabPane>
      </Tabs>
    </Card>


    <!-- 申请审核/ 完成出库  -->
    <Modal class="reivew-modal" v-model="reviewModal.show" :title="reviewModal.title" width="1137">
      <Form inline ref="reviewForm" :model="reviewModal.form" :rules="rules">
        <div class="title">
          <span class="line"></span>
          <div class="title-text">基础信息</div>
          <span class="line"></span>
        </div>

        <FormItem label="申请人">
          <Input class="width-170" v-model="detailData.createdBy" readonly/>
        </FormItem>
        <FormItem label="申请时间">
          <Input class="width-170" v-model="detailData.createdAt" readonly/>
        </FormItem>
        <FormItem label="出库单号">
          <Input class="width-170" v-model="detailData.outboundOrderSn" readonly/>
        </FormItem>
        <FormItem label="品牌">
          <Input class="width-170" v-model="detailData.brand" readonly/>
        </FormItem>
        <FormItem label="灌包订单号">
          <Input class="width-170" v-model="detailData.gbOrderSn" readonly/>
        </FormItem>
        <FormItem label="订单数量">
          <Input class="width-170" v-model="detailData.orderNumber" readonly/>
        </FormItem>

        <FormItem label="慕可代码">
          <Input class="width-170" v-model="detailData.mkCode" readonly/>
        </FormItem>
        <FormItem label="产品名称">
          <Input class="width-170" v-model="detailData.productName" readonly/>
        </FormItem>
        <FormItem label="产品类型">
          <Input class="width-170" v-model="detailData.productType" readonly/>
        </FormItem>
        <FormItem label="要求货期">
          <Input class="width-170" v-model="detailData.requireDeliveryTime" readonly/>
        </FormItem>
        <FormItem label="供应商名称">
          <Input class="width-170" v-model="detailData.supplier" readonly/>
        </FormItem>
        <FormItem label="是否补发">
          <Input class="width-170" v-model="detailData.isReissue" readonly/>
        </FormItem>

        <FormItem label="补发类型">
          <Input class="width-170" v-model="detailData.reissueType" readonly/>
        </FormItem>
        <FormItem label="损耗记录单">
          <Input class="width-170" v-model="detailData.lossSn" readonly/>
        </FormItem>
        <FormItem label="损耗数量">
          <Input class="width-170" v-model="detailData.lossNumber" readonly/>
        </FormItem>
        <FormItem label="出库理由">
          <Input class="width-170" v-model="detailData.outboundReason" readonly/>
        </FormItem>

        <div class="title">
          <span class="line"></span>
          <div class="title-text">审核</div>
          <span class="line"></span>
        </div>
        <FormItem label="经办人">
          <Input class="width-170" v-model="detailData.handleBy" readonly/>
        </FormItem>
        <FormItem label="审核" prop="isPass" v-show="reviewModal.title === '出库单审核'">
          <RadioGroup v-model="reviewModal.form.isPass" class="width-120">
            <Radio label="yes">通过</Radio>
            <Radio label="no">驳回</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="预计本次出库量">
          <Input class="width-170" v-model="detailData.expectedOutboundNumber" readonly/>
        </FormItem>
        <FormItem label="已实际出库数量" v-show="reviewModal.title === '完成出库'">
          <Input class="width-170" v-model="detailData.expectedOutboundNumber" readonly/>
        </FormItem>
        <FormItem label="审核意见" prop="opinion">
          <Input style="width: 413px" v-model="reviewModal.form.opinion"/>
        </FormItem>
        <div style="text-align: center" v-if="reviewModal.title === '完成出库'">
          <a href="javascript:void(0)" @click="toOutbountRecord('reviewModal')" class="font-size-12">点击查看出库点出库记录>></a>
        </div>

      </Form>
      <Spin size="large" fix v-if="spinShow"></Spin>
      <div class="modal-footer" slot="footer">
        <Button type="default" @click="reviewModal.modal = false">取消</Button>
        <Button type="primary" @click="submit('reviewModal', 'reviewForm','outboundLsitReview')">确认</Button>
      </div>
    </Modal>

    <!-- 打印出库单  -->
    <Modal v-model="printModal.show" title="打印出库单" width="1137" footer-hide>
      <div id="print">
        <h3 style="text-align: center">防伪标出库申请单</h3>
        <div class="sub-title">一、申请出库明细</div>
        <div class="table-wrap">
          <table border cellpadding="0" cellspacing="0" class="table-style margin-bottom-10">
            <tbody>
            <tr class="td-title">
              <td>申请时间</td>
              <td>供应商</td>
              <td>灌包订单号</td>
              <td>品牌</td>
              <td>慕可代码</td>
              <td>产品名称</td>
              <td>要求货期</td>
              <td>紧急程度</td>
              <td>产品类型</td>
              <td>下单数量</td>
            </tr>
            <tr>
              <td>2020-04-10</td>
              <td>广州市藻谷生物科技有限公司</td>
              <td>MK-GB-20041325473</td>
              <td>WIS</td>
              <td>DP411</td>
              <td>+WIS+晶润紧致眼膜</td>
              <td>2020-04-30</td>
              <td>紧急</td>
              <td>新品</td>
              <td>10000</td>
            </tr>
            <tr class="td-title">
              <td>剩余可出库量</td>
              <td>是否补发</td>
              <td>补发类型</td>
              <td>损耗记录单</td>
              <td>损耗数量</td>
              <td>预计本次出库量</td>
              <td colspan="4">出库理由</td>
            </tr>
            <tr>
              <td>2020-04-10</td>
              <td>广州市藻谷生物科技有限公司</td>
              <td>MK-GB-20041325473</td>
              <td>WIS</td>
              <td>DP411</td>
              <td>+WIS+晶润紧致眼膜</td>
              <td colspan="4">紧急新品</td>
            </tr>
            </tbody>
          </table>
        </div>

        <Row>
          <Col span="8">
            <h3 class="margin-top-10">实际出库数量：</h3>
            <div class="fillin">231</div>
          </Col>
          <Col span="8">
            <h3 class="margin-top-10">送货员签名：</h3>
            <div class="fillin">312</div>
          </Col>
          <Col span="8">
            <h3 class="margin-top-10">预计送达时间：</h3>
            <div class="fillin">123</div>
          </Col>
        </Row>
        <Row class="font-size-12 margin-top-10 margin-bottom-10">
          <Col span="8">
            打印流水：001
          </Col>
          <Col span="8" offset="8">
            打印日期：2323-12-32
          </Col>
        </Row>

        <div class="dashed-line"></div>

        <div style="text-align: center" class="font-size-12">撕下上联随标附送给供应商，下联IT开发部留底</div>

        <Row type="flex" justify="space-between">
          <Col>
            <div class="sub-title">二、出库执行人：</div>
            <div class="sub-title">三、手动出库或打开钉钉，扫出库二维码</div>
            <div class="sub-title">四、拣货人员签名回传，提交出库数据</div>
          </Col>
          <Col>
            <div class="qrcode">sad</div>
          </Col>
        </Row>


        <Row>
          <Col span="8">
            <h3 class="margin-top-10">执行人：</h3>
            <div class="fillin">231</div>
          </Col>
          <Col span="8">
            <h3 class="margin-top-10">实际执行数量：</h3>
            <div class="fillin">312</div>
          </Col>
          <Col span="8">
            <h3 class="margin-top-10">执行日期：</h3>
            <div class="fillin">123</div>
          </Col>
        </Row>
        <Row class="font-size-12 margin-top-10">
          <Col span="8">
            打印流水：001
          </Col>
          <Col span="8" offset="8">
            打印日期：2323-12-32
          </Col>
        </Row>
      </div>
      <div style="text-align: right">
        <Button type="primary">打印</Button>
      </div>
      <Spin size="large" fix v-if="spinShow"></Spin>
      <!--      <div class="modal-footer" slot="footer">-->
      <!--        <Button type="default" @click="reviewModal.modal = false">取消</Button>-->
      <!--        <Button type="primary" @click="submit('reviewModal', 'outboundLsitReview')">确认</Button>-->
      <!--      </div>-->
    </Modal>

    <!-- 出库确认  -->
    <Modal class="reivew-modal" v-model="confirmModal.show" title="出库确认" width="1137">
      <Form inline ref="confirmForm" :model="confirmModal.form" :rules="rules">
        <div class="title">
          <span class="line"></span>
          <div class="title-text">基础信息</div>
          <span class="line"></span>
        </div>

        <FormItem label="申请人">
          <Input class="width-170" v-model="detailData.createdBy" readonly/>
        </FormItem>
        <FormItem label="申请时间">
          <Input class="width-170" v-model="detailData.createdAt" readonly/>
        </FormItem>
        <FormItem label="出库单号">
          <Input class="width-170" v-model="detailData.outboundOrderSn" readonly/>
        </FormItem>
        <FormItem label="品牌">
          <Input class="width-170" v-model="detailData.brand" readonly/>
        </FormItem>
        <FormItem label="灌包订单号">
          <Input class="width-170" v-model="detailData.gbOrderSn" readonly/>
        </FormItem>
        <FormItem label="订单数量">
          <Input class="width-170" v-model="detailData.orderNumber" readonly/>
        </FormItem>

        <FormItem label="慕可代码">
          <Input class="width-170" v-model="detailData.mkCode" readonly/>
        </FormItem>
        <FormItem label="产品名称">
          <Input class="width-170" v-model="detailData.productName" readonly/>
        </FormItem>
        <FormItem label="产品类型">
          <Input class="width-170" v-model="detailData.productType" readonly/>
        </FormItem>
        <FormItem label="要求货期">
          <Input class="width-170" v-model="detailData.requireDeliveryTime" readonly/>
        </FormItem>
        <FormItem label="供应商名称">
          <Input class="width-170" v-model="detailData.supplier" readonly/>
        </FormItem>
        <FormItem label="是否补发">
          <Input class="width-170" v-model="detailData.isReissue" readonly/>
        </FormItem>

        <FormItem label="补发类型">
          <Input class="width-170" v-model="detailData.reissueType" readonly/>
        </FormItem>
        <FormItem label="损耗记录单">
          <Input class="width-170" v-model="detailData.lossSn" readonly/>
        </FormItem>
        <FormItem label="损耗数量">
          <Input class="width-170" v-model="detailData.lossNumber" readonly/>
        </FormItem>

        <div class="title">
          <span class="line"></span>
          <div class="title-text">待确认出库</div>
          <span class="line"></span>
        </div>
        <FormItem label="出库人员">
          <Input class="width-170" v-model="detailData.handleBy" readonly/>
        </FormItem>
        <FormItem label="实际点货量" prop="isPass">
          <Input class="width-170" v-model="detailData.expectedOutboundNumber" readonly/>
        </FormItem>
        <FormItem label="出库仓位号">
          <Input class="width-170" v-model="detailData.expectedOutboundNumber" readonly/>
        </FormItem>
        <FormItem label="出库回传单附件">
          <Input class="width-170" v-model="detailData.expectedOutboundNumber" readonly/>
        </FormItem>
        <FormItem label="序列号表格" prop="opinion">
          <Input style="width: 413px" v-model="confirmModal.form.opinion"/>
        </FormItem>
        <div style="text-align: center">
          <a href="javascript:void(0)" class="font-size-12">点击查看出库点出库记录>></a>
        </div>

        <div class="title">
          <span class="line"></span>
          <div class="title-text">确认</div>
          <span class="line"></span>
        </div>
        <FormItem label="经办人">
          <Input class="width-170" v-model="detailData.handleBy" readonly/>
        </FormItem>
        <FormItem label="已实际出库数量">
          <Input class="width-170" v-model="detailData.expectedOutboundNumber" readonly/>
        </FormItem>
        <FormItem label="审核" prop="isPass">
          <RadioGroup v-model="confirmModal.form.isPass" class="width-120">
            <Radio label="yes">通过</Radio>
            <Radio label="no">驳回</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="审核意见" prop="opinion">
          <Input style="width: 413px" v-model="confirmModal.form.opinion"/>
        </FormItem>


      </Form>
      <Spin size="large" fix v-if="spinShow"></Spin>
      <div class="modal-footer" slot="footer">
        <Button type="default" @click="confirmModal.modal = false">取消</Button>
        <Button type="primary" @click="submit('confirmModal', 'outboundLsitReview')">确认</Button>
      </div>
    </Modal>

    <!-- 点货详情  -->
    <Modal class="reivew-modal" v-model="countGoodsModal.show" width="1137" footer-hide>
      <Form>
        <div slot="header">点货详情</div>
        <div class="title">
          <span class="line"></span>
          <div class="title-text">点货详情</div>
          <span class="line"></span>
        </div>


        <Row>
          <Col span="2">
            <FormItem label="序号" style="width: 100%">
              <Input/>
            </FormItem>
          </Col>
          <Col span="2">
            <FormItem label="编号" style="width: 100%">
              <Input/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="序列号起止" style="width: 100%;">
              <Input/>
            </FormItem>
          </Col>
          <Col span="1" style="padding-top: 34px; text-align: center">——</Col>
          <Col span="4">
            <FormItem style="width: 100%; padding-top: 34px">
              <Input/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="理论出库量" style="width: 100%">
              <Input/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="实际点货量" style="width: 100%">
              <Input/>
            </FormItem>
          </Col>
          <Col span="3">
            <FormItem label=" " style="width: 100%; padding-top: 34px">
              <!--              <Button shape="circle" icon="md-add" @click="addBatchData" v-if="index === 0"></Button>-->
              <Button shape="circle" icon="md-remove"></Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Row class="margin-top-10">
        <Col span="2" offset="15" style=" text-align: right; padding-top: 10px"> 总计</Col>
        <Col span="4"><Input/></Col>
      </Row>
      <Spin size="large" fix v-if="spinShow"></Spin>
    </Modal>

    <!-- 作废  -->
    <Modal class="reivew-modal" v-model="repealModal.show" title="作废入库记录" width="1137">
      <div class="title">
        <span class="line"></span>
        <div class="title-text">作废</div>
        <span class="line"></span>
      </div>

      <Form inline>
        <FormItem label="撤销人" class="width-170">
          <Input/>
        </FormItem>
        <FormItem label="意见" style="width: 500px">
          <Input/>
        </FormItem>
      </Form>


      <Spin size="large" fix v-if="spinShow"></Spin>
    </Modal>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        currentTab: 'outboundList',
        tableLoading: false,
        spinShow: false,
        selection: [],

        listSearchForm: {
          gbOrderSn: '',
          mkCode: '',
          productName: '',
          createdBy: '',
          createTime: '',
          outboundOrderSn: '',
          brand: ''
        },
        recordSearchForm: {
          name: ''
        },
        outboundList: {
          columns: [
            {type: 'selection', width: 60, align: 'center'},
            {title: '序号', type: 'index', width: 70, align: 'center'},
            {title: '申请人', key: 'created_by', width: 110, align: 'center'},
            {title: '申请时间', key: 'created_at', width: 110, align: 'center'},
            {title: '出库单号', key: 'outbound_order_sn', minWidth: 160, align: 'center'},
            {title: '是否补发', key: 'is_reissue', width: 70, align: 'center'},
            {title: '慕可代码', key: 'mk_code', minWidth: 100, align: 'center'},
            {title: '产品名称', key: 'product_name', minWidth: 160, align: 'center'},
            {title: '下单数量', key: 'order_number', minWidth: 100, align: 'center'},
            {title: '出库数量', key: 'expected_outbound_number', minWidth: 100, align: 'center'},
            {title: '出库状态', key: 'status', minWidth: 100, align: 'center'},
            {title: '已实际出库数量', key: 'confirmed_number', minWidth: 100, align: 'center'},
            {title: '要求货期', key: 'require_delivery_time', width: 110, align: 'center'},
            {title: '产品类型', key: 'product_type', minWidth: 100, align: 'center'},
            {title: 'OEM供应商', key: 'supplier', minWidth: 170, align: 'center'},
            // {title: '操作', key: 'action', align: 'center', slot: 'action', width: 130},
          ],
          data: [],
          pageProps: {
            page: 1,
            total: 0,
            perPage: 10
          },
        },
        outboundRecord: {
          columns: [
            {type: 'selection', width: 60, align: 'center'},
            {title: '序号', type: 'index', width: 70, align: 'center'},
            {title: '关联出库单号', key: 'name', align: 'center'},
            {title: '品牌', key: 'name', minWidth: 80, align: 'center'},
            {title: '灌包订单号', key: 'name', align: 'center'},
            {title: '出库记录状态', key: 'name', align: 'center'},
            {title: '实际点货数量', key: 'name', align: 'center'},
            {title: '出库序列号范围', key: 'name', align: 'center'},
            {title: '出库时间', key: 'name', align: 'center'},
            {title: '出库员', key: 'name', align: 'center'},
            {title: '出库类型', key: 'name', align: 'center'},
            {title: '出库仓位号', key: 'name', align: 'center'},
            {title: '供应商', key: 'name', align: 'center'},
            {title: '慕可代码', key: 'name', align: 'center'},
            {title: '产品名称', key: 'name', align: 'center'},
            {title: '下单数量', key: 'name', align: 'center'},
            {title: '预计本次出库量', key: 'name', align: 'center'}
            // {title: '操作', key: 'action', align: 'center', slot: 'action', width: 130},
          ],
          data: [],
          pageProps: {
            page: 1,
            total: 0,
            perPage: 10
          },
        },

        detailData: {
          createdBy: '',
          createdAt: '',
          outboundOrderSn: '',
          brand: '',
          gbOrderSn: '',
          orderNumber: '',
          mkCode: '',
          productName: '',
          productType: '',
          requireDeliveryTime: '',
          supplier: '',
          isReissue: '',
          reissueType: '',
          lossSn: '',
          outboundReason: '',
          handleBy: '',
          expectedOutboundNumber: '',
        },
        reviewModal: {
          show: false,
          title: '出库单审核',
          form: {
            outboundApplyId: '',
            isPass: 'yes',
            opinion: ''
          }
        },
        confirmModal: {
          show: false,
          form: {
            outboundApplyId: '',
            isPass: 'yes',
            opinion: ''
          }
        },
        countGoodsModal: {
          show: false,
          form: {}
        },
        repealModal: {
          show: false,
          form: {}
        },
        printModal: {
          show: false,
          data: []
        },
        rules: {
          isPass: [{required: true, message: '必填项', trigger: 'change'}],
          opinion: [{required: true, message: '必填项', trigger: 'blur'}]
        },
      }
    },
    watch: {
      currentTab(cur) {
        if(cur === 'outboundList') {
          this.listSearchForm = {
            gbOrderSn: '',
            mkCode: '',
            productName: '',
            createdBy: '',
            createTime: '',
            outboundOrderSn: '',
            brand: ''
          }
        }else {
          this.recordSearchForm = {
            name: ''
          }
        }
        this[cur].pageProps.page = 1
        this.init()
      }
    },
    methods: {
      // Form 操作
      addPlan() {
        if (this.selection.length > 1) return this.$Message.warning('一次只能操作一条数据')
      },

      editApply() {
        if (this.selection.length > 1) return this.$Message.warning('一次只能操作一条数据')
        if (this.selection.length === 0) return this.$Message.warning('请选择')
        this.$router.push({
          path: '/outbound-management/outbound-add',
          query: {
            id: this.selection[0].id
          }
        })
      },

      manualOutbound() {
        if (this.selection.length > 1) return this.$Message.warning('一次只能操作一条数据')
        if (this.selection.length === 0) return this.$Message.warning('请选择')
        this.$router.push({
          path: '/outbound-management/outbound-manual',
          query: {
            id: this.selection[0].id
          }
        })
      },

      search() {
        this[this.currentTab].pageProps.page = 1
        this.init()
      },
      // table 选项操作
      selectionChange(selection) {
        this.selection = selection
        console.log(this.selection)
      },
      // 改变当前分页
      changePage(page, key) {
        this[key].page = page;
        this.init();
      },
      // 改变分页size
      changePageSize(pageSize, key) {
        this[key].perPage = pageSize;
        this.init();
      },

      toOutbountRecord(modal = '') {
        this.currentTab = 'outboundRecord'
        modal && (this[modal].show = false)
      },

      showReviewModal(title) {
        if (this.selection.length > 1) return this.$Message.warning('一次只能操作一条数据')
        if (this.selection.length === 0) return this.$Message.warning('请选择')
        this.getOutboundDetail()
        this.reviewModal.show = true
        this.reviewModal.title = title
        this.reviewModal.form.outboundApplyId = this.selection[0].id
      },

      outboundConfirm() {
        // if (this.selection.length > 1) return this.$Message.warning('一次只能操作一条数据')
        // if (this.selection.length === 1) return this.$Message.warning('请选择')
        // this.getOutboundDetail()
        this.confirmModal.show = true
      },

      printOutboundSn() {
        this.printModal.show = true
      },

      repeal() {
        this.repealModal.show = true
      },

      submit(modal, form ,apiKey = 'outboundLsitReview') {
        let params = {}
        if(this[modal].title === '完成出库'){
          params = {
            id: this[modal].form.outboundApplyId,
            opinion: this[modal].form.opinion,
          }
          apiKey = 'outboundLsitFinished'
        }else {
          params = this[modal].form
        }

        this.$refs[form].validate(val => {
          if(!val) return
          this.$API[apiKey](params).then(res => {
            // if (res.code !== 0) return
            this.$Message.success(res.msg)
            this[modal].show = false
            this.$refs[form].resetFields()
            // console.log(this.$refs[form].resetFields())

            this[modal + 'ResetFields']()
            console.log(this[modal].form)
            this.init()
          })
        })
      },
      reviewModalResetFields() {
        this.reviewModal.form = {
          outboundApplyId: '',
          isPass: 'yes',
          opinion: ''
        }
      },

      init() {
        let currentTab = this.currentTab
        let params = {}

        let apiKey = currentTab === 'outboundList' ? 'getOutboundLsitIndex' : 'getOutboundRecordIndex'
        let form = currentTab === 'outboundRecord' ? this.recordSearchForm : this.listSearchForm

        for (let key in form) {
          !!form[key] && (params[key] = form[key])
        }
        params.page = this[currentTab].pageProps.page
        params.perPage = this[currentTab].pageProps.perPage

        this.tableLoading = true

        this.$API[apiKey](params).then(res => {
          // console.log(res)
          // if (res.code === 0) {
            let {count, page, list} = res.data
            this[currentTab].pageProps.page = page
            this[currentTab].pageProps.total = count
            this[currentTab].data = list
          // }
        }).finally(() => {
          this.tableLoading = false
        })

      },

      getOutboundDetail() {
        this.$API.getOutboundLsitDetail(this.selection[0].id).then(res => {
          console.log(res)
          // if (res.code !== 0) return
          this.spinShow = false
          for (let key in res.data) {
            this.detailData[key] = res.data[key]
          }
        })
      },
      getOutboundLsitIndex() {
      }
    },
    mounted() {
      this.init()
    }
  }
</script>

<style lang="less" scoped>
  .width-120 {
    width: 120px;
  }

  .width-170 {
    width: 170px;
  }

  .font-size-12 {
    font-size: 12px;
  }

  .foot-page {
    padding: 10px;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
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
      border-top: 1px solid #e9ebed;
    }
  }

  .reivew-modal {
    /deep/ .ivu-modal-header {
      padding-bottom: 0;
      border-bottom: none;
    }

    /deep/ .ivu-modal-body {
      padding-top: 0;
    }

    .modal-footer {
      text-align: right;
      position: relative;
    }

    .modal-footer /deep/ .left {
      position: absolute;
      left: 0;
    }
  }

  #print {
    padding: 0 15px;
  }

  .table-wrap {
    .table-style {
      text-align: center;
      width: 100%;
      border-collapse: collapse;

      tr {
        td {
          padding: 4px 8px;
          height: 40px;
          border: 1px #dcdee2 solid;
        }
      }
    }
  }

  .td-title {
    background-color: #eee;
  }

  .sub-title {
    padding: 10px 0;
  }

  .dashed-line {
    margin: 10px;
    height: 2px;
    border-bottom: 1px dashed #000;
  }

  .fillin {
    margin-bottom: 10px;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #5d5d5d;
  }
</style>