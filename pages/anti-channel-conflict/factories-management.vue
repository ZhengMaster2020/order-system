<template>
  <div class="fact-management">
    <Row class="search-form">
      <Col :sm="24">
        <Form ref="searchData" :model="searchData" class="searchData">
          <FormItem>
            <Input
              v-model="searchData.factoryName"
              placeholder="加工厂名称"
              clearable
              @on-enter="getList('searchData')"
            ></Input>
          </FormItem>
          <FormItem>
            <Input
              v-model="searchData.chargePerson"
              placeholder="负责人"
              clearable
              @on-enter="getList('searchData')"
            ></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" icon="ios-search" @click="getList('searchData', 'noPage')">查询</Button>
          </FormItem>
          <FormItem style="float:right">
            <Col span="12">
              <Button type="primary" icon="md-repeat" @click="addFactory">增加新工厂</Button>
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
        <!-- 操作 -->
        <template slot-scope="{index, row}" slot="action">
          <Button size="small" @click="handleEdit(index, row)">编辑</Button>
          <Button size="small" @click="handleDelete(index, row)">删除</Button>
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
    <Modal v-model="factoryAddStatus" title="新增加工厂" @on-cancel="cancelAdd('factoryData')">
      <Form ref="factoryData1" :model="factoryData" :rules="factoryRule" class="factoryData">
        <FormItem label="新工厂名称：" prop="factoryName" :label-width="100">
          <Input v-model="factoryData.factoryName" clearable></Input>
        </FormItem>
        <FormItem label="代码：" prop="factoryCode" :label-width="100">
          <Input v-model="factoryData.factoryCode" clearable></Input>
        </FormItem>
        <FormItem label="负责人：" prop="chargePerson" :label-width="100">
          <Input v-model="factoryData.chargePerson" clearable></Input>
        </FormItem>
        <FormItem label="联系电话：" prop="telephone" :label-width="100">
          <Input v-model="factoryData.telephone" clearable></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button
          type="primary"
          @click="confirmAdd('factoryData')"
          :disabled="isdisabled"
          :loading="factoryLoading"
        >确定</Button>
        <Button type="default" :loading="factoryLoading" @click="cancelAdd('factoryData1')">取消</Button>
      </div>
    </Modal>

    <!-- 编辑弹窗 -->
    <Modal v-model="factoryEditStatus" title="工厂信息编辑" @on-cancel="cancelEdit('factoryData')">
      <Form ref="factoryData" :model="factoryData" :rules="factoryRule" class="factoryData">
        <FormItem label="工厂名称：" prop="factoryName" :label-width="100">
          <Input v-model="factoryData.factoryName" clearable></Input>
        </FormItem>
        <FormItem label="代码：" prop="factoryCode" :label-width="100">
          <Input v-model="factoryData.factoryCode" clearable></Input>
        </FormItem>
        <FormItem label="负责人：" prop="chargePerson" :label-width="100">
          <Input v-model="factoryData.chargePerson" clearable></Input>
        </FormItem>
        <FormItem label="联系电话：" prop="telephone" :label-width="100">
          <Input v-model="factoryData.telephone" clearable></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button
          type="primary"
          :loading="factoryLoading"
          @click="confirmEdit('factoryData')"
          :disabled="isdisabled"
        >确定</Button>
        <Button type="default" :loading="factoryLoading" @click="cancelEdit('factoryData')">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  data() {
    // 电话格式校验
    const validateTeleCheck = (rule, value, callback) => {
      var reg = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/;
      if (value === "") {
        callback(new Error("电话不能为空"));
      } else if (!reg.test(value)) {
        callback(new Error("电话格式错误"));
      } else {
        callback();
      }
    };
    return {
      factoryAddStatus: false,
      factoryEditStatus: false,
      loading: false,
      factoryLoading: false,
      isdisabled: false,
      isNo: false,
      factoryData: {
        factoryName: "",
        factoryCode: "",
        chargePerson: "",
        telephone: ""
      },
      factoryRule: {
        factoryName: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ],
        factoryCode: [
          { required: true, message: "代码不能为空", trigger: "blur" }
        ],
        chargePerson: [
          { required: true, message: "负责人不能为空", trigger: "blur" }
        ],
        telephone: [
          /* { required: true, message: "联系电话不能为空", trigger: "blur" } */
          { required: true, validator: validateTeleCheck, trigger: "blur" }
        ]
      },
      searchData: {
        factoryName: "",
        chargePerson: ""
      },
      rulesForm: {},
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
            key: "factoryName",
            title: "加工厂名称",
            minWidth: 100,
            align: "center"
          },
          { key: "factoryCode", title: "代码", minWidth: 120, align: "center" },
          {
            key: "chargePerson",
            title: "负责人",
            minWidth: 100,
            align: "center"
          },
          {
            key: "telephone",
            title: "联系电话",
            minWidth: 100,
            align: "center"
          },
          {
            key: "action",
            title: "操作",
            width: 150,
            align: "center",
            slot: "action"
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
    // 添加新工厂
    addFactory() {
      this.factoryAddStatus = true;
      this.isdisabled = false;
      this.factoryData.factoryName = "";
      this.factoryData.factoryCode = "";
      this.factoryData.chargePerson = "";
      this.factoryData.telephone = "";
    },
    // 确认添加
    confirmAdd(required) {
      this.handleSubmit(required);
      let params = this.factoryData;
      console.log(params);
      if (this.isNo === false) {
        this.$API.addFactoryManagement(params).then(res => {
          console.log('this is res')
          console.log(res);
          if (res.code === 0) {
            this.factoryAddStatus = false;
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

    //获取加工厂信息详情
    handleEdit(index, row) {
      /* console.log(row.id); */
      this.factoryEditStatus = true;
      this.$API.detailsFactoryManagement(row.id).then(res => {
        if (res.code === 0) {
          /*  console.log(res.data) */
          this.factoryData = res.data;
        }
      });
    },

    //加工厂信息编辑 - 确认编辑
    confirmEdit(required) {
      /* console.log("confirm edit");  */
      this.handleSubmit(required);
      this.isdisabled = false;
      let params = {
        id: this.factoryData.id,
        factoryName: this.factoryData.factoryName,
        factoryCode: this.factoryData.factoryCode,
        chargePerson: this.factoryData.chargePerson,
        telephone: this.factoryData.telephone
      };
      /* console.log(params) */
      if (this.isNo === false) {
        this.$API.editFactoryManagement(params).then(res => {
          /* console.log('edit---') */
          /* console.log(res) */
          if (res.code === 0) {
            this.$Message.success("提交成功");
            this.factoryEditStatus = false;
            this.getList();
          } else if (res.code == -1) {
            this.$Message.info("加工厂名称已存在!");
          }
        });
      }
    },

    // 取消添加
    cancelAdd(name) {
      /*  console.log(this.$refs[name]) */
      this.factoryAddStatus = false;
      /* console.log(this.factoryAddStatus) */
      this.$refs[name].resetFields();
    },
    // 取消编辑
    cancelEdit(name) {
      this.factoryEditStatus = false;
      this.$refs[name].resetFields();
    },

    //加工厂信息删除
    handleDelete(index, row) {
      //删除对应id的内容
      if (confirm("确实要删除吗？")) {
        this.$API.deleteFactoryManagement(row.id).then(res => {
          if (res.code === undefined || res.code === 0) {
            this.$Message.success("删除成功!");
            this.getList();
          } else {
            this.$Message.error("删除失败!");
          }
        })
      } else {
        this.$Message.info("已取消删除!");
      }
    },

    // 弹窗校验
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          /* this.$Message.success("提交成功"); */
          this.isNo = false;
      /*     this.isdisabled = true; */
          this.factoryAddStatus = false;
          this.factoryEditStatus = false;
          this.getList();
        } else {
          this.$Message.error("请填写信息");
          this.isNo = true;
          return this.isNo;
        }
      });
    },
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
        .factoryMenagementList(params)
        .then(res => {
          this.loading = true;
          if (res.code === 0) {
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
