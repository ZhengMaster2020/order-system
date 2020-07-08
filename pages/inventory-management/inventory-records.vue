<template>
  <div id="records">
    <Card>
      <Row slot="title">
        <Form :model="iventoryform" inline>
          <Row type="flex" justify="space-between">
            <Col :xs="20">
              <FormItem prop="inventoryObject">
                <Input v-model="iventoryform.inventoryObject" clearable placeholder="盘点对象"></Input>
              </FormItem>
              <FormItem prop="inventoryTime">
                <DatePicker
                  type="month"
                  v-model="iventoryform.inventoryTime"
                  clearable
                  placeholder="盘点年月"
                ></DatePicker>
              </FormItem>
              <FormItem prop="inventoryProject">
                <Input v-model="iventoryform.inventoryProject" clearable placeholder="盘点项目"></Input>
              </FormItem>
              <FormItem prop="createdBy">
                <Input v-model="iventoryform.createdBy" clearable placeholder="盘点人"></Input>
              </FormItem>
            </Col>
            <Button type="primary" @click="searchSubmit">搜索</Button>
          </Row>
          <Row>
            <Button type="primary" @click="exportdata">导出数据</Button>
            <Button type="primary" @click="addInventory">添加盘点</Button>
            <Button type="primary" @click="firstTrail">初审</Button>
            <Button type="primary" @click="reviewCheck">复审</Button>
            <Button type="primary" @click="invalidRecords">作废</Button>
          </Row>
        </Form>
      </Row>
        <Tabs>
          <TabPane label="盘点记录" name>
            <Table border ref="selection" @on-selection-change="selection => { selectionChange(selection) }" :columns="recordationList.inventoryList" :data="recordationList.iventorydata">
              <template slot-scope="scope" slot="action">
                <Tooltip placement="top" content="编辑" transfer>
                  <Button
                    type="primary"
                    icon="md-create"
                    :disabled="scope.row.status === '待复审' || scope.row.status === '复审通过' || scope.row.status === '已作废'"
                    @click="handleEdit(scope.index, scope.row)"
                  ></Button>
                </Tooltip>
                <Poptip
                  confirm
                  title="您确认删除这条内容吗？"
                  @on-ok="handleDelete(scope.index, scope.row)"
                  transfer
                >
                  <Button icon="md-trash" :disabled="scope.row.status === '待复审' || scope.row.status === '复审通过'|| scope.row.status === '已作废'"></Button>
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
    <!-- 添加/编辑盘点 -->
    <Modal v-model="addform.modal" :title="addform.title" width="1300">
      <Card>
        <Row slot="title">
          <Row type="flex" justify="end">
            <Button type="primary" @click="addSubmit">确认提交</Button>
          </Row>
        </Row>
        <Form :model="addform.form" ref="addform" inline label-position="top" :rules="ruleValidate">
          <Row style="padding:11px">
            <Col :xs="24">
              <FormItem label="盘点记录人" prop="createdBy">
                <Input v-model="addform.form.createdBy" disabled clearable placeholder="盘点对象"></Input>
              </FormItem>
              <FormItem label="盘点品牌" prop="brand">
                <Select v-model="addform.form.brand" style="width:185px" placeholder="请选择">
                  <Option
                    v-for="(item,index) in brandList"
                    :value="item.value"
                    :key="item.value"
                  >{{item.label}}</Option>
                </Select>
              </FormItem>
              <FormItem label="盘点类型" prop="checkType">
                <Select v-model="addform.form.checkType" @on-change="typeChange" style="width:185px" placeholder="请选择">
                  <Option
                    v-for="(item,index) in recordsList"
                    :value="item.value"
                    :key="item.value"
                  >{{item.label}}</Option>
                </Select>
              </FormItem>
              <FormItem label="盘点年月" prop="inventoryTime">
                <DatePicker
                  type="month"
                  v-model="addform.form.inventoryTime"
                  style="width:185px"
                  clearable
                  placeholder="盘点年月"
                ></DatePicker>
              </FormItem>
              <FormItem label="盘点对象" prop="inventoryObject">
                <Input v-if="addform.form.checkType === 'self_inventory'" v-model="addform.form.inventoryObject" clearable placeholder></Input>
                <Select 
                v-else
                v-model="addform.form.inventoryObject"
                filterable
                style="width:190px"
                remote
                clearable
                :remote-method="inventobjSearch"
                :loading="loadingObj">
                <Option v-for="(option,index) in objList" :value="option.supplier" :key="index">{{option.supplier}}</Option>
                </Select>
              </FormItem>
              <FormItem label="盘点项目" prop="inventoryProject">
                <Select v-model="addform.form.inventoryProject" clearable style="width:185px">
                  <Option 
                    v-for="(item,index) in projectList"
                    :value="item.value"
                    :key="item.value">
                      {{item.label}}
                  </Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row style="padding:0 10px">
            <Col :xs="4">
              <FormItem label="盘点数量" prop="inventoryNumber">
                <Input
                type="number"
                  number
                  onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                  v-model="addform.form.inventoryNumber"
                  clearable
                  placeholder="盘点数量"
                ></Input>
              </FormItem>
            </Col>
            <Col :xs="16">
              <FormItem label="备注" prop="remark">
                <Input v-model="addform.form.remark" clearable placeholder="备注" style="width:786px"></Input>
              </FormItem>
            </Col>
            <Col :xs="4">
              <FormItem label="下级经办人" prop="nextpeople">
                <Input v-model="addform.form.nextpeople" clearable placeholder="下级经办人"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row style="padding:0 11px">
            <FormItem label="盘点凭证" prop="fileItems">
              <Upload
                :action="fileUploadURL"
                :before-upload="handleUpload"
                :default-file-list="addform.form.fileItems"
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
              <div class="upload-list" v-for="(file, index) in addform.form.fileItems" :key="index">
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
    <Modal v-model="firstModal.modal" title="盘点单审核" width="1300">
      <Form ref="firstModal" inline :model="firstModal.form" label-position="top" :rules="firstAuditRules">
        <div class="title">
          <span class="line"></span>
          <div class="title-text">基础信息</div>
          <span class="line"></span>
        </div>
        <Row :xs="24" style="padding:0 30px">
          <FormItem label="盘点记录人">
            <Input readonly v-model="firstModal.form.createdBy"  placeholder="盘点记录人"></Input>
          </FormItem>
          <FormItem label="申请时间">
            <Input readonly  v-model="firstModal.form.createdAt"  placeholder="申请时间"></Input>
          </FormItem>
          <FormItem label="盘点单号">
            <Input readonly v-model="firstModal.form.inventoryOrderSn"  placeholder="盘点单号"></Input>
          </FormItem>
          <FormItem  label="盘点类型">
            <Input readonly v-model="firstModal.form.checkType"  placeholder="盘点对象"></Input>
          </FormItem>
          <FormItem label="盘点对象">
            <Input readonly v-model="firstModal.form.inventoryObject"  placeholder="盘点对象"></Input>
          </FormItem>
          <FormItem label="盘点项目">
            <Input readonly v-model="firstModal.form.inventoryProject"  placeholder="盘点项目"></Input>
          </FormItem>
        </Row>
        <Row style="padding:0 30px">
          <FormItem label="盘点数量">
            <Input readonly v-model="firstModal.form.inventoryNumber"  placeholder="盘点数量"></Input>
          </FormItem>
          <FormItem label="盘点年月">
            <Input readonly v-model="firstModal.form.inventoryTime" placeholder="盘点年月"></Input>
          </FormItem>
          <FormItem label="备注">
            <Input
              readonly
              v-model="firstModal.form.remark"
              placeholder="盘点年月"
              style="width:586px"
            ></Input>
          </FormItem>
          <FormItem label="盘点凭证">
            <div style="padding-top: 3px">
            <a :href="file.url" :download="file.name" class="download-link"
               v-for="(file, index) in firstModal.form.fileItems"
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
            <Input readonly v-model="firstModal.form.people"  placeholder="经办人"></Input>
          </FormItem>
          <FormItem prop="throughReject" label="审核" style="padding:0 0px 0 30px">
            <RadioGroup v-model="firstModal.form.throughReject">
              <Radio label="通过"></Radio>
              <Radio label="驳回"></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem prop="opinion" label="审核意见" style="padding:0 0px 0 40px">
            <Input
              v-model="firstModal.form.opinion"
              style="width:500px;"
              clearable
              placeholder="请输入"
            ></Input>
          </FormItem>
          <FormItem label="下级经办人">
            <Input readonly v-model="firstModal.form.nextpeople"  placeholder="请输入"></Input>
          </FormItem>
        </Row>
      </Form>
       <div class="modal-footer" slot="footer">
        <Button type="default" @click="firstModal.modal = false">取消</Button>
        <Button type="primary" @click="firstSubmit('firstModal', 'firstModal')">提交</Button>
      </div>
    </Modal>

    <!-- 复审 -->
    <Modal v-model="reviewModal.modal" title="损耗单的审核" width="1300">
      <Form ref="reviewModal" inline :model="reviewModal.form" label-position="top" :rules="reAuditrules">
        <div class="title">
          <span class="line"></span>
          <div class="title-text">基础信息</div>
          <span class="line"></span>
        </div>
        <Row :xs="24" style="padding:0 30px">
          <FormItem label="盘点记录人">
            <Input readonly v-model="reviewModal.form.createdBy" placeholder="盘点记录人"></Input>
          </FormItem>
          <FormItem label="申请时间">
            <Input readonly v-model="reviewModal.form.createdAt"  placeholder="申请时间"></Input>
          </FormItem>
          <FormItem label="盘点单号">
            <Input readonly v-model="reviewModal.form.inventoryOrderSn"  placeholder="盘点单号"></Input>
          </FormItem>
          <FormItem label="盘点类型">
            <Input readonly v-model="reviewModal.form.checkType" placeholder="盘点类型"></Input>
          </FormItem>
          <FormItem label="盘点对象">
            <Input readonly v-model="reviewModal.form.inventoryObject" placeholder="盘点对象"></Input>
          </FormItem>
          <FormItem label="盘点项目">
            <Input readonly v-model="reviewModal.form.inventoryProject"  placeholder="盘点项目"></Input>
          </FormItem>
        </Row>
        <Row style="padding:0 30px">
          <FormItem label="盘点数量">
            <Input readonly v-model="reviewModal.form.inventoryNumber"  placeholder="盘点数量"></Input>
          </FormItem>
          <FormItem label="盘点年月">
            <Input readonly v-model="reviewModal.form.inventoryTime" placeholder="盘点年月"></Input>
          </FormItem>
          <FormItem label="备注">
            <Input
              readonly
              v-model="reviewModal.form.remark"
              placeholder="备注"
              style="width:586px"
            ></Input>
          </FormItem>
          <FormItem label="盘点凭证">
            <div style="padding-top: 3px">
            <a :href="file.url" :download="file.name" class="download-link"
               v-for="(file, index) in reviewModal.form.fileItems"
               :key="index">{{file.name}}</a>
          </div>
          </FormItem>
        </Row>
        <div class="title" style="margin:30px 0">
          <span class="line"></span>
          <div class="title-text">审核</div>
          <span class="line"></span>
        </div>
        <Row style="padding:0 30px">
          <FormItem label="经办人">
            <Input readonly v-model="reviewModal.form.people"  placeholder="经办人"></Input>
          </FormItem>
          <FormItem label="初审时间">
            <Input v-model="reviewModal.form.firstReviewdate"  placeholder="初审时间"></Input>
          </FormItem>
          <FormItem label="审核意见">
            <Input
              v-model="reviewModal.form.opinion"
              style="width:790px;"
              placeholder="请输入"
            ></Input>
          </FormItem>
        </Row>
        <div class="title" style="margin:30px 0">
          <span class="line"></span>
          <div class="title-text">复审</div>
          <span class="line"></span>
        </div>
        <Row style="padding:0 30px">
          <FormItem label="经办人">
            <Input readonly v-model="reviewModal.form.people"  placeholder="经办人"></Input>
          </FormItem>
          <FormItem label="初审时间" prop="throughReject">
            <RadioGroup v-model="reviewModal.form.throughReject">
              <Radio label="通过"></Radio>
              <Radio label="驳回"></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="审核意见" prop="reopinion">
            <Input
              v-model="reviewModal.form.reopinion"
              style="width:790px;"
              clearable
              placeholder="请输入"
            ></Input>
          </FormItem>
        </Row>
      </Form>
       <div class="modal-footer" slot="footer">
        <Button type="default" @click="reviewModal.modal = false">取消</Button>
        <Button type="primary" @click="AuditSubmit('reviewModal', 'reviewModal')">提交</Button>
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
        <Button type="primary" @click="invalSubmit('invalidModal','invalidModal')">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import Cookies from "js-cookie";
import { SERVER_BASE_URL } from "../../api/config";
import axios from 'axios';
import ENV from '../../api/env';
export default {
  name: "",
  data() {
    return {
      // 上传地址
      fileUploadURL: `${SERVER_BASE_URL}traceability/traceability/upload`,
      fileUploadHeaders: {
        Authorization: Cookies.get("authorization")
      },
      iventoryform: {
        inventoryObject: "", //盘点对象
        inventoryTime: "", //盘点年月
        inventoryProject: "", //盘点项目
        createdBy: "" //盘点人
      },
      loadingObj:false, //盘点对象loading
      objList:[], //盘点对象
      addform: {
        //添加
        modal: false,
        title: "添加",
        form: {
          id:'',
          createdBy: "", //盘点人
          brand: "", //盘点品牌
          checkType: "", //盘点类型
          inventoryTime: "", //盘点年月
          inventoryObject: "", //盘点对象
          inventoryProject: "", //盘点项目
          inventoryNumber: "", //盘点数量
          remark: "", //备注
          nextpeople: "", //下级经办人
          fileItems: [] //盘点凭证
        }
      },
      //  品牌列表
      brandList: [
        {
          value: "WIS",
          label: "WIS"
        },
        {
          value: "IRY",
          label: "IRY"
        },
        {
          value: "MVE",
          label: "MVE"
        },
        {
          value: "KONO",
          label: "KONO"
        },
        {
          value: "柏菲娜",
          label: "柏菲娜"
        },
        {
          value: "墨雪",
          label: "墨雪"
        },
        {
          value: "魔渍",
          label: "魔渍"
        }
      ],
      // 盘点类型
      recordsList: [
        {
          label: "供应商库存",
          value: "supplier_inventory"
        },
        {
          label: "自仓库存",
          value: "self_inventory"
        }
      ],
      // 盘点项目
      projectList:[],
      projectList1:[
        {
          label:'月盘点核对',
          value:'月盘点核对'
        },
        {
          label:'入仓盘点',
          value:'入仓盘点'
        }
      ],
      projectList2:[
        {
          label:'实际剩余量',
          value:'实际剩余量'
        },
        {
          label:'灌包收货量',
          value:'灌包收货量'
        }
      ],
      // 审核
      throughReject:[
        {value:'通过',label:'yes'},
        {value:'驳回',label:'no'}
      ],
      // 添加里面验证规则
      ruleValidate: {
        checkType: [{ required: true, message: "盘点类型不能为空", trigger: "change" }],
        inventoryTime: [{required: true,type: "date",message: "盘点年月不能为空",trigger: "change"}],
        inventoryObject: [{ required: true, message: "盘点对象不能为空", trigger: "change" }],
        inventoryProject: [{ required: true, message: "盘点项目不能为空", trigger: "change" }],
        inventoryNumber: [{ required: true, type:'number',message: "盘点数量不能为空", trigger: "blur" }]
      },
      // 初审验证
      firstAuditRules:{
        throughReject:[{required:true,message:'审核不能为空',trigger:'change'}],
        opinion:[{required:true,message:'审核意见不能为空',trigger:'blur'}]
      },
      // 复审验证
      reAuditrules:{
        throughReject:[{required:true,message:'审核不能为空',trigger:'change'}],
        reopinion:[{required:true,message:'审核意见不能为空',trigger:'blur'}]
      },
      invalidRules:{
          opinion:[{required:true,message:'意见不能为空',trigger:'blur'}]
      },
      //  初审
      firstModal: {
        modal: false,
        form: {
          createdBy: "", //盘点记录人
          createdAt: "", //申请时间
          inventoryOrderSn: "", //盘点单号
          checkType: "", //盘点类型
          inventoryObject: "", //盘点对象
          inventoryProject: "", //盘点项目
          inventoryNumber: "", //盘点数量
          inventoryTime: "", //盘点年月
          remark: "", //备注
          fileItems: [], //盘点凭证
          people: "", //经办人
          throughReject: 'yes',//通过或驳回
          opinion: "", //审核意见
          nextpeople: "" //下级经办人
        }
      },
      // 复审
      reviewModal: {
        modal: false,
        form: {
          createdBy: "", //盘点记录人
          createdAt: "", //申请时间
          inventoryOrderSn: "", //盘点单号
          checkType: "", //盘点类型
          inventoryObject: "", //盘点对象
          inventoryProject: "", //盘点项目
          inventoryNumber: "", //盘点数量
          inventoryTime: "", //盘点年月
          remark: "", //备注
          fileItems: [], //盘点凭证
          people: "", //经办人
          firstReviewdate: "", //初审时间
          opinion: "", //初审审核意见
          throughReject: 'yes',//通过或驳回
          reopinion:'', //复审审核意见
          nextpeople: "" //下级经办人
        }
      },
      // 作废
      invalidModal: {
        modal: false,
        form: {
          revocatpeople: "", //撤销人
          opinion: "" //意见
        }
      },
      // 页码
      pageProps: {
        page: "",
        perPage: "",
        count: 0,
        pageCount:'', //记录当前第几页
      },
      recordationList:{
          selection:[], //选择
          inventoryList: [
            {
              type: "selection",
              width: 60,
              align: "center",
              fixed: "left"
            },
            {
              title: "序号",
              key: "id",
              width: 80,
              align: "center"
            },
            {
              title: "盘点年月",
              key: "inventoryTime",
              width: 200,
              align: "center"
            },
            {
              title: "盘点单号",
              key: "inventoryOrderSn",
              width: 200,
              align: "center"
            },
            {
              title: "品牌",
              key: "brand",
              width: 180,
              align: "center"
            },
            {
              title: "类型",
              key: "checkType",
              width: 180,
              align: "center"
            },
            {
              title: "盘点对象",
              key: "inventoryObject",
              width: 250,
              align: "center"
            },
            {
              title: "盘点项目",
              key: "inventoryProject",
              width: 200,
              align: "center"
            },
            {
              title: "盘点数量",
              key: "inventoryNumber",
              width: 200,
              align: "center"
            },
            {
              title: "盘点人",
              key: "createdBy",
              width: 200,
              align: "center"
            },
            {
              title: "创建时间",
              key: "createdAt",
              width: 200,
              align: "center"
            },
            {
              title: "状态",
              key: "status",
              width: 200,
              align: "center"
            },
            {
              title: "备注",
              key: "remark",
              width: 250,
              align: "center"
            },
            {
              title: "操作",
              key: "action",
              width: 150,
              align: "center",
              slot: "action"
            }
          ],
          iventorydata: [] //表里面的数据
      },
      
    };
  },
  mounted() {
    this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
    this.getList();
  },
  methods: {
    // 搜索
    searchSubmit(){
      if(this.pageProps.page > 1){
        this.pageProps.page = 1;
      }
       this.getList();
    },
    // 获取列表数据
    getList() {
      let params = this.iventoryform;
      params.page = this.pageProps.page;
      params.perPage = this.pageProps.perPage;
      this.$API.inventoryRecordsList(params).then(res => {
        this.recordationList.iventorydata = res.data.list;
        this.pageProps = res.data;
      });
    },
    //  添加盘点
    addInventory() {
      this.$refs.addform.resetFields(); //清楚上一次验证,同时也会将数据清空
      this.addform.form.createdBy = this.userInfo.realName;
      this.addform.title = "添加";
      this.addform.modal = true;
      this.addform.form.id = "";
      this.projectList = [];
    },
    // 盘点类型的切换
    typeChange(value){
       if(value === "supplier_inventory"){
         this.projectList = this.projectList2;
          this.addform.form.inventoryObject = "";
       }
       if(value === 'self_inventory'){
         this.projectList = this.projectList1;
         this.$nextTick(()=>{
           this.addform.form.inventoryObject = "IT开发部仓库";
         })
       }
    },
    // 盘点对象模糊搜索
    inventobjSearch(query){
      if(query !== ""){
        this.loadingObj = true;
        let params = {};
        params.type = 2;
        params.supplier = query;
        this.$supplyAPI.getSupplyInfo(params).then(res => {
          if(res.code === 200) {
            this.objList = res.data;
          }
        }).finally(()=>{
          this.loadingObj = false;
        })
      }
      else{
        this.objList = [];
      }
    },
    // 页
    changePage(e) {
      this.pageProps.page = e;
      this.getList();
    },
    // 页数
    changePageSize(e) {
      this.pageProps.perPage = e;
      this.getList();
    },
    // 添加/编辑
    addSubmit() {
      this.$refs.addform.validate(valid => {
        if (valid) {
          if (this.addform.form.fileItems.length <= 0) return this.$Message.error("请上传计划文件");
          let params = this.addform.form;
          params.inventoryTime = this.formatDate(params.inventoryTime);
          // 编辑
           if(this.addform.form.id){
              this.$API.inventoryRecordsUpdate(params).then(res => {
                if(res.code === 0){
                  this.$Message.success(res.msg);
                  this.addform.modal = false;
                  this.getList();
                }
              })
           }
          //  增加
           else{
              delete params.id;
              this.$API.inventoryRecordsAdd(params).then(res => {
                if(res.code === 0){
                  this.$Message.success(res.msg);
                  this.addform.modal = false;
                  this.pageProps.page = 1;
                  this.getList();
                }
              });
           }
          
        }
      });
    },
    // 操作验证
      operationVerify() {
        let msg;
        if (this.recordationList.selection.length <= 0) return msg = '请选择一条数据'
        if (this.recordationList.selection.length > 1) return msg = '一次只能操作一条数据'
      },
    // 上传凭证
    handleUpload(file) {
     
    },
    // 上传凭证成功
    onsuccess(response, file, fileList) {
      if (response.code === 0) {
        this.$Message.success(response.msg);
        this.addform.form.fileItems.push(response.data.fileUploadVo);
      } else {
        this.$Message.error("上传有误");
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
      this.addform.form.fileItems.splice(index, 1);
    },
    selectionChange(selection) {
        this.recordationList.selection = selection
      },
    // 初审弹窗
    firstTrail() {
      let msg = this.operationVerify();
      if (msg) return this.$Message.warning(msg);
      let {id,status}= this.recordationList.selection[0];
      if(status === "已驳回" || status ==="待复审" || status==="复审通过") return this.$Message.warning("已审核");
      if(status === "已作废") return this.$Message.warning("作废的不能进行审核");
      this.firstModal.modal = true;
      // 详情
      this.$API.inventoryRecordsDetail(id).then(res => {
        this.firstModal.form = res.data;
        this.firstModal.form.people = res.data.createdBy;
        this.firstModal.form.nextpeople = res.data.createdBy;
        
      })
    },
    // 初审保存
    firstSubmit(modal,form){
        this.$refs[form].validate(valid => {
           if(valid){
             let params = {};
             params.id = this.firstModal.form.id;
             params.opinion = this.firstModal.form.opinion;
             params.isPass = this.firstModal.form.throughReject === '通过'?'yes':'no';
             params.type = 'first';
            //  调用接口
             this.$API.inventoryRecordsAudit(params).then(res => {
               if(res.code === 0){
                 this.recordationList.selection = "";
                 this.$Message.success(res.msg);
                 this.firstModal.modal = false;
                 this.getList();
               }
             })
           }
        })
    },
    // 复审
    reviewCheck() {
      let msg = this.operationVerify();
      if (msg) return this.$Message.warning(msg);
      let {status,id} = this.recordationList.selection[0];
      if(status === "已驳回" || status === "待审核") return this.$Message.warning("初审未通过或未审核");
      if(status === "复审通过") return this.$Message.warning("已经审核");
       if(status === "已作废") return this.$Message.warning("作废的不能进行审核");
      this.reviewModal.modal = true;
       // 详情
      this.$API.inventoryRecordsDetail(id).then(res => {
        this.reviewModal.form = res.data;
        this.reviewModal.form.people = res.data.auditPendingLog.createdBy;
        this.reviewModal.form.firstReviewdate = res.data.createdAt;
        this.reviewModal.form.opinion = res.data.auditPendingLog.ext.opinion;
      })
    },
    // 复审提交按钮
    AuditSubmit(modal,form){
      this.$refs[form].validate(valid => {
        if(valid){
           let params = {};
             params.id = this.reviewModal.form.id;
             params.opinion = this.reviewModal.form.reopinion;
             params.isPass = this.reviewModal.form.throughReject === '通过'?'yes':'no';
             params.type = 'second';
             this.$API.inventoryRecordsAudit(params).then(res => {
                if(res.code === 0){
                  this.recordationList.selection = "";
                  this.$Message.success(res.msg);
                  this.reviewModal.modal = false;
                  this.getList();
                }
             })
        }
      })
    },
    // 作废
    invalidRecords() {
      let msg = this.operationVerify();
      if (msg) return this.$Message.warning(msg);
      this.invalidModal.form.revocatpeople = this.userInfo.realName;
      this.invalidModal.modal = true;
    },
    // 作废确定按钮
    invalSubmit(modal,form){
       this.$refs[form].validate(valid => {
           if(valid){
             let {id} = this.recordationList.selection[0];
             this.$API.inventoryRecordsInvalid(id).then(res => {
               if(res.code === 0){
                 this.$Message.success(res.msg);
                 this.invalidModal.modal = false;
                 this.getList();
               }
             })
           }
       })
      
    },
    // 编辑
    handleEdit(index,row) {
       this.addform.title = "编辑";
        this.addform.modal = true;
        this.$refs.addform.resetFields(); //清楚上一次验证,同时也会将数据清
        let id = row.id;
        // 获取编辑详情
        this.$API.inventoryRecordsDetail(id).then(res => {
          if(res.code === 0){
            let checkType = res.data.checkType === "自仓库存"?'self_inventory':res.data.checkType === "供应商库存"?'supplier_inventory':'';
            this.addform.form = res.data;
            this.addform.form.checkType = checkType;
          }
        })
    }, 
    // 删除
    handleDelete(index,row) {
      let id = row.id;
      this.$API.inventoryRecordsDel(id).then(res => {
        if(res.code === 0){
           this.$Message.success(res.msg);
           this.getList();
        }
      })
    },
    // 导出数据
    exportdata() {
      let params = this.iventoryform;
      this.$API.inventoryRecordsExport(params).then(res => {
        this.downLoadXls(res);
      });
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
    // 日期格式转换
    formatDate(date) {
      date = new Date(date);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      return y + "-" + m;
    }
  }
};
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