<template>
  <div id="destruction">
    <Card>
      <Row slot="title">
        <Form :model="iventoryform" inline>
            <Row type="flex" justify="space-between">
              <Col :xs="20">
                <FormItem prop="lossOrderSn">
                  <Input v-model="iventoryform.lossOrderSn" clearable placeholder="请输入损失单号"></Input>
                </FormItem>
                 <FormItem prop="createdBy">
                  <Input v-model="iventoryform.createdBy" clearable placeholder="请输入损耗记录人"></Input>
                </FormItem>
                <FormItem prop="createdTime">
                  <DatePicker v-model="iventoryform.createdTime" clearable type="date" placeholder="请选择记录时间"></DatePicker>
                </FormItem>
                <FormItem prop="supplier">
                  <Input v-model="iventoryform.supplier" clearable placeholder="请输入供应商"></Input>
                </FormItem>
                <FormItem prop="destructionStatus">
                  <Select clearable v-model="iventoryform.destructionStatus" placeholder="状态">
                      <Option v-for="item in statuList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </FormItem>
                <FormItem prop="outboundOrderSn">
                  <Input v-model="iventoryform.outboundOrderSn" clearable placeholder="出库单号"></Input>
                </FormItem>
              </Col>
              <Button type="primary" @click="searchedSubmit">搜索</Button>
            </Row>
            <Row>
              <Col>
                <Button type="primary" @click="exportSubmit">导出数据</Button>
                <Button type="primary" @click="addDesturction">添加消耗</Button>
                <Button type="primary" @click="firstSubmit">初审</Button>
                <Button type="primary" @click="reviewSubmit">复审</Button>
                <Button type="primary" @click="cancelSubmit">核销处理</Button>
                <Button type="primary">灌包补发申请</Button>
                <Button type="primary" @click="invalidSubmit">作废</Button>
              </Col>
            </Row>
        </Form>
        <Tabs>
           <TabPane label="损耗记录" name>
              <Table border ref="selection" 
                     :loading="tableLoading" 
                     @on-selection-change="selection => { selectionChange(selection) }"  
                     :columns="recordationList.inventoryList" 
                     :data="recordationList.iventorydata">
                <template slot-scope="scope" slot="action">
                <Tooltip placement="top" content="编辑" transfer>
                  <Button
                    type="primary"
                    icon="md-create"
                    :disabled="scope.row.destruction_status === '待复审' || scope.row.destruction_status === '待销毁' || scope.row.destruction_status === '已作废' || scope.row.destruction_status === '已销毁'"
                    @click="handleEdit(scope.index, scope.row)"
                  ></Button>
                </Tooltip>
                <Poptip
                  confirm
                  title="您确认删除这条内容吗？"
                  @on-ok="handleDelete(scope.index, scope.row)"
                  transfer
                >
                  <Button icon="md-trash"
                  :disabled="scope.row.destruction_status === '待复审' || scope.row.destruction_status === '待销毁' || scope.row.destruction_status === '已作废' || scope.row.destruction_status === '已销毁'"
                  ></Button>
                </Poptip>
              </template>
              </Table>
           </TabPane>
        </Tabs>
      </Row>
      <div style="margin:20px 0;overflow: hidden;padding: 2px">
        <div style="float:left">共 {{pageProps.count}} 条</div>
        <div style="float:right">
          <Page
            :total="pageProps.count"
            :current="Number(pageProps.page)"
            size="small"
            show-elevator
            show-sizer
            @on-change="changePage"
            @on-page-size-change="changePageSize"
          />
        </div>
      </div>
    </Card>
    <!-- 添加消耗 -->
    <Modal v-model="addform.modal" :title="addform.title" width="1300">
      <Card>
        <Row slot="title">
          <Row type="flex" justify="end">
            <Button type="primary" @click="addSubmit">确认提交</Button>
          </Row>
        </Row>
        <Form :model="addform.form" ref="addform" inline label-position="top" :rules="addRules">
          <Row>
            <Col :xs="24">
              <FormItem label="损耗记录人" prop="createdBy">
                 <Input readonly v-model="addform.form.createdBy" placeholder="损耗记录人" ></Input>
              </FormItem>
              <FormItem label="是否有出库单" prop="hasOutboundApply">
                 <Select v-model="addform.form.hasOutboundApply" placeholder="请选择" style="width:200px" @on-change="ckbtnChange" clearable>
                   <Option  v-for="(item,index) in ChuKuList" :value="item.value" :key="item.value">{{item.label}}</Option>
                 </Select>
              </FormItem>
              <FormItem label="请输入损耗数量" prop="lossNumber">
                 <Input number v-model="addform.form.lossNumber" placeholder="请输入"></Input>
              </FormItem>
              <FormItem label="下级经办人" prop="nextpeople">
                 <Input v-model="addform.form.nextpeople" placeholder="请输入"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row v-if="addform.form.hasOutboundApply === 'yes'">
            <Col>
             <FormItem label="请输入出库单号" prop="outboundOrderSn">
                 <Select
                  v-model="addform.form.outboundOrderSn"
                  filterable
                  remote
                  placeholder="请输入"
                  :remote-method="outSearch"
                  @on-change="SearchOne"
                  :loading="outloading">
                <Option v-for="(option, index) in outboundOrderSnList" :value="option.outbound_order_sn" :key="index">{{option.outbound_order_sn}}</Option>
            </Select>
             </FormItem>
             <FormItem label="灌包订单号" prop="gb_order_sn">
                <Input readonly v-model="addform.form.gb_order_sn" placeholder="请输入"></Input>
             </FormItem>
             <FormItem label="品牌" prop="brand">
                <Input readonly v-model="addform.form.brand" placeholder="请输入"></Input>
             </FormItem>
             <FormItem label="慕可代码" prop="mk_code">
                <Input readonly v-model="addform.form.mk_code" placeholder="请输入"></Input>
             </FormItem>
             <FormItem label="产品名称" prop="product_name">
                <Input readonly v-model="addform.form.product_name" placeholder="请输入"></Input>
             </FormItem>
             <FormItem label="下单数量" prop="order_number">
                <Input readonly v-model="addform.form.order_number" placeholder="请输入"></Input>
             </FormItem>
             <FormItem label="实际出库量" prop="confirmed_number">
                <Input readonly v-model="addform.form.confirmed_number" placeholder="请输入"></Input>
             </FormItem>
           
             <FormItem label="OEM供应商">
                <Input readonly v-model="addform.form.supplier" placeholder="请输入"></Input>
             </FormItem>
             <FormItem label="标类型">
                <Select v-model="addform.form.markType" placeholder="请选择" style="width:200px" clearable>
                   <Option  v-for="(item,index) in markTypeList" :value="item.value" :key="item.value">{{item.label}}</Option>
                 </Select>
             </FormItem>
            </Col>
          </Row>
          <Row v-else-if="addform.form.hasOutboundApply === 'no'">
            <Col>
              <FormItem label="品牌" prop="brand">
                <Input v-model="addform.form.brand" placeholder="请输入"></Input>
              </FormItem>
              <FormItem label="OEM供应商" prop="supplier">
                <Input v-model="addform.form.supplier" placeholder="请输入"></Input>
              </FormItem>
              <FormItem label="标类型" prop="markType">
                <Select v-model="addform.form.markType" placeholder="请选择" style="width:200px" clearable>
                   <Option  v-for="(item,index) in markTypeList" :value="item.value" :key="item.value">{{item.label}}</Option>
                 </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormItem label="损耗理由" prop="lossReason">
                <Input v-model="addform.form.lossReason" placeholder="请输入" style="width:800px"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <FormItem label="损耗凭证" prop="lossFileItems">
              <Upload
              :action="fileUploadURL"
              :before-upload="handleUpload"
              :default-file-list="addform.form.lossFileItems"
              :headers="fileUploadHeaders"
              :on-success="onsuccess"
              :on-remove="onremove"
              :on-error="onerror"
              :on-exceeded-size="onOverMaxSize"
              :show-upload-list="false"
              >
                <Button icon="ios-cloud-upload-outline" class="margin-bottom-10">选择文件</Button>
              </Upload>
               <p style="color:red">请上传盘点凭证</p>
               <div class="upload-list" v-for="(file, index) in addform.form.lossFileItems" :key="index">
                <a
                  :href="file.url"
                  :download="file.name"
                  class="download-link"
                >{{file.name}}</a>
                <Icon
                  type="ios-trash-outline"
                  size="14"
                  class="icon-trash"
                  @click="onremove(index)"
                />
              </div>
            </FormItem>
          </Row>
        </Form>
      </Card>
       <div slot="footer"></div>
    </Modal>
    <!-- 初审 -->
    <Modal v-model="firstModal.modal" :title="firstModal.title" width="1300">
      <Form ref="firstModal" inline :model="firstModal.form" label-position="top" :rules="firstAuditRules">
         <div class="title">
          <span class="line"></span>
          <div class="title-text">基础信息</div>
          <span class="line"></span>
        </div>
         <Row :xs="24" style="padding:0 20px">
           <FormItem label="损耗记录人" prop="created_by">
              <Input readonly v-model="firstModal.form.created_by" placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="申请时间" prop="created_at">
              <Input readonly v-model="firstModal.form.created_at" placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="损耗单号" prop="loss_order_sn">
              <Input readonly v-model="firstModal.form.loss_order_sn"  placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="是否有出库单" prop="has_outbound_apply">
              <Input readonly v-model="firstModal.form.has_outbound_apply"  placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="品牌" prop="im_brand">
              <Input readonly v-model="firstModal.form.im_brand"  placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="标类型" prop="mark_type">
              <Input readonly v-model="firstModal.form.mark_type"  placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="损耗数量" prop="loss_number">
              <Input readonly v-model="firstModal.form.loss_number"  placeholder="请输入" style="width:160px"></Input>
           </FormItem>
         </Row>
         <Row :xs="24" style="padding:0 20px">
           <FormItem label="灌包订单号" prop="gb_order_sn">
              <Input readonly v-model="firstModal.form.gb_order_sn"  placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="慕可代码" prop="mk_code">
              <Input readonly v-model="firstModal.form.mk_code"  placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="产品名称" prop="product_name">
              <Input readonly v-model="firstModal.form.product_name"  placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="OEM供应" prop="im_supplier">
              <Input readonly  v-model="firstModal.form.im_supplier"  placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="实际出库" prop="confirmed_number">
              <Input readonly v-model="firstModal.form.confirmed_number"  placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <!-- <FormItem label="出库序列号范围">
              <Input placeholder="请输入" style="width:160px"></Input>
           </FormItem> -->
         </Row>
         <Row style="padding:0 20px">
           <FormItem label="损耗理由" prop="loss_reason">
              <Input readonly v-model="firstModal.form.loss_reason"  placeholder="请输入" style="width:700px"></Input>
           </FormItem>
           <FormItem label="损耗凭证">
              <div>
                 <a :href="file.url" :download="file.name" class="download-link"
               v-for="(file, index) in Array(firstModal.form.lossFileItems)"
               :key="index">{{file.name}}</a>
              </div>
           </FormItem>
         </Row>
         <div class="title">
          <span class="line"></span>
          <div class="title-text">初审</div>
          <span class="line"></span>
        </div>
         <Row style="padding:0 30px">
          <FormItem label="经办人">
            <Input v-model="firstModal.form.people" readonly placeholder="经办人"></Input>
          </FormItem>
          <FormItem  label="审核" style="padding:0 0px 0 30px" prop="isPass">
            <RadioGroup v-model="firstModal.form.isPass">
              <Radio label="通过"></Radio>
              <Radio label="驳回"></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="审核意见" style="padding:0 0px 0 40px" prop="opinion">
            <Input
              v-model="firstModal.form.opinion"
              style="width:500px;"
              clearable
              placeholder="请输入"
            ></Input>
          </FormItem>
          <FormItem label="下级经办人">
            <Input v-model="firstModal.form.nextpeople"  placeholder="请输入"></Input>
          </FormItem>
        </Row>
      </Form>
       <div class="modal-footer" slot="footer">
        <Button type="default" @click="firstModal.modal = false">取消</Button>
        <Button type="primary" @click="firstSave('firstModal', 'firstModal')">提交</Button>
      </div>
    </Modal>
    <!-- 复审 -->
    <Modal v-model="reviewModal.modal" :title="reviewModal.title" width="1300">
      <Form ref="reviewModal" inline :model="reviewModal.form" label-position="top" :rules="reAuditrules">
         <div class="title">
          <span class="line"></span>
          <div class="title-text">基础信息</div>
          <span class="line"></span>
        </div>
         <Row :xs="24" style="padding:0 20px">
           <FormItem label="损耗记录人"  prop="created_by">
              <Input readonly v-model="reviewModal.form.created_by" placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="申请时间" prop="created_at">
              <Input readonly v-model="reviewModal.form.created_at" placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="损耗单号" prop="loss_order_sn">
              <Input readonly v-model="reviewModal.form.loss_order_sn" placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="是否有出库单" prop="has_outbound_apply">
              <Input readonly v-model="reviewModal.form.has_outbound_apply" placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="品牌" prop="im_brand">
              <Input readonly v-model="reviewModal.form.im_brand" placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="标类型" prop="mark_type">
              <Input readonly v-model="reviewModal.form.mark_type" placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="损耗数量" prop="loss_number">
              <Input readonly v-model="reviewModal.form.loss_number" placeholder="请输入" style="width:160px"></Input>
           </FormItem>
         </Row>
         <Row :xs="24" style="padding:0 20px">
           <FormItem label="灌包订单号" prop="gb_order_sn">
              <Input readonly v-model="reviewModal.form.gb_order_sn" placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="慕可代码" prop="mk_code">
              <Input readonly v-model="reviewModal.form.mk_code" placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="产品名称" prop="product_name">
              <Input readonly v-model="reviewModal.form.product_name" placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="OEM供应" prop="im_supplier">
              <Input readonly v-model="reviewModal.form.im_supplier" placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="实际出库" prop="confirmed_number">
              <Input readonly v-model="reviewModal.form.confirmed_number" placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <!-- <FormItem label="出库序列号范围">
              <Input placeholder="请输入" style="width:160px"></Input>
           </FormItem> -->
         </Row>
         <Row style="padding:0 20px">
           <FormItem label="损耗理由" prop="loss_reason">
              <Input readonly v-model="reviewModal.form.loss_reason" placeholder="请输入" style="width:685px"></Input>
           </FormItem>
           <FormItem label="损耗凭证">
              <a :href="file.url" :download="file.name" class="download-link"
               v-for="(file, index) in Array(reviewModal.form.lossFileItems)"
               :key="index">{{file.name}}</a>
           </FormItem>
         </Row>
         <div class="title">
          <span class="line"></span>
          <div class="title-text">审核</div>
          <span class="line"></span>
        </div>
        <Row style="padding:0 30px">
          <FormItem label="经办人" prop="people">
             <Input readonly v-model="reviewModal.form.people" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="初审时间" prop="createdAt">
             <Input readonly v-model="reviewModal.form.createdAt" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="审核意见" prop="firstopinion">
             <Input readonly v-model="reviewModal.form.firstopinion" placeholder="请输入" style="width:700px"></Input>
          </FormItem>
        </Row>
         <div class="title">
          <span class="line"></span>
          <div class="title-text">复审</div>
          <span class="line"></span>
        </div>
         <Row style="padding:0 30px">
          <FormItem label="经办人" prop="people">
            <Input readonly v-model="reviewModal.form.people" placeholder="经办人"></Input>
          </FormItem>
          <FormItem  label="审核" style="padding:0 0px 0 30px" prop="isPass">
            <RadioGroup v-model="reviewModal.form.isPass">
              <Radio label="通过"></Radio>
              <Radio label="驳回"></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="审核意见" style="padding:0 0px 0 40px" prop="opinion">
            <Input
              v-model="reviewModal.form.opinion"
              style="width:500px;"
              clearable
              placeholder="请输入"
            ></Input>
          </FormItem>
          <FormItem label="下级经办人">
            <Input   placeholder="请输入"></Input>
          </FormItem>
        </Row>
      </Form>
       <div class="modal-footer" slot="footer">
        <Button type="default" @click="reviewModal.modal = false">取消</Button>
        <Button type="primary" @click="reviewSave('reviewModal', 'reviewModal')">提交</Button>
      </div>
    </Modal>
    <!-- 核销处理 -->
    <Modal v-model="cancelModal.modal" :title="cancelModal.title" width="1300">
       <Form ref="cancelModal" inline :model="cancelModal.form" label-position="top" :rules="cancelRules">
         <div class="title">
          <span class="line"></span>
          <div class="title-text">基础信息</div>
          <span class="line"></span>
        </div>
         <Row :xs="24" style="padding:0 20px">
           <FormItem label="损耗记录人" prop="created_by">
              <Input readonly v-model="cancelModal.form.created_by" placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="申请时间" prop="created_at">
              <Input readonly v-model="cancelModal.form.created_at" placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="损耗单号" prop="loss_order_sn">
              <Input readonly v-model="cancelModal.form.loss_order_sn" placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="是否有出库单" prop="has_outbound_apply">
              <Input readonly v-model="cancelModal.form.has_outbound_apply" placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="品牌" prop="im_brand">
              <Input readonly v-model="cancelModal.form.im_brand" placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="标类型" prop="mark_type">
              <Input readonly v-model="cancelModal.form.mark_type" placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="损耗数量" prop="loss_number">
              <Input readonly v-model="cancelModal.form.loss_number" placeholder="请输入" style="width:160px"></Input>
           </FormItem>
         </Row>
         <Row :xs="24" style="padding:0 20px">
           <FormItem label="灌包订单号" prop="gb_order_sn">
              <Input readonly v-model="cancelModal.form.gb_order_sn" placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="慕可代码">
              <Input readonly v-model="cancelModal.form.mk_code" placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="产品名称" prop="product_name">
              <Input readonly v-model="cancelModal.form.product_name" placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="OEM供应" prop="im_supplier">
              <Input readonly v-model="cancelModal.form.im_supplier" placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="实际出库" prop="confirmed_number">
              <Input readonly v-model="cancelModal.form.confirmed_number" placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <!-- <FormItem label="出库序列号范围">
              <Input placeholder="请输入" style="width:160px"></Input>
           </FormItem> -->
         </Row>
         <Row style="padding:0 20px">
           <FormItem label="损耗理由" prop="loss_reason">
              <Input readonly v-model="cancelModal.form.loss_reason" placeholder="请输入" style="width:700px"></Input>
           </FormItem>
           <FormItem label="损耗凭证">
              <a :href="file.url" :download="file.name" class="download-link"
               v-for="(file, index) in Array(cancelModal.form.lossFileItems)"
               :key="index">{{file.name}}</a>
           </FormItem>
         </Row>
         <div class="title">
          <span class="line"></span>
          <div class="title-text">核销处理</div>
          <span class="line"></span>
        </div>
        <Row style="padding:0 20px">
          <FormItem label="经办人">
             <Input readonly v-model="cancelModal.form.created_by" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="核销数量" prop="writeOffNumber">
             <Input v-model="cancelModal.form.writeOffNumber" @on-blur="writeBlurClick(cancelModal.form.writeOffNumber)" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="核销类型" prop="writeOffType">
             <Input v-model="cancelModal.form.writeOffType" placeholder="请输入" ></Input>
          </FormItem>
          <FormItem label="核销备注" prop="remark">
             <Input v-model="cancelModal.form.remark" placeholder="请输入"></Input>
          </FormItem>
        </Row>
        <Row  style="padding:0 20px">
            <FormItem label="核销凭证" prop="writeOffFileItems">
              <Upload
              :action="fileUploadURL"
              :before-upload="handleUpload"
              :default-file-list="cancelModal.form.writeOffFileItems"
              :headers="fileUploadHeaders"
              :on-success="oncancelsuccess"
              :on-remove="onremove"
              :on-error="onerror"
              :on-exceeded-size="onOverMaxSize"
              :show-upload-list="false">
                <Button icon="ios-cloud-upload-outline" class="margin-bottom-10">选择文件</Button>
              </Upload>
                <p style="color:red">请上传防伪标核销凭证</p>
                <div class="upload-list" v-for="(file, index) in cancelModal.form.writeOffFileItems" :key="index">
                <a
                  :href="file.url"
                  :download="file.name"
                  class="download-link"
                >{{file.name}}</a>
                <Icon
                  type="ios-trash-outline"
                  size="14"
                  class="icon-trash"
                  @click="onremove(index)"
                />
              </div>
            </FormItem>
          </Row>
      </Form>
      <div class="modal-footer" slot="footer">
        <Button type="default" @click="cancelModal.modal = false">取消</Button>
        <Button type="primary" @click="cancelSave('cancelModal', 'cancelModal')" :disabled="cancaelbutton">提交</Button>
      </div>
    </Modal>
    <!-- 作废 -->
    <Modal v-model="invalidModal.modal" title="作废记录" width="1000">
      <Form ref="invalidModal" inline  :model="invalidModal.form" label-position="top" :rules="invalidRules">
        <div class="title">
          <span class="line"></span>
          <div class="title-text">作废</div>
          <span class="line"></span>
        </div>
        <Row>
          <FormItem label="撤销人">
            <Input v-model="invalidModal.form.revocatpeople"readonly placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="意见" prop="opinion">
            <Input
              v-model="invalidModal.form.opinion"
              style="width:600px"
              clearable
              placeholder="请输入"
            ></Input>
          </FormItem>
        </Row>
      </Form>
      <div class="modal-footer" slot="footer">
        <Button type="default" @click="invalidModal.modal = false">取消</Button>
        <Button type="primary" @click="invalSave('invalidModal','invalidModal')">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import Cookies from "js-cookie";
import { SERVER_BASE_URL } from "../../api/config";
export default {
  data(){
    return{
      // 上传地址
      fileUploadURL: `${SERVER_BASE_URL}traceability/traceability/upload`,
      fileUploadHeaders: {
        Authorization: Cookies.get("authorization")
      },
      iventoryform:{
         lossOrderSn:'',//损耗单号
         createdBy:'', //损耗记录人
         createdTime:'', //记录时间
         supplier:'', //供应商
         destructionStatus:'', //损耗状态
         outboundOrderSn:'', //出库单号

      },
      tableLoading:false, //表
      // 当前选择的状态
      // 出库单号
      outboundOrderSnList:[],
      outloading:false,
      // 添加
      addform:{
        modal:false,
        title:'',
        form:{
           uuid:'', //每行id
           id:'', //出库清单id
           createdBy:'', //损耗记录人
           hasOutboundApply:'', //是否有出库单
           lossNumber:'', //s损耗数量
           nextpeople:'', //下级经办人
           brand:'', //品牌
           supplier:'', //OEM供应商
           markType:'', //标类型
           lossReason:'', //损耗理由
           lossFileItems:[], //损耗凭证
           outboundOrderSn:'', //出库单号
           gb_order_sn:'', //灌包订单号，
           mk_code:'', //慕可代码
           product_name:'', //产品名称
           order_number:'', //下单数量
           confirmed_number:'', //实际出库量
        }
      },
      // 添加验证
      addRules:{
           lossNumber:[{required:true, type:'number', message: "损耗数量不能为空", trigger: "blur" }],
           lossReason:[{required:true,message:'损耗理由不能为空',trigger:'blur'}],
           brand:[{required:true,message:'品牌不能为空',trigger:'blur'}],
           outboundOrderSn:[{required:true,message:'出库单号不能为空',trigger:'change'}],
           markType:[{required:true,message:'标类型不能为空',trigger:'change'}],
           supplier:[{required:true,message:'OEM供应商不能为空',trigger:'blur'}]
      },
      // 初审
      firstModal:{
        modal:false,
        title:'损耗单的审核',
        form:{
          created_by:'', //损耗记录人
          created_at:'', //申请时间
          loss_order_sn:'', //损失单号
          has_outbound_apply:'', //是否有出库单
          im_brand:'', //品牌
          mark_type:'', //标类型
          loss_number:'', //损耗数量
          gb_order_sn:'',//灌包订单号
          mk_code:'', //慕可代码
          product_name:'', //产品名称
          im_supplier:'', //oEM供应
          confirmed_number:'', //实际出库
          loss_reason:'', //损耗原因
          lossFileItems:[],
          people:'', //经办人
          nextpeople:'', //下级经办人
          isPass:'', //是否通过
          opinion:'', //审核意见
        }
      },
      // 复审
      reviewModal:{
        modal:false,
        title:'损耗单的审核',
        form:{
          id:'', //
          created_by:'', //损耗记录人
          created_at:'', //申请时间
          loss_order_sn:'',//损耗单号
          has_outbound_apply:'',// 是否有出库单
          im_brand:'', //品牌
          mark_type:'', //标类型
          loss_number:'',// 损耗数量
          gb_order_sn:'', //管饱订单号
          mk_code:'', //慕可代码
          product_name:'', //产品名称
          im_supplier:'', //OEM供应商
          confirmed_number:'', //实际出库量
          loss_reason:'', //损耗理由
          lossFileItems:[], //损耗凭证
          people:'', //经办人
          createdAt:'', //初审时间
          firstopinion:'',//初审审核意见
          isPass:'', //复审审核
          opinion:'', //复审审核意见
        }
      },
      // 核销处理
      cancelModal:{
        modal:false,
        title:'核销处理',
        form:{
            id:'', //
            created_by:'', //损耗记录人
            created_at:'', //申请时间
            loss_order_sn:'',//损耗单号
            has_outbound_apply:'',// 是否有出库单
            im_brand:'', //品牌
            mark_type:'', //标类型
            loss_number:'',// 损耗数量
            gb_order_sn:'', //管饱订单号
            mk_code:'', //慕可代码
            product_name:'', //产品名称
            im_supplier:'', //OEM供应商
            confirmed_number:'', //实际出库量
            loss_reason:'', //损耗理由
            lossFileItems:[], //损耗凭证
            people:'', //经办人
            writeOffNumber:'', //核销数量
            writeOffType:'', //核销类型
            remark:'', //核销备注
            writeOffFileItems:[], //核销凭证
        }
      },
      cancaelbutton:false, //核销处理的保存按钮
      // 作废处理
      // 作废
      invalidModal: {
        modal: false,
        form: {
          revocatpeople: "", //撤销人
          opinion: "" //意见
        }
      },
      // 出库列表
      ChuKuList:[
        {
          label:'是',
          value:'yes',
        },
        {
          label:'否',
          value:'no'
        }
      ],
      // 标类型
      markTypeList:[
        {
          label:'平标',
          value:'P'
        },
        {
          label:'卷标',
          value:'J'
        }
      ],
      // 表的数据
      recordationList:{
          selection:[], //选择
          inventoryList: [
            {
              type: "selection",
              key:'selection',
              width: 60,
              align: "center",
              fixed: "left"
            },
            {
              title: "序号",
              key: 'num',
              width: 80,
              align: "center",
              sortable: true,//开启排序
              sortType:"dec",//初始化排序
              render:(h,params) => {
                return h('span',(params.index+1))
              }

            },
            {
              title:'损耗记录人',
              key:'created_by',
              width:150,
              align:'center'
            },
            {
              title:'记录时间',
              key:'created_at',
              width:200,
              align:'center'
            },
            {
              title:'损耗单号',
              key:'loss_order_sn',
              width:200,
              align:'center'
            },
            {
              title:'是否有出库单',
              key:'has_outbound_apply',
              width:150,
              align:'center'
            },
            {
              title:'出库单号',
              key:'outbound_order_sn',
              width:200,
              align:'center'
            },
            {
              title:'OEM供应商',
              key:'im_supplier',
              width:250,
              align:'center'
            },
            {
              title:'损耗数量',
              key:'im_loss_number',
              width:100,
              align:'center'
            },
            {
              title:'状态',
              width:100,
              key:'destruction_status',
              align:'center'
            },
            {
              title:'是否补发',
              width:'150',
              key:'is_reissue',
              align:'center'
            },
            {
              title:'操作',
              slot:'action',
              align:'center',
              width:200
            }
          ],
          iventorydata:[] //表里面的数据
      },
      // 页码
      pageProps: {
        page: "",
        perPage: "",
        count: 0,
        pageCount:'', //记录当前第几页
      },
      // 初审验证
      firstAuditRules:{
        isPass:[{required:true,message:'审核不能为空',trigger:'change'}],
        opinion:[{required:true,message:'审核意见不能为空',trigger:'blur'}]
      },
      // 复审验证
      reAuditrules:{
        isPass:[{required:true,message:'审核不能为空',trigger:'change'}],
        opinion:[{required:true,message:'审核意见不能为空',trigger:'blur'}]
      },
      // 作废验证
      invalidRules:{
        opinion:[{required:true,message:'审核意见不能为空',trigger:'blur'}]
      },
      // 核销处理验证
      cancelRules:{
        writeOffNumber:[{required:true,message:'核销数量不能为空',trigger:'blur'}],
        writeOffType:[{required:true,message:'核销类型不能为空',trigger:'blur'}],
        remark:[{required:true,message:'核销备注不能为空',trigger:'blur'}]
      },
      statuList:[
        {
          label:'待初审',
          value:'auditPending'
        },
        {
          label:'已驳回',
          value:'rejected'
        },
        {
          label:'待复审',
          value:'auditRecheckPending'
        },
        {
          label:'待销毁',
          value:'destoryPending'
        },
        {
          label:'已销毁',
          value:'destroyed'
        },
        {
          label:'已作废',
          value:'voided'
        }
      ]
    } 
  },
  mounted(){
    this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
    this.getList();
  },
  methods:{
    // 搜索
    searchedSubmit(){
      if(this.pageProps.page > 1){
        this.pageProps.page = 1;
      }
      this.getList();
    },
    // 列表数据
    getList(){
      let params = this.iventoryform;
      params.type = 'write_off';
      params.page = this.pageProps.page;
      params.perPage = this.pageProps.perPage;
      this.tableLoading = true
      this.$API.inventoryConsumptionList(params).then(res =>{
        if(res.code === 0){
          this.recordationList.iventorydata = res.data.list;
          this.pageProps = res.data;
        }
      }).finally(() => {
          this.tableLoading = false
      })
    },
    // 添加消耗
    addDesturction(){
      this.$refs.addform.resetFields(); //清楚上一次验证,同时也会将数据清空
      this.addform.modal = true;
      this.addform.title= "添加";
      this.addform.form.createdBy = this.userInfo.realName;
      this.addform.form.uuid = "";
    },
    // 添加/编辑保存按钮
    addSubmit(){
       this.$refs.addform.validate(valid => {
         if(valid){
           if(this.addform.form.lossFileItems.length <=0) return this.$Message.error("请上传文件");
           let params = {};
            params.type = 'write_off';
            params.lossFileItems = this.addform.form.lossFileItems;
            params.hasOutboundApply = this.addform.form.hasOutboundApply;
            params.lossNumber = this.addform.form.lossNumber;
            params.lossReason = this.addform.form.lossReason;
            params.brand = this.addform.form.brand;
            params.supplier = this.addform.form.supplier;
            params.markType = this.addform.form.markType;
            params.outboundApplyId = Number(this.addform.form.id);
            // 编辑
            if(this.addform.form.uuid){
              if(params.hasOutboundApply === 'no'){
                delete  params.outboundApplyId;
              }
               params.id = this.addform.form.uuid;
               this.$API.inventoryConsumptionUpdate(params).then(res => {
                 if(res.code === 0){
                   this.$Message.success(res.msg);
                   this.addform.modal = false;
                   this.getList();
                 }
               })
            }
            // // 添加
            else{
              delete this.addform.form.uuid;
              if(params.hasOutboundApply === 'no'){
                 delete  params.outboundApplyId;
              }
               this.$API.inventoryConsumptionAdd(params).then(res => {
                if(res.code === 0){
                  this.addform.modal = false;
                  this.$Message.success(res.msg);
                  this.pageProps.page = 1;
                  this.getList();
                }
              })
            }
           
         }
       })
    },
    // 切换是否重置
    getReset(){
      this.addform.form.brand = "";
      this.addform.form.supplier = "";
      this.addform.form.markType = "";
      this.addform.form.confirmed_number = "";
      this.addform.form.order_number = "";
      this.addform.form.product_name = "";
      this.addform.form.mk_code = "";
      this.addform.form.gb_order_sn = "";
      this.addform.form.outboundOrderSn = "";
    },
    // 是否有出库单选择
    ckbtnChange(value){
      this.getReset();
    },
    //出库单号模糊搜索
    outSearch(query){
      if(query !== ""){
        this.outloading = true;
        let params = {};
        params.outboundOrderSn = query;
        this.$API.inventoryConsumptionFuzzysearch(params).then(res => {
          if(res.code === 0){
            this.addform.form.id = res.data[0].id; //编辑的时候拿到出库id
            this.outboundOrderSnList = res.data;
          }
        }).finally(() => {
              this.outloading = false;
        })
      }
      else{
        this.outboundOrderSnList = [];
      }
    },
    // 当选中的那个
    SearchOne(value){
     for(let i = 0; i<this.outboundOrderSnList.length;i++){
       if(this.outboundOrderSnList[i].outbound_order_sn === value){
           this.addform.form.id = this.outboundOrderSnList[i].id ? this.outboundOrderSnList[i].id : undefined;
           this.addform.form.gb_order_sn = this.outboundOrderSnList[i].gb_order_sn
           this.addform.form.brand = this.outboundOrderSnList[i].brand
           this.addform.form.mk_code = this.outboundOrderSnList[i].mk_code
           this.addform.form.product_name = this.outboundOrderSnList[i].product_name
           this.addform.form.order_number = this.outboundOrderSnList[i].order_number
           this.addform.form.supplier = this.outboundOrderSnList[i].supplier 
           this.addform.form.confirmed_number = this.outboundOrderSnList[i].order_number; 
           
       }
     }
    },
    // 操作验证
    operationVerify() {
        let msg;
        if (this.recordationList.selection.length <= 0) return msg = '请选择一条数据'
        if (this.recordationList.selection.length > 1) return msg = '一次只能操作一条数据'
      },
    selectionChange(selection) {
        this.recordationList.selection = selection
    },
    // 初审
    firstSubmit(){
      let msg = this.operationVerify();
      if (msg) return this.$Message.warning(msg);
      let {id,destruction_status} = this.recordationList.selection[0];
      if(destruction_status === "已驳回" || destruction_status ==="待复审" || destruction_status==="待销毁") return this.$Message.warning("已审核");
      if(destruction_status === "已作废" || destruction_status === "已销毁") return this.$Message.warning("该状态不能进行审核");
      this.$refs.firstModal.resetFields(); //清楚上一次验证,同时也会将数据清空
      this.firstModal.modal = true;
      // 详情
      this.$API.inventoryConsumptionDetail(id).then(res => {
        this.firstModal.form = res.data;
        this.firstModal.form.people = this.userInfo.realName;
        this.firstModal.form.has_outbound_apply = res.data.has_outbound_apply === 'yes'? '是':res.data.has_outbound_apply === 'no'?'否':'';
        this.firstModal.form.mark_type = res.data.mark_type === 'P'?'平标':res.data.mark_type === 'J'?'卷标':'';
        this.firstModal.form.created_at = this.formatDays(res.data.created_at);
      })
    },
    // 初审保存
    firstSave(modal,form){
       this.$refs[form].validate(valid => {
         if(valid){
           let params = {};
           params.id = this.firstModal.form.id;
           params.isPass = this.firstModal.form.isPass === '通过'?'yes':this.firstModal.form.isPass ===  '驳回'?'no':'';
           params.opinion = this.firstModal.form.opinion;
           params.type = 'write_off';
           this.$API.inventoryConsumptionFirst(params).then(res => {
             if(res.code === 0){
               this.firstModal.modal = false;
               this.getList();
             }
           })
         }
       })
    },
    // 复审
    reviewSubmit(){
      let msg = this.operationVerify();
      if (msg) return this.$Message.warning(msg);
      let {destruction_status,id} = this.recordationList.selection[0];
      if(destruction_status === "已驳回" || destruction_status === "待初审") return this.$Message.warning("初审未通过或未审核");
      if(destruction_status === "待销毁") return this.$Message.warning("已经审核");
      if(destruction_status === "已作废" || destruction_status === "已销毁") return this.$Message.warning("该状态不能进行审核");
      this.reviewModal.modal = true;
      // 详情
      this.$API.inventoryConsumptionDetail(id).then(res => {
          this.reviewModal.form = res.data;
          this.reviewModal.form.has_outbound_apply = res.data.has_outbound_apply === 'yes'?'是':res.data.has_outbound_apply === 'no'?'否':'';
          this.reviewModal.form.mark_type = res.data.mark_type === 'J'?'卷标':res.data.mark_type === 'P'?'平标':'';
          this.reviewModal.form.people = res.data.auditPendingLog.createdBy;
          this.reviewModal.form.createdAt = this.formatDays(res.data.auditPendingLog.createdAt);
          this.reviewModal.form.firstopinion = res.data.auditPendingLog.ext.opinion;
           this.reviewModal.form.created_at = this.formatDays(res.data.created_at);
        })
    },
    // 复审保存
    reviewSave(modal,form){
      this.$refs[form].validate(valid => {
         if(valid){
            let params = {};
            params.id = this.reviewModal.form.id;
            params.isPass = this.reviewModal.form.isPass === '通过'?'yes':this.reviewModal.form.isPass ===  '驳回'?'no':'';
            params.opinion = this.reviewModal.form.opinion;
            params.type = 'write_off';
            this.$API.inventoryConsumptionSecond(params).then(res => {
              if(res.code === 0){
                this.reviewModal.modal = false;
                this.getList();
              }
            })
         }
      })
    },
    // 核销处理
    cancelSubmit(){
      let msg = this.operationVerify();
      if (msg) return this.$Message.warning(msg);
      let {destruction_status,id} = this.recordationList.selection[0];
      if(destruction_status !== "待销毁") return this.$Message.warning("复审通过才可以进行核销处理");
      this.cancelModal.modal = true;
      this.$refs.cancelModal.resetFields(); //清楚上一次验证,同时也会将数据清
      this.$API.inventoryConsumptionDetail(id).then(res => {
        this.cancelModal.form = {
          ...this.cancelModal.form,
          ...res.data
        }
        this.cancelModal.form.created_at = this.formatDays(res.data.created_at);
        this.cancelModal.form.has_outbound_apply = res.data.has_outbound_apply === 'yes'?'是':res.data.has_outbound_apply === 'no'?'否':'';
        this.cancelModal.form.mark_type = res.data.mark_type === 'P'?'平标':res.data.mark_type === 'J'?'卷标':'';
      })
    },
    //核销处理-数量失去焦点触发
    writeBlurClick(value){
      if(value > this.cancelModal.form.loss_number){
        this.$Message.error("核销数量不能大于损耗数量");
        this.cancaelbutton = true;
      }
      else{
        this.cancaelbutton = false;
      }
    },
    // 核销处理保存按钮
    cancelSave(modal,form){
       this.$refs[form].validate(valid => {
         if(valid){
           if(this.cancelModal.form.writeOffFileItems.length <=0) return this.$Message.error("请上传文件");
           let params = {};
           params.id = this.recordationList.selection[0].id;
           params.writeOffNumber = this.cancelModal.form.writeOffNumber;
           params.writeOffType = this.cancelModal.form.writeOffType;
           params.remark = this.cancelModal.form.remark;
           params.writeOffFileItems = this.cancelModal.form.writeOffFileItems;
           params.type = 'write_off';
           this.$API.inventoryConsumptionCancel(params).then(res => {
             if(res.code === 0){
               this.$Message.success(res.msg);
               this.getList();
               this.cancelModal.modal = false;
             }
           })
         }
       })
    },
    
    // 切换页
    changePage(e){
      this.pageProps.page = e;
      this.getList();
    },
    // 页
    changePageSize(e){
      this.pageProps.perPage = e;
      this.getList();
    },
    
    // 编辑
    handleEdit(index,row){
       this.addform.title = "编辑";
       this.addform.modal = true;
       this.$refs.addform.resetFields(); //清楚上一次验证,同时也会将数据清
        this.addform.form.createdBy = this.userInfo.realName;
        let id = row.id;
        // 获取编辑详情
        this.$API.inventoryConsumptionDetail(id).then(res => {
          if(res.code === 0){
            this.addform.form.hasOutboundApply = res.data.has_outbound_apply;
            this.addform.form.lossFileItems = Array(res.data.lossFileItems);
            this.addform.form.lossNumber = res.data.loss_number;
            this.addform.form.outboundOrderSn = res.data.outbound_order_sn;
            this.addform.form.gb_order_sn = res.data.gb_order_sn;
            this.addform.form.brand = res.data.im_brand;
            this.addform.form.mk_code = res.data.mk_code;
            this.addform.form.product_name = res.data.product_name;
            this.addform.form.order_number = res.data.order_number;
            this.addform.form.confirmed_number = res.data.confirmed_number;
            this.addform.form.supplier = res.data.im_supplier;
            this.addform.form.markType = res.data.mark_type;
            this.addform.form.lossReason = res.data.loss_reason;
            this.addform.form.uuid = res.data.id;
          }
        })
    },
    // 作废弹窗
    invalidSubmit(){
      let msg = this.operationVerify();
       if (msg) return this.$Message.warning(msg);
       let {destruction_status,id} = this.recordationList.selection[0];
       if(destruction_status === '已销毁' || destruction_status == "已作废") return this.$Message.error("该状态不可以作废");
       this.invalidModal.form.revocatpeople = this.userInfo.realName;
       this.invalidModal.modal = true;
    },
    // 作废保存按钮
    invalSave(modal,form){
      this.$refs[form].validate(valid => {
         if(valid){
           let params = {};
           params.id = this.recordationList.selection[0].id;
           params.opinion = this.invalidModal.form.opinion;
           this.$API.inventoryConsumptionInvalid(params).then(res => {
             if(res.code === 0){
               this.$Message.success(res.msg);
               this.invalidModal.modal = false;
               this.getList();
             }
           })
         }
      })
    },
    // 删除
    handleDelete(index,row){
      let params = {};
      params.id = row.id;
      params.type = 'write_off';
      this.$API.inventoryConsumptionDel(params).then(res => {
        if(res.code === 0){
          this.$Message.success(res.msg);
          this.getList();
        }
      })
    },
    // 导出
    exportSubmit(){
      let params = {};
      params.type ="write_off";
      this.$API.inventoryConsumptionExport(params).then(res => {
        this.downLoadXls(res);
      })
    },
       //解析导出文件
    downLoadXls(data){
      if(typeof window.chrome !== 'undefined'){
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(data);
        link.click();
      }
      else if(typeof window.navigator.msSaveBlob !== 'undefined'){
         window.navigator.msSaveBlob(data);
      }
      else{
          // Firefox version
        var file = new File([data], { type: 'application/force-download' });
        window.open(URL.createObjectURL(file));
      }
    },
    // 上传凭证
    handleUpload(file) {
    },
    // 上传损耗凭证
    onsuccess(response,file,fileList){
      if(response.code === 0){
        this.$Message.success(response.msg);
        this.addform.form.lossFileItems.push(response.data.fileUploadVo);
     
      }
      else{
        this.$Message.error("上传有误");
      }
    },
    // 上传核销凭证
    oncancelsuccess(response,file,fileList){
      if(response.code === 0){
        this.$Message.success(response.msg);
        this.cancelModal.form.writeOffFileItems.push(response.data.fileUploadVo);
      }
    },
    // 上传失败
    onerror(error) {
      this.$Message.error("上传失败");
    },
     // 上传最大的大小
    onOverMaxSize() {
      // this.$Message.warning('上传文件最大15m')
    },
    // 移除上传文件
    onremove(index) {
       this.addform.form.lossFileItems.splice(index, 1);
       this.cancelModal.form.writeOffFileItems.splice(index,1);
    },
    // 时间戳转化
    formatDays (timestamp) {
      var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
	    var Y = date.getFullYear() + '-';
	    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
	    var D = date.getDate() + ' ';
	    var h = (date.getHours() < 10 ? '0'+date.getHours():date.getHours()) + ':';
	    var m = (date.getMinutes() < 10 ?'0'+date.getMinutes():date.getMinutes()) + ':';
	    var s = date.getSeconds() < 10 ? '0'+date.getSeconds():date.getSeconds();
	    return Y + M + D + h + m + s;
    },
  }
}
</script>
<style lang="less" scoped>
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  font-weight: bold;
  font-size: 18px;

  .title-text {
    flex-shrink: 0;
    padding: 0 10px;
  }

  .line {
    width: 100%;
    border-top: 1px solid #e9ebed;
  }
}
.upload-list {
  padding: 3px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.upload-list:hover {
  background-color: #f3f3f3;
}

.upload-list .download-link {
  display: block;
  flex: 1;
}

.upload-list .icon-trash {
  display: block;
  padding-left: 100px;
}

.upload-list:hover .icon-trash {
  cursor: pointer;
}
</style>