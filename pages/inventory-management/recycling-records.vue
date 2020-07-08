<template>
  <div id="recycling">
    <Card>
      <Row slot="title">
          <Row type="flex" justify="space-between">
            <Col :xs="20">
              <Input v-model="iventoryform.recoveryOrderSn" clearable placeholder="回收单号"></Input>
              <Input v-model="iventoryform.createdBy" clearable placeholder="回收记录人"></Input>
              <Input v-model="iventoryform.createdTime" clearable placeholder="记录时间"></Input>
              <Input v-model="iventoryform.supplier" clearable placeholder="供应商"></Input>
              <Select clearable v-model="iventoryform.recoveryStatus" placeholder="状态">
                  <Option v-for="item in statuList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
              <Input v-model="iventoryform.outboundOrderSn" clearable placeholder="出库单号"></Input>
            </Col>
            <Button type="primary" @click="searchedSubmit">搜索</Button>
          </Row>
          <Row class="margin-top-10">
            <Col>
              <Button type="primary" @click="exportSubmit">导出数据</Button>
              <Button type="primary" @click="addRecycling">添加回收</Button>
              <Button type="primary" @click="firstSubmit">初审</Button>
              <Button type="primary" @click="reviewSubmit">复审</Button>
              <Button type="primary" @click="recoverySubmit">回收入库</Button>
              <Button type="primary" @click="invalidSubmit">作废</Button>
            </Col>
          </Row>
      </Row>
        <Tabs>
           <TabPane label="损耗记录" name>
              <Table border ref="selection" 
              @on-selection-change="selection => { selectionChange(selection) }"
              :columns="recordationList.inventoryList"
              :data="recordationList.iventorydata"
              :loading="tableLoading" 
               >
                <template slot-scope="scope" slot="action">
                <Tooltip placement="top" content="编辑" transfer>
                  <Button
                    type="primary"
                    icon="md-create"
                    :disabled="scope.row.recovery_status === '待复审' || scope.row.recovery_status === '已入库' || scope.row.recovery_status === '已作废' || scope.row.recovery_status === '待回收入库'"
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
                  :disabled="scope.row.recovery_status === '待复审' || scope.row.recovery_status === '已入库' || scope.row.recovery_status === '已作废' || scope.row.recovery_status === '待回收入库'"
                  ></Button>
                </Poptip>
              </template>
              </Table>
           </TabPane>
        </Tabs>
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
                 <Input readonly v-model="addform.form.createdBy" placeholder="损耗记录人"></Input>
              </FormItem>
              <FormItem label="是否有出库单" prop="hasOutboundApply">
                 <Select v-model="addform.form.hasOutboundApply" placeholder="请选择" style="width:200px" @on-change="ckbtnChange" clearable>
                   <Option  v-for="(item,index) in ChuKuList" :value="item.value" :key="item.value">{{item.label}}</Option>
                 </Select>
              </FormItem>
              <FormItem label="请输入回收数量" prop="recoveryNumber">
                 <Input number v-model="addform.form.recoveryNumber" placeholder="请输入"></Input>
              </FormItem>
              <!-- <FormItem label="下级经办人" prop="nextpeople">
                 <Input v-model="addform.form.nextpeople" placeholder="请输入"></Input>
              </FormItem> -->
            </Col>
          </Row>
          <!-- 当是否有出库单选择是的时候 -->
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
             <FormItem label="品牌" >
                <Input readonly v-model="addform.form.brand" placeholder="请输入"></Input>
             </FormItem>
             <FormItem label="灌包订单号">
                <Input readonly v-model="addform.form.gb_order_sn" placeholder="请输入"></Input>
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
             <FormItem readonly label="实际出库量" prop="confirmed_number">
                <Input v-model="addform.form.confirmed_number" placeholder="请输入"></Input>
             </FormItem>
             <!-- <FormItem label="出库序列号范围">
                <Input placeholder="请输入"></Input>
             </FormItem> -->
             <!-- <FormItem label="出库时间">
                <Input placeholder="请输入"></Input>
             </FormItem> -->
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
          <!--当是否出库单选择否的时候 -->
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
              <FormItem label="回收理由" prop="recoveryReason">
                <Input v-model="addform.form.recoveryReason" placeholder="请输入" style="width:800px"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <FormItem label="回收凭证" prop="recoveryFileItems">
             <Upload
              :action="fileUploadURL"
              :before-upload="handleUpload"
              :default-file-list="addform.form.recoveryFileItems"
              :headers="fileUploadHeaders"
              :on-success="onsuccess"
              :on-remove="onremove"
              :on-error="onerror"
              :on-exceeded-size="onOverMaxSize"
              :show-upload-list="false">
                <Button icon="ios-cloud-upload-outline" class="margin-bottom-10">选择文件</Button>
              </Upload>
                <p style="color:red">请上传防伪标核销凭证</p>
                <div class="upload-list" v-for="(file, index) in addform.form.recoveryFileItems" :key="index">
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
         <Row :xs="24" style="padding:0 40px">
           <FormItem label="回收记录人" prop="created_by">
              <Input v-model="firstModal.form.created_by" placeholder="请输入" style="width:180px"></Input>
           </FormItem>
            <FormItem label="申请时间" prop="created_at">
              <Input v-model="firstModal.form.created_at" placeholder="请输入" style="width:180px"></Input>
           </FormItem>
            <FormItem label="回收单号" prop="recovery_order_sn">
              <Input v-model="firstModal.form.recovery_order_sn" placeholder="请输入" style="width:180px"></Input>
           </FormItem>
            <FormItem label="是否有出库单" prop="has_outbound_apply">
              <Input v-model="firstModal.form.has_outbound_apply" placeholder="请输入" style="width:180px"></Input>
           </FormItem>
            <FormItem label="品牌" prop="im_brand">
              <Input v-model="firstModal.form.im_brand" placeholder="请输入" style="width:180px"></Input>
           </FormItem>
            <FormItem label="标类型" prop="mark_type">
              <Input v-model="firstModal.form.mark_type" placeholder="请输入" style="width:180px"></Input>
           </FormItem>
         </Row>
         <Row :xs="24" style="padding:0 40px">
           <FormItem label="回收数量" prop="recovery_number">
              <Input v-model="firstModal.form.recovery_number" placeholder="请输入" style="width:180px"></Input>
           </FormItem>
           <FormItem label="灌包订单号" prop="gb_order_sn">
              <Input v-model="firstModal.form.gb_order_sn"  placeholder="请输入" style="width:180px"></Input>
           </FormItem>
            <FormItem label="慕可代码" prop="mk_code">
              <Input v-model="firstModal.form.mk_code" placeholder="请输入" style="width:180px"></Input>
           </FormItem>
            <FormItem label="产品名称" prop="product_name">
              <Input v-model="firstModal.form.product_name" placeholder="请输入" style="width:180px"></Input>
           </FormItem>
            <FormItem label="OEM供应" prop="im_supplier">
              <Input v-model="firstModal.form.im_supplier" placeholder="请输入" style="width:180px"></Input>
           </FormItem>
            <FormItem label="实际出库量" prop="confirmed_number">
              <Input v-model="firstModal.form.confirmed_number" placeholder="请输入" style="width:180px"></Input>
           </FormItem>
         </Row>
         <Row style="padding:0 40px">
           <!-- <FormItem label="出库序列号范围">
              <Input v-model="firstModal.form.created_by" placeholder="请输入" style="width:180px"></Input>
           </FormItem> -->
           <FormItem label="回收理由" prop="recovery_reason">
              <Input v-model="firstModal.form.recovery_reason" placeholder="请输入" style="width:570px"></Input>
           </FormItem>
           <FormItem label="回收凭证" prop="recoveryFileItems">
              <div>
                 <a :href="file.url" :download="file.name" class="download-link"
               v-for="(file, index) in Array(firstModal.form.recoveryFileItems)"
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
          <FormItem label="经办人" prop="people">
            <Input v-model="firstModal.form.people" placeholder="经办人"></Input>
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
          <!-- <FormItem label="下级经办人" prop="nextpeople">
            <Input v-model="firstModal.form.nextpeople"  placeholder="请输入"></Input>
          </FormItem> -->
        </Row>
      </Form>
      <div class="modal-footer" slot="footer">
        <Button type="default" @click="firstModal.modal = false">取消</Button>
        <Button type="primary" @click="firstSave('firstModal', 'firstModal')">提交</Button>
      </div>
    </Modal>
    <!-- 复审 -->
    <Modal v-model="reviewModal.modal" :title="reviewModal.title" width="1200" class-name="vertical-center-modal">
      <Form ref="reviewModal" inline :model="reviewModal.form" label-position="top" :rules="reAuditrules">
         <div class="title">
          <span class="line"></span>
          <div class="title-text">基础信息</div>
          <span class="line"></span>
        </div>
         <Row :xs="24" style="padding:0 50px">
           <FormItem label="损耗记录人"  prop="created_by">
              <Input readonly v-model="reviewModal.form.created_by" placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="申请时间" prop="created_at">
              <Input readonly v-model="reviewModal.form.created_at" placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="回收单号" prop="recovery_order_sn">
              <Input readonly v-model="reviewModal.form.recovery_order_sn" placeholder="请输入" style="width:160px"></Input>
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
         </Row>
         <Row :xs="24" style="padding:0 50px">
           <FormItem label="回收数量" prop="recovery_number">
              <Input readonly v-model="reviewModal.form.recovery_number" placeholder="请输入" style="width:160px"></Input>
           </FormItem>
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
         <Row style="padding:0 50px">
           <FormItem label="回收理由" prop="recovery_reason">
              <Input readonly v-model="reviewModal.form.recovery_reason" placeholder="请输入" style="width:685px"></Input>
           </FormItem>
           <FormItem label="回收凭证">
              <a :href="file.url" :download="file.name" class="download-link"
               v-for="(file, index) in Array(reviewModal.form.recoveryFileItems)"
               :key="index">{{file.name}}</a>
           </FormItem>
         </Row>
         <div class="title">
          <span class="line"></span>
          <div class="title-text">审核</div>
          <span class="line"></span>
        </div>
        <Row style="padding:0 50px">
          <FormItem label="经办人" prop="people">
             <Input readonly v-model="reviewModal.form.people" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="初审时间" prop="createdAt">
             <Input readonly v-model="reviewModal.form.createdAt" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="审核意见" prop="firstopinion">
             <Input readonly v-model="reviewModal.form.firstopinion" placeholder="请输入" style="width:630px"></Input>
          </FormItem>
        </Row>
         <div class="title">
          <span class="line"></span>
          <div class="title-text">复审</div>
          <span class="line"></span>
        </div>
         <Row style="padding:0 50px">
          <FormItem label="经办人" prop="people">
            <Input readonly v-model="reviewModal.form.people" placeholder="经办人"></Input>
          </FormItem>
          <FormItem  label="审核" style="padding:0 0px 0 20px" prop="isPass">
            <RadioGroup v-model="reviewModal.form.isPass">
              <Radio label="通过"></Radio>
              <Radio label="驳回"></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="审核意见" style="padding:0 0px 0 40px" prop="opinion">
            <Input
              v-model="reviewModal.form.opinion"
              style="width:440px;"
              clearable
              placeholder="请输入"
            ></Input>
          </FormItem>
          <!-- <FormItem label="下级经办人">
            <Input   placeholder="请输入"></Input>
          </FormItem> -->
        </Row>
      </Form>
       <div class="modal-footer" slot="footer">
        <Button type="default" @click="reviewModal.modal = false">取消</Button>
        <Button type="primary" @click="reviewSave('reviewModal', 'reviewModal')">提交</Button>
      </div>
    </Modal>
    <!-- 回收入库 -->
    <Modal v-model="recoveryModal.modal" :title="recoveryModal.title" width="1200">
       <Form ref="recoveryModal" inline :model="recoveryModal.form" label-position="top" :rules="recoveryRules">
         <div class="title">
          <span class="line"></span>
          <div class="title-text">基础信息</div>
          <span class="line"></span>
        </div>
         <Row :xs="24" style="padding:0 50px">
           <FormItem label="回收记录人" prop="created_by">
              <Input readonly v-model="recoveryModal.form.created_by" placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="申请时间" prop="created_at">
              <Input readonly v-model="recoveryModal.form.created_at" placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="回收单号" prop="recovery_order_sn">
              <Input readonly v-model="recoveryModal.form.recovery_order_sn" placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="是否有出库单" prop="has_outbound_apply">
              <Input readonly v-model="recoveryModal.form.has_outbound_apply" placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="品牌" prop="im_brand">
              <Input readonly v-model="recoveryModal.form.im_brand" placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="标类型" prop="mark_type">
              <Input readonly v-model="recoveryModal.form.mark_type" placeholder="请输入" style="width:160px"></Input>
           </FormItem>
         </Row>
         <Row :xs="24" style="padding:0 50px">
           <FormItem label="回收数量" prop="recovery_number">
              <Input readonly v-model="recoveryModal.form.recovery_number" placeholder="请输入" style="width:160px"></Input>
           </FormItem>
           <FormItem label="灌包订单号" prop="gb_order_sn">
              <Input readonly v-model="recoveryModal.form.gb_order_sn" placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="慕可代码">
              <Input readonly v-model="recoveryModal.form.mk_code" placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="产品名称" prop="product_name">
              <Input readonly v-model="recoveryModal.form.product_name" placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="OEM供应商" prop="im_supplier">
              <Input readonly v-model="recoveryModal.form.im_supplier" placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="实际出库量" prop="confirmed_number">
              <Input readonly v-model="recoveryModal.form.confirmed_number" placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <!-- <FormItem label="出库序列号范围">
              <Input placeholder="请输入" style="width:160px"></Input>
           </FormItem> -->
         </Row>
         <Row style="padding:0 50px">
           <FormItem label="回收理由" prop="recovery_reason">
              <Input readonly v-model="recoveryModal.form.recovery_reason" placeholder="请输入" style="width:685px"></Input>
           </FormItem>
           <FormItem label="回收凭证" prop="recoveryFileItems">
              <a :href="file.url" :download="file.name" class="download-link"
               v-for="(file, index) in Array(recoveryModal.form.recoveryFileItems)"
               :key="index">{{file.name}}</a>
           </FormItem>
         </Row>
         <div class="title">
          <span class="line"></span>
          <div class="title-text">核销处理</div>
          <span class="line"></span>
        </div>
        <Row style="padding:0 50px">
          <FormItem label="经办人">
             <Input readonly v-model="recoveryModal.form.created_by" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="入库数量" prop="inStockNumber">
             <Input v-model="recoveryModal.form.inStockNumber" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="入库仓位号" prop="warehouseSn">
             <Input v-model="recoveryModal.form.warehouseSn" placeholder="请输入" ></Input>
          </FormItem>
          <FormItem label="回收备注" prop="remark">
             <Input v-model="recoveryModal.form.remark" style="width:430px" placeholder="请输入"></Input>
          </FormItem>
        </Row>
        <Row  style="padding:0 50px">
            <FormItem label="入库凭证" prop="inStockFileItems">
              <Upload
              :action="fileUploadURL"
              :before-upload="handleUpload"
              :default-file-list="recoveryModal.form.inStockFileItems"
              :headers="fileUploadHeaders"
              :on-success="onrecoverysuccess"
              :on-remove="onremove"
              :on-error="onerror"
              :on-exceeded-size="onOverMaxSize"
              :show-upload-list="false">
                <Button icon="ios-cloud-upload-outline" class="margin-bottom-10">选择文件</Button>
              </Upload>
                <p style="color:red">请上传防伪标入库凭证</p>
                <div class="upload-list" v-for="(file, index) in recoveryModal.form.inStockFileItems" :key="index">
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
        <Button type="default" @click="recoveryModal.modal = false">取消</Button>
        <Button type="primary" @click="recoverySave('recoveryModal', 'recoveryModal')">提交</Button>
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
     return {
       // 上传地址
      fileUploadURL: `${SERVER_BASE_URL}traceability/traceability/upload`,
      fileUploadHeaders: {
        Authorization: Cookies.get("authorization")
      },
       iventoryform:{
          recoveryOrderSn:'', //回收单号
          createdBy:'', //回收记录人
          createdTime:'', //记录时间
          supplier:'', //供应商
          recoveryStatus:'', //回收状态
          outboundOrderSn:'', //出库单号
       },
       tableLoading:false, //表
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
           recoveryNumber:'', //回收数量
          //  nextpeople:'', //下级经办人
           brand:'', //品牌
           supplier:'', //OEM供应商
           markType:'', //标类型
           recoveryReason:'', //回收理由
           recoveryFileItems:[], //回收凭证
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
           recoveryNumber:[{ required: true, type:'number',message: "盘点数量不能为空", trigger: "blur" }],
           recoveryReason:[{required:true,message:'损耗理由不能为空',trigger:'blur'}],
           brand:[{required:true,message:'品牌不能为空',trigger:'blur'}],
           outboundOrderSn:[{required:true,message:'出库单号不能为空',trigger:'change'}],
           markType:[{required:true,message:'标类型不能为空',trigger:'change'}],
           supplier:[{required:true,message:'OEM供应商不能为空',trigger:'blur'}]
      },
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
       // 初审
      firstModal:{
        modal:false,
        title:'损耗单的审核',
        form:{
          created_by:'', //损耗记录人
          created_at:'', //申请时间
          recovery_order_sn:'', //回收单号
          has_outbound_apply:'', //是否有出库单
          im_brand:'', //品牌
          mark_type:'', //标类型
          recovery_number:'', //回收数量
          gb_order_sn:'',//灌包订单号
          mk_code:'', //慕可代码
          product_name:'', //产品名称
          im_supplier:'', //oEM供应
          confirmed_number:'', //实际出库
          recovery_reason:'', //回收原因
          recoveryFileItems:[], //回收凭证
          people:'', //经办人
          // nextpeople:'', //下级经办人
          isPass:'', //是否通过
          opinion:'', //审核意见
        }
      },
      // 初审验证
      firstAuditRules:{
        isPass:[{required:true,message:'审核不能为空',trigger:'change'}],
        opinion:[{required:true,message:'审核意见不能为空',trigger:'blur'}]
      },
      // 复审
      reviewModal:{
        modal:false,
        title:'损耗单的审核',
        form:{
          id:'', //
          created_by:'', //损耗记录人
          created_at:'', //申请时间
          recovery_order_sn:'',//回收单号
          has_outbound_apply:'',// 是否有出库单
          im_brand:'', //品牌
          mark_type:'', //标类型
          recovery_number:'', //回收数量
          gb_order_sn:'', //管饱订单号
          mk_code:'', //慕可代码
          product_name:'', //产品名称
          im_supplier:'', //OEM供应商
          confirmed_number:'', //实际出库量
          recovery_reason:'', //回收原因
          recoveryFileItems:[], //回收凭证
          people:'', //经办人
          createdAt:'', //初审时间
          firstopinion:'',//初审审核意见
          isPass:'', //复审审核
          opinion:'', //复审审核意见
        }
      },
      // 复审验证
      reAuditrules:{
        isPass:[{required:true,message:'审核不能为空',trigger:'change'}],
        opinion:[{required:true,message:'审核意见不能为空',trigger:'blur'}]
      },
       // 回收入库处理
      recoveryModal:{
        modal:false,
        title:'核销处理',
        form:{
            id:'', //
            created_by:'', //损耗记录人
            created_at:'', //申请时间
            recovery_order_sn:'',//回收单号
            has_outbound_apply:'',// 是否有出库单
            im_brand:'', //品牌
            mark_type:'', //标类型
            recovery_number:'',// 回收数量
            gb_order_sn:'', //管饱订单号
            mk_code:'', //慕可代码
            product_name:'', //产品名称
            im_supplier:'', //OEM供应商
            confirmed_number:'', //实际出库量
            recovery_reason:'', //回收理由
            recoveryFileItems:"", //回收凭证
            people:'', //经办人
            inStockNumber:'', //入库数量
            warehouseSn:'', //入库藏仓号
            remark:'', //回收备注
            inStockFileItems:[], //入库凭证
        }
      },
      // 回收入库验证
      recoveryRules:{
        inStockNumber:[{required:true,message:'入库数量不能为空',trigger:'blur'}],
        warehouseSn:[{required:true,message:'入库仓位号不能为空',trigger:'blur'}],
        remark:[{required:true,message:'回收备注不能为空',trigger:'blur'}]
      },
      // 作废
      invalidModal: {
        modal: false,
        form: {
          revocatpeople: "", //撤销人
          opinion: "" //意见
        }
      },
      // 作废验证
      invalidRules:{
        opinion:[{required:true,message:'审核意见不能为空',trigger:'blur'}]
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
       //表数据
       recordationList:{
          selection:[], //选择
         inventoryList:[
            {
              type: "selection",
              width: 60,
              align: "center",
              fixed: "left"
            },
            {
                title: "序号",
                key: "num",
                width: 100,
                align: "center",
                sortable: true,//开启排序
                sortType:"dec",//初始化排序
                render:(h,params) => {
                  return h('span',(params.index+1))
              }
            },
            {
              title:'回收记录人',
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
              title:'回收单号',
              key:'recovery_order_sn',
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
              key:'oa_supplier',
              width:250,
              align:'center'
            },
            {
              title:'回收数量',
              key:'recovery_number',
              width:100,
              align:'center'
            },
            {
              title:'状态',
              key:'recovery_status',
              width:150,
              align:'center'
            },
            
            {
              title:'操作',
              slot:'action',
              align:'center',
              width:200
            }
         ],
         iventorydata:[]
       },
       // 页码
      pageProps: {
        page: "",
        perPage: "",
        count: 0,
        pageCount:'', //记录当前第几页
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
          label:'待回收入库',
          value:'inStockPending'
        },
        {
          label:'已入库',
          value:'inStocked'
        },
        {
          label:'已作废',
          value:'voided'
        }
      ]
     }
   },
   mounted(){
     this.userInfo = JSON.parse(window.localStorage.getItem('userInfo')); //获取登录的名字
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
    //  列表数据
    getList(){
        let params = this.iventoryform;
        params.type = 'recovery';
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
    //  添加回收
     addRecycling(){
        this.$refs.addform.resetFields(); //清楚上一次验证,同时也会将数据清空
        this.addform.modal = true;
        this.addform.title= "添加";
        this.addform.form.createdBy = this.userInfo.realName;
        this.addform.form.uuid = "";
     },
    //  添加回收保存按钮
    addSubmit(){
      this.$refs.addform.validate(valid =>{
        if(valid){
           if(this.addform.form.recoveryFileItems.length <=0) return this.$Message.error("请上传文件");
           let params = {};
            params.type = 'recovery';
            params.recoveryFileItems = this.addform.form.recoveryFileItems;
            params.hasOutboundApply = this.addform.form.hasOutboundApply;
            params.recoveryNumber = this.addform.form.recoveryNumber;
            params.recoveryReason = this.addform.form.recoveryReason;
            params.brand = this.addform.form.brand;
            params.supplier = this.addform.form.supplier;
            params.markType = this.addform.form.markType;
            params.outboundApplyId = Number(this.addform.form.id);
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
           else{
             delete this.addform.form.uuid;
              if(params.hasOutboundApply === 'no'){
                 delete  params.outboundApplyId;
              }
              this.$API.inventoryConsumptionAdd(params).then(res => {
              if(res.code === 0){
                this.$Message.success(res.msg);
                this.pageProps.page = 1;
                this.getList();
                this.addform.modal = false;
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
    // 操作验证
    operationVerify() {
        let msg;
        if (this.recordationList.selection.length <= 0) return msg = '请选择一条数据'
        if (this.recordationList.selection.length > 1) return msg = '一次只能操作一条数据'
    },
    selectionChange(selection) {
        this.recordationList.selection = selection
    },
    //  初审
     firstSubmit(){
       let msg = this.operationVerify();
       if (msg) return this.$Message.warning(msg);
       let {id,recovery_status} = this.recordationList.selection[0];
       if(recovery_status === "已驳回" || recovery_status ==="待复审" || recovery_status==="待回收入库") return this.$Message.warning("已审核");
      if(recovery_status === "已入库" || recovery_status === "已销毁") return this.$Message.warning("该状态不能进行审核");
       this.firstModal.modal = true;
       this.$refs.firstModal.resetFields(); //清楚上一次验证,同时也会将数据清空
      //  详情
       this.$API.inventoryConsumptionDetail(id).then(res => {
        this.firstModal.form = res.data;
        this.firstModal.form.people = this.userInfo.realName;
        this.firstModal.form.has_outbound_apply = res.data.has_outbound_apply === 'yes'? '是':res.data.has_outbound_apply === 'no'?'否':'';
        this.firstModal.form.mark_type = res.data.mark_type === 'P'?'平标':res.data.mark_type === 'J'?'卷标':'';
        this.firstModal.form.created_at = this.formatDays(res.data.created_at);
      })
     },
    //  初审提交按钮
     firstSave(modal,form){
        this.$refs[form].validate(valid => {
          if(valid){
              let params = {};
              params.id = this.firstModal.form.id;
              params.isPass = this.firstModal.form.isPass === '通过'?'yes':this.firstModal.form.isPass ===  '驳回'?'no':'';
              params.opinion = this.firstModal.form.opinion;
              params.type = 'recovery';
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
      this.$refs.reviewModal.resetFields(); //清楚上一次验证,同时也会将数据清空
      let {recovery_status,id} = this.recordationList.selection[0];
      if(recovery_status === "已驳回" || recovery_status === "待初审") return this.$Message.warning("初审未通过或未审核");
      if(recovery_status === "待回收入库") return this.$Message.warning("已经审核");
      if(recovery_status === "已入库" || recovery_status === "已销毁") return this.$Message.warning("该状态不能进行审核");
      this.reviewModal.modal = true;
      // 详情
      this.$API.inventoryConsumptionDetail(id).then(res => {
          this.reviewModal.form = res.data;
          this.reviewModal.form.has_outbound_apply = res.data.has_outbound_apply === 'yes'?'是':res.data.has_outbound_apply === 'no'?'否':'';
          this.reviewModal.form.mark_type = res.data.mark_type === 'J'?'卷标':res.data.mark_type === 'P'?'平标':'';
          this.reviewModal.form.people = res.data.auditPendingLog.createdBy;
          this.reviewModal.form.createdAt = this.formatDays(res.data.auditPendingLog.createdAt);
          this.reviewModal.form.created_at = this.formatDays(this.reviewModal.form.created_at);
          this.reviewModal.form.firstopinion = res.data.auditPendingLog.ext.opinion;
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
            params.type = 'recovery';
            this.$API.inventoryConsumptionSecond(params).then(res => {
              if(res.code === 0){
                this.reviewModal.modal = false;
                this.getList();
              }
            })
         }
      })
    },
    // 回收入库
     recoverySubmit(){
      let msg = this.operationVerify();
      if (msg) return this.$Message.warning(msg);
       this.$refs.recoveryModal.resetFields(); //清楚上一次验证,同时也会将数据清空
      let {id,recovery_status} = this.recordationList.selection[0];
      if(recovery_status === "已入库") return this.$Message.warning("已回收入库，不能重复入库");
      if(recovery_status !== "待回收入库") return this.$Message.warning("复审通过后才可以回收入库!");
      this.recoveryModal.modal = true;
      this.$API.inventoryConsumptionDetail(id).then(res => {
        this.recoveryModal.form = {
          ...this.recoveryModal.form,
          ...res.data
        }
        this.recoveryModal.form.has_outbound_apply = res.data.has_outbound_apply === 'yes'?'是': res.data.has_outbound_apply === 'no'?'否':'';
        this.recoveryModal.form.mark_type = res.data.mark_type === 'P'?'平标':res.data.mark_type==='J'?'卷标':'';
        this.recoveryModal.form.created_at = this.formatDays(res.data.created_at);
      })
    },
    // 回收入库保存按钮
    recoverySave(modal,form){
       this.$refs[form].validate(valid => {
         if(valid){
           if(this.recoveryModal.form.inStockFileItems.length <=0) return this.$Message.error("请上传文件");
           let params = {};
           params.id = this.recordationList.selection[0].id;
           params.inStockNumber = this.recoveryModal.form.inStockNumber;
           params.warehouseSn = this.recoveryModal.form.warehouseSn;
           params.remark = this.recoveryModal.form.remark;
           params.inStockFileItems = this.recoveryModal.form.inStockFileItems;
           params.type = 'recovery';
           this.$API.inventoryConsumptionCancel(params).then(res => {
             if(res.code === 0){
               this.$Message.success(res.msg);
               this.getList();
               this.recoveryModal.modal = false;
             }
           })
         }
       })
    },
    // 作废弹窗
    invalidSubmit(){
      let msg = this.operationVerify();
       if (msg) return this.$Message.warning(msg);
       let {recovery_status,id} = this.recordationList.selection[0];
       if(recovery_status === '已作废' || recovery_status == "已入库") return this.$Message.error("该状态不可以作废");
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
    //  编辑
     handleEdit(index,row){
       this.addform.title = "编辑";
       this.addform.modal = true;
        let id = row.id;
        this.$refs.addform.resetFields(); //清楚上一次验证,同时也会将数据清空
        this.outboundOrderSnList = []
        this.addform.form.createdBy = this.userInfo.realName;
        // 获取编辑详情
        this.$API.inventoryConsumptionDetail(id).then(res => {
          if(res.code === 0){  
            let form = JSON.parse(JSON.stringify(this.addform.form))
            form.hasOutboundApply = res.data.has_outbound_apply;
            form.recoveryFileItems = Array(res.data.recoveryFileItems);
            form.recoveryNumber = res.data.recovery_number;
            form.gb_order_sn = res.data.gb_order_sn;
            form.brand = res.data.im_brand;
            form.mk_code = res.data.mk_code;
            form.product_name = res.data.product_name;
            form.order_number = res.data.order_number;
            form.confirmed_number = res.data.confirmed_number;
            form.supplier = res.data.im_supplier;
            form.markType = res.data.mark_type;
            form.recoveryReason = res.data.recovery_reason;
            form.uuid = res.data.id;
            form.outboundOrderSn = res.data.outbound_order_sn;
            this.addform.form = form
          }
        })
     },
    //  删除
     handleDelete(index,row){
        let params = {};
      params.id = row.id;
      params.type = 'recovery';
      this.$API.inventoryConsumptionDel(params).then(res => {
        if(res.code === 0){
          this.$Message.success(res.msg);
          this.getList();
        }
      })
     },
    // 是否有出库单选择
    ckbtnChange(value){
      this.getReset();
    },
    // 页
    changePage(e){
      this.pageProps.page = e;
      this.getList();
    },
    // 改变页数
    changePageSize(e){
      this.pageProps.perPage = e;
      this.getList();
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
           this.addform.form.confirmed_number = this.outboundOrderSnList[i].confirmed_number; 
           
       }
     }
    },
     // 导出
    exportSubmit(){
      let params = {};
      params.type ="recovery";
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
    // 上传文件
    handleUpload(file){},
    // 上传成功
    onsuccess(response){
       if(response.code === 0){
        this.$Message.success(response.msg);
        this.addform.form.recoveryFileItems.push(response.data.fileUploadVo);
      }
    },
    // 回收入库上传成功
    onrecoverysuccess(response){
       if(response.code === 0){
        this.$Message.success(response.msg);
        this.recoveryModal.form.inStockFileItems.push(response.data.fileUploadVo);
      }
    },
    // 上传失败
    onerror(){
      this.$Message.error("上传失败");
    },
    // 限制大小
    onOverMaxSize(){},
    // 移除
    onremove(index){
      this.addform.form.recoveryFileItems.splice(index, 1);
      this.recoveryModal.form.inStockFileItems.splice(index, 1);
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
.vertical-center-modal{
        display: flex;
        align-items: center;
        justify-content: center;

        .ivu-modal{
            top: 0;
        }
    }
</style>