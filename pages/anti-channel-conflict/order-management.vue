<template>
  <div class="fact-management">
    <Row class="search-form">
      <Col :sm="24">
        <Form ref="searchData" :model="searchData" class="searchData">
          <FormItem>
            <Input
              v-model="searchData.orderNumber"
              placeholder="订单号"
              clearable
              @on-enter="getList('searchData')"
            ></Input>
          </FormItem>
          <FormItem>
            <Input
              v-model="searchData.productName"
              placeholder="产品名称"
              clearable
              @on-enter="getList('searchData')"
            ></Input>
          </FormItem>
          <FormItem>
            <Input
              v-model="searchData.factory"
              placeholder="所属加工厂"
              clearable
              @on-enter="getList('searchData')"
            ></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" icon="ios-search" @click="getList('searchData', 'noPage')">查询</Button>
          </FormItem>
          <FormItem style="float:right">
            <Col span="12">
              <Button type="primary" icon="md-repeat" @click="addOrder">新增订单</Button>
            </Col>
          </FormItem>
        </Form>
      </Col>
    </Row>
    <Row class="margin-top-10">
      <Table
        :columns="listData.columns"
        :data="listData.data"
        size="small"
        border
        @on-selection-change="selectCheck(e)"
        highlight-row
        :loading="loading"
      >
        <!-- 收货方 -->
        <template slot-scope="{index, row}" slot="consignee">
          <a
            @click="handleConsignee(index, row)"
            style="color: #2d8cf0"
            v-if="row.deletedAt!='已撤单'"
          >查看</a>
          <a @click="handleConsignee(index, row)" v-if="row.deletedAt=='已撤单'" disabled>查看</a>
        </template>
        <!-- 生产数据 -->
        <template slot-scope="{index, row}" slot="createData">
          <a style="color: #2d8cf0" v-if="row.deletedAt!='已撤单'">查看</a>
          <a @click="handleConsignee(index, row)" v-if="row.deletedAt=='已撤单'" disabled>查看</a>
        </template>
        <!-- 操作 -->
        <template slot-scope="{index, row}" slot="action">
          <a
            size="small"
            @click="handleEdit(index, row)"
            style="color: #2d8cf0"
            v-if="row.deletedAt!='已撤单'"
          >编辑</a>
          <a @click="handleConsignee(index, row)" v-if="row.deletedAt=='已撤单'" disabled>编辑</a>
          <a
            v-if="row.deletedAt=='未撤单' "
            @click="handleDelete(index, row)"
            style="color: #F56C6C"
            ghost
          >撤单</a>
          <a v-if="row.deletedAt=='已撤单' " style="color: #CCC" disabled>已撤单</a>
        </template>
      </Table>
      <div style="margin: 10px;overflow: hidden">
        <div class="pages-L">共 {{pageProps.totalCount}} 条</div>
        <div style="float: right;">
          <Page
            size="small"
            :total="pageProps.totalCount"
            :current="pageProps.page"
            show-sizer
            show-elevator
            @on-change="changePage"
            @on-page-size-change="changePageSize"
          ></Page>
        </div>
      </div>
    </Row>

    <!-- 增加新工厂弹窗 -->
    <Modal v-model="orderAddStatus" title="新增订单" @on-cancel="cancelAdd('orderData1')">
      <Form ref="orderData1" :model="orderData" :rules="OrderRule" class="orderData">
        <FormItem label="订单编号：" prop="orderNumber" :label-width="100">
          <Input v-model="orderData.orderNumber" clearable></Input>
        </FormItem>
        <FormItem label="订单数量：" prop="orderCount" :label-width="100">
          <Input v-model="orderData.orderCount" clearable></Input>
        </FormItem>
        <!-- <FormItem label="产品名称：" prop="productName" :label-width="100">
          <Input v-model="orderData.productName" clearable></Input>
        </FormItem>-->
        <FormItem label="产品名称：" prop="productName" :label-width="100">
              <Select
                style="width:100%"
                v-model="orderData.productName"
                filterable
                remote
                :remote-method="(query) => { remoteMethod1(query, '产品名称', 'list1') }"
                :loading="loading1"
              >
                <Option
                  v-for="(option, index) in list1"
                  :value="option.name"
                  :key="index"
                >{{option.name}}</Option>
              </Select>
        </FormItem>
        <FormItem label="所属加工厂" prop="factory" :label-width="100">
          <template>
              <Select
                style="width:100%"
                v-model="orderData.factory"
                filterable
                remote
                :remote-method="(query) => { remoteMethod1(query, '所属工厂', 'list2') }"
                :loading="loading1"
              >
                <Option
                  v-for="(option, index) in list2"
                  :value="option.name"
                  :key="index"
                >{{option.name}}</Option>
              </Select>
          </template>
        </FormItem>
        <FormItem label="规格：" prop="specification" :label-width="100">
          <template>
            <Select v-model="orderData.specification" clearable style="width:100%">
              <Option
                v-for="item in specificationList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </template>
        </FormItem>
        <FormItem label="收货方：" prop="consignee" :label-width="100">
          <template>
            <div v-for="(d, index) in orderData.consignee" :key="index">
              <template>
                <Row>
                  <Select v-model="d.consigneeType" clearable style="width:30%">
                    <Option
                      v-for="item in consigneeTypeList"
                      :value="item.value"
                      :key="item.value"
                    >{{ item.label }}</Option>
                  </Select>
                  <Input
                    v-if="d.consigneeType=='自定义'"
                    v-model="d.consigneeName"
                    placeholder="输入收货方名称"
                    clearable
                    style="width: 60%"
                  ></Input>
                  <Select
                    v-else
                    @on-change="getAddress(d.consigneeName, d)"
                    style="width:60%"
                    v-model="d.consigneeName"
                    filterable
                    remote
                    :remote-method="(query) => { remoteMethod1(query, d.consigneeType, 'list') }"
                    :loading="loading1"
                  >
                    <Option
                      v-for="(option, index) in list"
                      :value="option.name"
                      :key="index"
                    >{{option.name}}</Option>
                  </Select>
                  <Button
                    v-if="index == 0"
                    style="background: #409EFF; width:29px;"
                    @click="addButton"
                  >+</Button>
                  <Button
                    v-if="index > 0"
                    style="background: #F56C6C; width:29px;"
                    @click="delButton"
                  >-</Button>
                </Row>
              </template>
              <Input
                v-if="d.consigneeType == '自定义'"
                v-model="d.consigneeAddress"
                clearable
                style="width: 91%"
                placeholder="输入收货方地址"
              ></Input>
            </div>
          </template>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button
          type="primary"
          :loading="oderLoading"
          @click="confirmAdd('orderData1')"
          :disabled="isdisabled"
        >确定</Button>
        <Button type="default" :loading="oderLoading" @click="cancelAdd('orderData1')">取消</Button>
      </div>
    </Modal>

    <!-- 编辑弹窗 -->
    <Modal v-model="orderEditStatus" title="工厂信息编辑" @on-cancel="cancelEdit('orderData2')">
      <Form ref="orderData2" :model="orderData" :rules="OrderRule2" class="orderData">
        <FormItem label="订单编号：" prop="orderNumber" :label-width="100">
          <Input v-model="orderData.orderNumber" clearable></Input>
        </FormItem>
        <FormItem label="订单数量：" prop="orderCount" :label-width="100">
          <Input v-model="orderData.orderCount" clearable></Input>
        </FormItem>
        <FormItem label="产品名称：" prop="productName" :label-width="100">
              <Select
                style="width:100%"
                v-model="orderData.productName"
                filterable
                remote
                :remote-method="(query) => { remoteMethod1(query, '产品名称', 'list1') }"
                :loading="loading1"
              >
                <Option
                  v-for="(option, index) in list1"
                  :value="option.name"
                  :key="index"
                >{{option.name}}</Option>
              </Select>
        </FormItem>
        <FormItem label="所属加工厂" prop="factory" :label-width="100">
          <template>
              <Select
                style="width:100%"
                v-model="orderData.factory"
                filterable
                remote
                :remote-method="(query) => { remoteMethod1(query, '所属工厂', 'list2') }"
                :loading="loading1"
              >
                <Option
                  v-for="(option, index) in list2"
                  :value="option.name"
                  :key="index"
                >{{option.name}}</Option>
              </Select>
          </template>
        </FormItem>
        <FormItem label="规格：" prop="specification" :label-width="100">
          <template>
            <Select v-model="orderData.specification" clearable style="width:100%">
              <Option
                v-for="item in specificationList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </template>
        </FormItem>
        <FormItem label="规格：" prop="specification" :label-width="100">
          <template>
            <Select v-model="orderData.specification" clearable style="width:100%">
              <Option
                v-for="item in specificationList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </template>
        </FormItem>
        <FormItem label="收货方：" prop="consignee" :label-width="100">
          <template>
            <div v-for="(d, index) in orderData.consignee" :key="index">
              <template>
                <Row>
                  <Select v-model="d.consigneeType" clearable style="width:30%">
                    <Option
                      v-for="item in consigneeTypeList"
                      :value="item.value"
                      :key="item.value"
                    >{{ item.label }}</Option>
                  </Select>
                  <Input
                    v-if="d.consigneeType=='自定义'"
                    v-model="d.consigneeName"
                    placeholder="输入收货方名称"
                    clearable
                    style="width: 60%"
                  ></Input>
                  <Select
                    v-else
                    @on-change="getAddress(d.consigneeName, d)"
                    style="width:58%"
                    v-model="d.consigneeName"
                    filterable
                    remote
                    :remote-method="(query) => { remoteMethod1(query, d.consigneeType, 'list') }"
                    :loading="loading1"
                  >
                    <Option
                      v-for="(option, index) in list"
                      :value="option.name"
                      :key="index"
                    >{{option.name}}</Option>
                  </Select>
                  <Button
                    v-if="index == 0"
                    style="background: #409EFF; width:29px;"
                    @click="addButton"
                  >+</Button>
                  <Button
                    v-if="index > 0"
                    style="background: #F56C6C; width:29px;"
                    @click="delButton"
                  >-</Button>
                </Row>
              </template>
              <Input
                v-if="d.consigneeType == '自定义'"
                v-model="d.consigneeAddress"
                clearable
                style="width: 89%"
                placeholder="输入收货方地址"
              ></Input>
            </div>
          </template>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button
          type="primary"
          :loading="oderLoading"
          @click="confirmEdit('orderData2')"
          :disabled="isdisabled"
        >确定</Button>
        <Button type="default" :loading="oderLoading" @click="cancelEdit('orderData2')">取消</Button>
      </div>
    </Modal>

    <!-- 查看收货方信息弹窗 -->
    <Modal v-model="orderConsigneeStatus" title="收货地址">
      <template>
        <i-table max-height="300" :columns="listData.columnsConsignee" :data="conData.consignee"></i-table>
      </template>
    </Modal>
  </div>
</template>
    </Modal>

  </div>
</template>
<script>
export default {
  data() {
    return {
      orderAddStatus: false,
      orderEditStatus: false,
      orderConsigneeStatus: false,
      loading: false,
      oderLoading: false,
      isdisabled: false,
      isNo: false,
      loading1: false,
      list: [],
      list1: [],
      list2: [],
      conData: {
        consignee: [
          {
            consigneeType: "",
            consigneeName: "",
            consigneeAddress: ""
          }
        ]
      },
      orderData: {
        specification: "",
        orderNumber: "",
        orderCount: "",
        productName: "",
        factory: "",
        deletedAt: "",
        info: [],
        detailInfo: [],
        consignee: [
          {
            consigneeType: "",
            consigneeName: "",
            consigneeAddress: ""
          }
        ]
      },
      specificationList: [
        {
          value: "1*12",
          label: "1*12"
        },
        {
          value: "1*24",
          label: "1*24"
        }
      ],
      consigneeTypeList: [
        {
          value: "合作商",
          label: "合作商"
        },
        {
          value: "仓库",
          label: "仓库"
        },
        {
          value: "自定义",
          label: "自定义"
        }
      ],
      OrderRule: {
        productName: [
          { required: true, message: "产品名称不能为空", trigger: "blur" }
        ],
        orderNumber: [
          { required: true, message: "订单编号不能为空", trigger: "blur" }
        ],
        orderCount: [
          { required: true, message: "产品数量不能为空", trigger: "blur" }
        ],
        factory: [
          { required: true, message: "加工厂不能为空", trigger: "blur" }
        ],
        specification: [
          { required: true, message: "规格不能为空", trigger: "blur" }
        ],
        info: [{ required: true, message: "收货方信息不完整", trigger: "blur" }]
      },
      OrderRule2: {
        productName: [
          { required: true, message: "产品名称不能为空", trigger: "blur" }
        ],

        orderCount: [
          { required: true, message: "产品数量不能为空", trigger: "blur" }
        ],
        factory: [
          { required: true, message: "加工厂不能为空", trigger: "blur" }
        ],
        specification: [
          { required: true, message: "规格不能为空", trigger: "blur" }
        ],
        detailInfo: [
          { required: true, message: "收货方信息填写不完整", trigger: "blur" }
        ]
      },
      searchData: {
        orderNumber: "",
        productName: "",
        factory: ""
      },
      listData: {
        columns: [
          { type: "selection", width: 60, align: "center" },
          {
            key: "index",
            type: "index",
            title: "序号",
            width: 65,
            align: "center"
          },
          {
            key: "orderNumber",
            title: "订单编号",
            minWidth: 100,
            align: "center"
          },
          {
            key: "orderCount",
            title: "订单数量",
            minWidth: 120,
            align: "center"
          },
          {
            key: "productName",
            title: "产品名称",
            minWidth: 100,
            align: "center"
          },
          {
            key: "factory",
            title: "所属加工厂",
            minWidth: 100,
            align: "center"
          },
          {
            key: "action",
            title: "收货方",
            minWidth: 100,
            align: "center",
            slot: "consignee"
          },
          {
            key: "action",
            title: "生产数据",
            minWidth: 100,
            align: "center",
            slot: "createData"
          },
          {
            key: "action",
            title: "操作",
            width: 150,
            align: "center",
            slot: "action"
          }
        ],
        columnsConsignee: [
          {
            key: "consigneeName",
            title: "收货方",
            minWidth: 100,
            align: "center"
          },
          {
            key: "consigneeType",
            title: "类型",
            minWidth: 120,
            align: "center"
          },
          {
            key: "consigneeAddress",
            title: "所在地址",
            minWidth: 100,
            align: "center"
          }
        ],
        data: []
      },
      pageProps: {
        // 列表分页属性
        page: 1,
        perPage: 10,
        currentPage: 1,
        totalCount: 0
      }
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    addButton() {
      this.orderData.consignee.push({});
    },
    delButton() {
      this.orderData.consignee.pop({});
    },

    //模糊搜索
    remoteMethod1(query, type, listKey) {
      console.log("搜索", query);
      if (query !== "") {
        this.loading1 = true;
        if (type == "合作商") {
          type = "partner";
        } else if (type == "仓库") {
          type = "warehouse";
        } else if (type == "产品名称") {
          type = "product_name";
        } else if (type == "所属工厂") {
          type = "factory";
        }
        console.log(type, query);
        if(type == "partner" || type == "warehouse" || type == "product_name" || type == "factory"){
          this.$API
          .searchOrderManagement({ type: type, searchName: query })
          .then(res => {
            console.log("this is search");
            console.log(res);
            this.loading1 = false;
            this[listKey] = res;
          });
        } else {
          this.$Message.error("请选择收货方类型");
        }
      }
    },

    getAddress(addressName, d) {
      for (var i = 0; i < this.list.length; i++) {
        if (this.list[i].name == addressName) {
          /* console.log(this.list[i].address) */
          d.consigneeAddress = this.list[i].address; 
        }
      }
    },

    // 添加新工厂
    addOrder() {
      this.orderAddStatus = true;
      this.isdisabled = false;
      this.orderData.orderNumber = "";
      this.orderData.orderCount = "";
      this.orderData.productName = "";
      this.orderData.factory = "";
      this.orderData.specification = "";
      this.orderData.consignee = [{ consigneeType: "" }];
    },
    // 确认添加
    confirmAdd(required) {
      console.log("this is confirmAdd");
      this.handleSubmit(required);
      this.orderData.info = this.orderData.consignee;
      this.orderData.deletedAt = "未撤单";
      let params = this.orderData;
      console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
      console.log(params);
      if (this.isNo === false) {
        this.$API.addOrderManagement(params).then(res => {
          console.log("this is res");
          console.log(res);
          if (res.code === 0) {
            this.orderAddStatus = false;
            this.$Message.success("提交成功");
            this.getList();
          }
        });
      }
    },
    selectCheck() {},
    changePage(e) {
      this.pageProps.page = e;
      this.getList();
    },
    changePageSize(e) {
      this.pageProps.perPage = e;
      this.getList();
    },

    //获取订单信息详情
    handleEdit(index, row) {
      console.log(row);
      this.orderEditStatus = true;
      this.$API.detailsOrderManagement(row.id).then(res => {
        if (res.code === 0) {
          /* console.log(res.data); */
          res.data.orderCount += "";
          this.orderData = res.data;
        }
      });
    },

    //订单信息编辑 - 确认编辑
    confirmEdit(required) {
      console.log("confirm edit");
      this.handleSubmit(required);
      this.isdisabled = false;
      let params = {
        id: this.orderData.id,
        productName: this.orderData.productName,
        orderNumber: this.orderData.orderNumber,
        orderCount: this.orderData.orderCount,
        factory: this.orderData.factory,
        specification: this.orderData.specification,
        detailInfo: JSON.parse(JSON.stringify(this.orderData.consignee))
      };
      for (var i = 0; i < params.detailInfo.length; i++) {
        console.log(params.orderCount, "rewrewqrqwrwrwqr");
        if (params.detailInfo[i].consigneeType == "合作商") {
          params.detailInfo[i].consigneeType = "partner";
        } else if (params.detailInfo[i].consigneeType == "仓库") {
          params.detailInfo[i].consigneeType = "warehouse";
        } else if (params.detailInfo[i].consigneeType == "自定义") {
          console.log(i);
          params.detailInfo[i].consigneeType = "customize";
        }
      }
      if (this.isNo === false) {
        this.$API.editOrderManagement(params).then(res => {
          if (res.code === 0) {
            this.$Message.success("提交成功");
            this.orderEditStatus = false;
            this.getList();
          }
        });
      }
    },
    // 取消添加
    cancelAdd(name) {
      this.orderAddStatus = false;
      this.$refs[name].resetFields();
    },
    // 取消编辑
    cancelEdit(name) {
      this.orderEditStatus = false;
      this.$refs[name].resetFields();
    },
    // 取消查看收货方信息
    cancelConsignee(name) {
      this.orderConsigneeStatus = false;
    },
    //订单信息删除
    handleDelete(index, row) {
      console.log("this is del");
      //删除对应id的内容
      if (confirm("确实要删除吗？")) {
        this.$API.deleteOrderManagement(row.id).then(res => {
          console.log("this is deleteOrderManagement");
          if (res.code === undefined || res.code === 0) {
            this.$Message.success("撤单成功!");
            this.getList();
          } else {
            this.$Message.error("撤单失败!");
          }
        });
      } else {
        this.$Message.info("已取消撤单!");
      }
    },

    // 弹窗校验
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          /* this.$Message.success("提交成功"); */
          this.isNo = false;
          this.orderAddStatus = false;
          this.orderEditStatus = false;
          /* this.getList(); */
        } else {
          this.$Message.error("请填写信息");
          this.isNo = true;
          return this.isNo;
        }
      });
    },

    //查看收货方信息
    handleConsignee(index, row) {
      console.log("this is handleConsignee");
      this.orderConsigneeStatus = true;
      this.$API.detailsOrderManagement(row.id).then(res => {
        console.log(res);
        if (res.code === 0) {
          this.conData.consignee = res.data.consignee;
        }
      });
    },

    //查看生产数据，未有接口
    /* showCreateData() {
      this.$router.push({path: '/anti-channel-conflict/create-data'});
    }, */

    // 获取数据
    getList(e, noPage) {
      let params = this.searchData;
      params.page = this.pageProps.page;
      params.perPage = this.pageProps.perPage;
      if (noPage === "noPage") {
        delete params.page;
        delete params.perPage;
      }
      this.$API
        .orderManagementList(params)
        .then(res => {
          this.loading = true;
          if (res.code === 0) {
            console.log(res.data);
            this.listData.data = res.data.data;
            this.pageProps.perPage = res.data.perPage;
            this.pageProps.page = res.data.page;
            this.pageProps.totalCount = res.data.count;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>
<style lang="less">
.fact-management {
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
