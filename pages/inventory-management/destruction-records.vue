<template>
  <div id="destruction">
    <Card>
      <Row slot="title">
        <Form :model="iventoryform" inline>
            <Row type="flex" justify="space-between">
              <Col :xs="20">
                <FormItem prop="lossOrderSn">
                  <Input v-model="iventoryform.lossOrderSn" placeholder="请输入损失单号"></Input>
                </FormItem>
                 <FormItem prop="createdBy">
                  <Input v-model="iventoryform.createdBy" placeholder="请输入损耗记录人"></Input>
                </FormItem>
                <FormItem prop="createdTime">
                  <DatePicker v-model="iventoryform.createdTime" type="date" placeholder="请选择记录时间"></DatePicker>
                </FormItem>
                <FormItem prop="supplier">
                  <Input v-model="iventoryform.supplier" placeholder="请输入供应商"></Input>
                </FormItem>
                <FormItem prop="destructionStatus">
                  <Input v-model="iventoryform.destructionStatus" placeholder="状态"></Input>
                </FormItem>
                <FormItem prop="outboundOrderSn">
                  <Input v-model="iventoryform.outboundOrderSn" placeholder="出库单号"></Input>
                </FormItem>
              </Col>
              <Button type="primary">搜索</Button>
            </Row>
            <Row>
              <Col>
                <Button type="primary">导出数据</Button>
                <Button type="primary" @click="addDesturction">添加消耗</Button>
                <Button type="primary" @click="firstSubmit">初审</Button>
                <Button type="primary" @click="reviewSubmit">复审</Button>
                <Button type="primary" @click="cancelSubmit">核销处理</Button>
                <Button type="primary">灌包补发申请</Button>
                <Button type="primary">作废</Button>
              </Col>
            </Row>
        </Form>
        <Tabs>
           <TabPane label="损耗记录" name>
              <Table border ref="selection"  :columns="recordationList.inventoryList" :data="recordationList.iventorydata"></Table>
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
                 <Input v-model="addform.form.createdBy" placeholder="损耗记录人" ></Input>
              </FormItem>
              <FormItem label="是否有出库单" prop="hasOutboundApply">
                 <Select v-model="addform.form.hasOutboundApply" placeholder="请选择" style="width:200px" @on-change="ckbtnChange" clearable>
                   <Option  v-for="(item,index) in ChuKuList" :value="item.value" :key="item.value">{{item.label}}</Option>
                 </Select>
              </FormItem>
              <FormItem label="请输入损耗数量" prop="lossNumber">
                 <Input v-model="addform.form.lossNumber" placeholder="请输入"></Input>
              </FormItem>
              <FormItem label="下级经办人" prop="nextpeople">
                 <Input v-model="addform.form.nextpeople" placeholder="请输入"></Input>
              </FormItem>
            </Col>
          </Row>
          <!-- 当是否有出库单选择是的时候 -->
          <Row v-if="addform.form.hasOutboundApply === 'yes'">
            <Col>
             <FormItem label="请输入出库单号" prop="">
                <Input placeholder="请输入"></Input>
             </FormItem>
             <FormItem label="灌包订单号">
                <Input placeholder="请输入"></Input>
             </FormItem>
             <FormItem label="品牌">
                <Input placeholder="请输入"></Input>
             </FormItem>
             <FormItem label="慕可代码">
                <Input placeholder="请输入"></Input>
             </FormItem>
             <FormItem label="产品名称">
                <Input placeholder="请输入"></Input>
             </FormItem>
             <FormItem label="下单数量">
                <Input placeholder="请输入"></Input>
             </FormItem>
             <FormItem label="实际出库量">
                <Input placeholder="请输入"></Input>
             </FormItem>
             <FormItem label="出库序列号范围">
                <Input placeholder="请输入"></Input>
             </FormItem>
             <FormItem label="出库时间">
                <Input placeholder="请输入"></Input>
             </FormItem>
             <FormItem label="OEM供应商">
                <Input placeholder="请输入"></Input>
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
              <FormItem label="OEM供应商">
                <Input placeholder="请输入"></Input>
              </FormItem>
              <FormItem label="标类型">
                <Input placeholder="请输入"></Input>
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
      <Form ref="firstModal" inline :model="firstModal.form" label-position="top">
         <div class="title">
          <span class="line"></span>
          <div class="title-text">基础信息</div>
          <span class="line"></span>
        </div>
         <Row :xs="24" style="padding:0 20px">
           <FormItem label="损耗记录人">
              <Input placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="申请时间">
              <Input placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="损耗单号">
              <Input placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="是否有出库单">
              <Input placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="品牌">
              <Input placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="标类型">
              <Input placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="损耗数量">
              <Input placeholder="请输入" style="width:160px"></Input>
           </FormItem>
         </Row>
         <Row :xs="24" style="padding:0 20px">
           <FormItem label="灌包订单号">
              <Input placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="慕可代码">
              <Input placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="产品名称">
              <Input placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="OEM供应">
              <Input placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="实际出库">
              <Input placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="出库序列号范围">
              <Input placeholder="请输入" style="width:160px"></Input>
           </FormItem>
         </Row>
         <Row style="padding:0 20px">
           <FormItem label="损耗理由">
              <Input placeholder="请输入" style="width:700px"></Input>
           </FormItem>
           <FormItem label="损耗凭证">
              <Input placeholder="请输入"></Input>
           </FormItem>
         </Row>
         <div class="title">
          <span class="line"></span>
          <div class="title-text">初审</div>
          <span class="line"></span>
        </div>
         <Row style="padding:0 30px">
          <FormItem label="经办人">
            <Input placeholder="经办人"></Input>
          </FormItem>
          <FormItem  label="审核" style="padding:0 0px 0 30px">
            <RadioGroup>
              <Radio label="通过"></Radio>
              <Radio label="驳回"></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="审核意见" style="padding:0 0px 0 40px">
            <Input
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
    </Modal>
    <!-- 复审 -->
    <Modal v-model="reviewModal.modal" :title="reviewModal.title" width="1300">
      <Form ref="reviewModal" inline :model="reviewModal.form" label-position="top">
         <div class="title">
          <span class="line"></span>
          <div class="title-text">基础信息</div>
          <span class="line"></span>
        </div>
         <Row :xs="24" style="padding:0 20px">
           <FormItem label="损耗记录人">
              <Input placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="申请时间">
              <Input placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="损耗单号">
              <Input placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="是否有出库单">
              <Input placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="品牌">
              <Input placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="标类型">
              <Input placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="损耗数量">
              <Input placeholder="请输入" style="width:160px"></Input>
           </FormItem>
         </Row>
         <Row :xs="24" style="padding:0 20px">
           <FormItem label="灌包订单号">
              <Input placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="慕可代码">
              <Input placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="产品名称">
              <Input placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="OEM供应">
              <Input placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="实际出库">
              <Input placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="出库序列号范围">
              <Input placeholder="请输入" style="width:160px"></Input>
           </FormItem>
         </Row>
         <Row style="padding:0 20px">
           <FormItem label="损耗理由">
              <Input placeholder="请输入" style="width:700px"></Input>
           </FormItem>
           <FormItem label="损耗凭证">
              <Input placeholder="请输入"></Input>
           </FormItem>
         </Row>
         <div class="title">
          <span class="line"></span>
          <div class="title-text">审核</div>
          <span class="line"></span>
        </div>
        <Row style="padding:0 30px">
          <FormItem label="经办人">
             <Input placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="初审时间">
             <Input placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="审核意见">
             <Input placeholder="请输入" style="width:700px"></Input>
          </FormItem>
        </Row>
         <div class="title">
          <span class="line"></span>
          <div class="title-text">复审</div>
          <span class="line"></span>
        </div>
         <Row style="padding:0 30px">
          <FormItem label="经办人">
            <Input placeholder="经办人"></Input>
          </FormItem>
          <FormItem  label="审核" style="padding:0 0px 0 30px">
            <RadioGroup>
              <Radio label="通过"></Radio>
              <Radio label="驳回"></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="审核意见" style="padding:0 0px 0 40px">
            <Input
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
    </Modal>
    <!-- 核销处理 -->
    <Modal v-model="cancelModal.modal" :title="cancelModal.title" width="1300">
       <Form ref="cancelModal" inline :model="cancelModal.form" label-position="top">
         <div class="title">
          <span class="line"></span>
          <div class="title-text">基础信息</div>
          <span class="line"></span>
        </div>
         <Row :xs="24" style="padding:0 20px">
           <FormItem label="损耗记录人">
              <Input placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="申请时间">
              <Input placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="损耗单号">
              <Input placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="是否有出库单">
              <Input placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="品牌">
              <Input placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="标类型">
              <Input placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="损耗数量">
              <Input placeholder="请输入" style="width:160px"></Input>
           </FormItem>
         </Row>
         <Row :xs="24" style="padding:0 20px">
           <FormItem label="灌包订单号">
              <Input placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="慕可代码">
              <Input placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="产品名称">
              <Input placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="OEM供应">
              <Input placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="实际出库">
              <Input placeholder="请输入" style="width:160px"></Input>
           </FormItem>
            <FormItem label="出库序列号范围">
              <Input placeholder="请输入" style="width:160px"></Input>
           </FormItem>
         </Row>
         <Row style="padding:0 20px">
           <FormItem label="损耗理由">
              <Input placeholder="请输入" style="width:700px"></Input>
           </FormItem>
           <FormItem label="损耗凭证">
              <Input placeholder="请输入"></Input>
           </FormItem>
         </Row>
         <div class="title">
          <span class="line"></span>
          <div class="title-text">核销处理</div>
          <span class="line"></span>
        </div>
        <Row style="padding:0 20px">
          <FormItem label="经办人">
             <Input placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="核销数量">
             <Input placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="核销类型">
             <Input placeholder="请输入" ></Input>
          </FormItem>
          <FormItem label="核销备注">
             <Input placeholder="请输入"></Input>
          </FormItem>
        </Row>
        <Row  style="padding:0 2 0px">
            <FormItem label="损耗凭证">
              <Upload
              action="">
                <Button icon="ios-cloud-upload-outline" class="margin-bottom-10">选择文件</Button>
              </Upload>
            </FormItem>
          </Row>
      </Form>
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
      // 添加
      addform:{
        modal:false,
        title:'添加',
        form:{
           createdBy:'', //损耗记录人
           hasOutboundApply:'', //是否有出库单
           lossNumber:'', //s损耗数量
           nextpeople:'', //下级经办人
           brand:'', //品牌
           supplier:'', //OEM供应商
           markType:'', //标类型
           lossReason:'', //损耗理由
           lossFileItems:[], //损耗凭证

        }
      },
      // 添加验证
      addRules:{
           lossNumber:[{required:true,message: "损耗数量不能为空", trigger: "blur" }],
           lossReason:[{required:true,message:'损耗理由不能为空',trigger:'blur'}],
           brand:[{required:true,message:'品牌不能为空',trigger:'blur'}]
      },
      // 初审
      firstModal:{
        modal:false,
        title:'损耗单的审核',
        form:{
          createdBy:'' //损耗记录人
        }
      },
      // 复审
      reviewModal:{
        modal:false,
        title:'损耗单的审核',
        form:{
          createdBy:'' //损耗记录人
        }
      },
      // 核销处理
      cancelModal:{
        modal:false,
        title:'核销处理',
        form:{}
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
              title:'损耗记录人',
              key:'createdBy',
              width:150,
              align:'center'
            },
            {
              title:'记录时间',
              key:'createdTime',
              width:200,
              align:'center'
            },
            {
              title:'损耗单号',
              key:'lossOrderSn',
              width:200,
              align:'center'
            },
            {
              title:'是否有出库单',
              width:150,
              align:'center'
            },
            {
              title:'出库单号',
              key:'outboundOrderSn',
              width:200,
              align:'center'
            },
            {
              title:'OEM供应商',
              width:250,
              align:'center'
            },
            {
              title:'损耗数量',
              width:100,
              align:'center'
            },
            {
              title:'状态',
              width:100,
              align:'center'
            },
            {
              title:'是否补发',
              width:'150',
              align:'center'
            },
            {
              title:'操作',
              slot:'action',
              align:'center',
              width:200
            }
          ],
          iventorydata: [] //表里面的数据
      },
      // 页码
      pageProps: {
        page: "",
        perPage: "",
        count: 0,
        pageCount:'', //记录当前第几页
      },
    } 
  },
  mounted(){
    this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
    this.getList();
  },
  methods:{
    // 列表数据
    getList(){
      let params = this.iventoryform;
      params.type = 'write_off';
      this.$API.inventoryConsumptionList(params).then(res =>{
        console.log(res);
        if(res.code === 0){
          this.recordationList.inventorydata = res.data.list;
          this.pageProps.page = res.data.page;
          this.pageProps.perPage = res.data.perPage;
        }
      })
    },
    // 添加消耗
    addDesturction(){
      this.$refs.addform.resetFields(); //清楚上一次验证,同时也会将数据清空
      this.addform.modal = true;
    },
    // 添加保存按钮
    addSubmit(){
       this.$refs.addform.validate(valid => {
         if(valid){
           if(this.addform.form.lossFileItems.length <=0) return this.$Message.error("请上传文件");
         }
       })
    },
    // 是否有出库单选择
    ckbtnChange(value){
      console.log(value);
    },
    // 初审
    firstSubmit(){
      this.firstModal.modal = true;
    },
    // 复审
    reviewSubmit(){
      this.reviewModal.modal = true;
    },
    // 核销处理
    cancelSubmit(){
      this.cancelModal.modal = true;
    },
    // 切换页
    changePage(){

    },
    // 页
    changePageSize(){

    },
    // 上传凭证
    handleUpload(file) {
     
    },
    // 上传损耗凭证
    onsuccess(response,file,fileList){
      console.log(response);
      if(response.code === 0){
        this.$Message.success(response.msg);
        this.addform.form.lossFileItems.push(response.data.fileUploadVo);
      }
      else{
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
       this.addform.form.lossFileItems.splice(index, 1);
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