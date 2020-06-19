<template>
  <div id="recycling">
    <Card>
      <Row slot="title">
        <Form :model="iventoryform" inline>
            <Row type="flex" justify="space-between">
              <Col :xs="20">
                <FormItem>
                  <Input placeholder="回收单号"></Input>
                </FormItem>
                 <FormItem>
                  <Input placeholder="回收记录人"></Input>
                </FormItem>
                <FormItem>
                  <Input placeholder="记录时间"></Input>
                </FormItem>
                <FormItem>
                  <Input placeholder="回收单号"></Input>
                </FormItem>
                <FormItem>
                  <Input placeholder="供应商"></Input>
                </FormItem>
                <FormItem>
                  <Input placeholder="状态"></Input>
                </FormItem>
                <FormItem>
                  <Input placeholder="出库单号"></Input>
                </FormItem>
              </Col>
              <Button type="primary">搜索</Button>
            </Row>
            <Row>
              <Col>
                <Button type="primary">导出数据</Button>
                <Button type="primary" @click="addRecycling">添加回收</Button>
                <Button type="primary" @click="firstSubmit">初审</Button>
                <Button type="primary" @click="reviewSubmit">复审</Button>
                <Button type="primary">回收入库</Button>
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
    </Card>
    <!-- 添加消耗 -->
    <Modal v-model="addform.modal" :title="addform.title" width="1300">
      <Card>
        <Row slot="title">
          <Row type="flex" justify="end">
            <Button type="primary">确认提交</Button>
          </Row>
        </Row>
        <Form :model="addform.form" ref="addform" inline label-position="top">
          <Row>
            <Col :xs="24">
              <FormItem label="损耗记录人">
                 <Input placeholder="损耗记录人"></Input>
              </FormItem>
              <FormItem label="是否有出库单">
                 <Select v-model="addform.form.isChuKu" placeholder="请选择" style="width:200px" @on-change="ckbtnChange" clearable>
                   <Option  v-for="(item,index) in ChuKuList" :value="item.value" :key="item.value">{{item.label}}</Option>
                 </Select>
              </FormItem>
              <FormItem label="请输入损耗数量">
                 <Input placeholder="请输入"></Input>
              </FormItem>
              <FormItem label="下级经办人">
                 <Input placeholder="请输入"></Input>
              </FormItem>
            </Col>
          </Row>
          <!-- 当是否有出库单选择是的时候 -->
          <Row v-if="addform.form.isChuKu === '是'">
            <Col>
             <FormItem label="请输入出库单号">
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
                <Input placeholder="请输入"></Input>
             </FormItem>
            </Col>
          </Row>
          <!--当是否出库单选择否的时候 -->
          <Row v-else-if="addform.form.isChuKu === '否'">
            <Col>
              <FormItem label="品牌">
                <Input placeholder="请输入"></Input>
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
              <FormItem label="损耗理由">
                <Input placeholder="请输入" style="width:800px"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <FormItem label="损耗凭证">
              <Upload
              action="">
                <Button icon="ios-cloud-upload-outline" class="margin-bottom-10">选择文件</Button>
              </Upload>
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
         <Row :xs="24" style="padding:0 40px">
           <FormItem label="回收记录人">
              <Input placeholder="请输入" style="width:180px"></Input>
           </FormItem>
            <FormItem label="申请时间">
              <Input placeholder="请输入" style="width:180px"></Input>
           </FormItem>
            <FormItem label="回收单号">
              <Input placeholder="请输入" style="width:180px"></Input>
           </FormItem>
            <FormItem label="是否有出库单">
              <Input placeholder="请输入" style="width:180px"></Input>
           </FormItem>
            <FormItem label="品牌">
              <Input placeholder="请输入" style="width:180px"></Input>
           </FormItem>
            <FormItem label="标类型">
              <Input placeholder="请输入" style="width:180px"></Input>
           </FormItem>
         </Row>
         <Row :xs="24" style="padding:0 40px">
           <FormItem label="回收数量">
              <Input placeholder="请输入" style="width:180px"></Input>
           </FormItem>
           <FormItem label="灌包订单号">
              <Input placeholder="请输入" style="width:180px"></Input>
           </FormItem>
            <FormItem label="慕可代码">
              <Input placeholder="请输入" style="width:180px"></Input>
           </FormItem>
            <FormItem label="产品名称">
              <Input placeholder="请输入" style="width:180px"></Input>
           </FormItem>
            <FormItem label="OEM供应">
              <Input placeholder="请输入" style="width:180px"></Input>
           </FormItem>
            <FormItem label="实际出库量">
              <Input placeholder="请输入" style="width:180px"></Input>
           </FormItem>
         </Row>
         <Row style="padding:0 40px">
           <FormItem label="出库序列号范围">
              <Input placeholder="请输入" style="width:180px"></Input>
           </FormItem>
           <FormItem label="回收理由">
              <Input placeholder="请输入" style="width:400px"></Input>
           </FormItem>
           <FormItem label="回收凭证">
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
  </div>
</template>
<script>
export default {
   data(){
     return {
       iventoryform:{

       },
       // 添加
      addform:{
        modal:false,
        title:'添加',
        form:{
           createdBy:'', //损耗记录人
           isChuKu:'', //是否有出库单
        }
      },
       // 初审
      firstModal:{
        modal:false,
        title:'损耗单的审核',
        form:{
          createdBy:'' //损耗记录人
        }
      },
       // 出库列表
      ChuKuList:[
        {
          label:'是',
          value:'是',
        },
        {
          label:'否',
          value:'否'
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
                key: "id",
                width: 80,
                align: "center"
            },
            {
              title:'回收记录人',
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
              title:'回收单号',
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
              title:'回收数量',
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
         iventorydata:[]
       }
     }
   },
   methods:{
    //  添加回收
     addRecycling(){
        this.addform.modal = true;
     },
    //  初审
     firstSubmit(){
        this.firstModal.modal = true;
     },
    //  复审
     reviewSubmit(){

     },
    // 是否有出库单选择
    ckbtnChange(value){
      console.log(value);
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