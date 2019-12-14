<template>
  <div class="code-cooperation">
    <Row :gutter="8" class="search-form">
      <Col>
        <Input type="text" v-model="select.cooperativeName" clearable  placeholder="合作商名称" style="width: 150px" @on-enter="getList('select')"></Input>
        <Input type="text" v-model="select.chargePerson"  clearable  placeholder="负责人" style="width: 150px" @on-enter="getList('select')"></Input>
        <Button type="primary" @click="getList('select')">查询</Button>
        <Button type="primary" style="float:right" @click="addBusiness">新增合作商</Button>
      </Col>
    </Row>
    <Row style="margin-top:5px">
      <Table border :columns="listData.partnerColumns" :data="listData.data1" size="small">
        <!-- 操作 -->
        <template slot-scope="{ row }" slot="action">
          <Tooltip placement="top" content="编辑" transfer>
              <Button type="primary" size="small" @click="partnerEidt(row.id)">
                  <Icon type="md-create" />
              </Button>
          </Tooltip>
          <Poptip confirm title="您确认删除这条内容吗？" transfer @on-ok="deleFordataList(row.id)">
              <Button size="small" >
                  <Icon type="md-trash" />
              </Button>
          </Poptip>
        </template>
      </Table>
    </Row>
    <div style="margin: 10px;overflow: hidden">
          <div class="pages-L">共 {{pageProps.count}} 条</div>
          <div style="float: right;">
            <Page size="small" :total="pageProps.count" :current="pageProps.pageCount" show-sizer show-elevator @on-change="changePage" @on-page-size-change="changePageSize"></Page>
          </div>
        </div>
    <!-- 新增合作商 model start -->
    <Modal
        v-model="cooperationModal"
        title="新增"
        @on-cancel="cancelCooperation()"
        >
         <Form ref="addData" :model="addData" :label-width="80">
          <FormItem label="合作商" prop="cooperativeName" :rules="{ required: true, message: '请填写合作商名称', trigger: 'blur' }">
            <Input  v-model="addData.cooperativeName" :value="addData.cooperativeName" placeholder="合作商名称" style="width:300px"></Input>
          </FormItem>
          <FormItem label="负责人" prop="chargePerson" :rules="{ required: true, message: '请填写负责人', trigger: 'blur' }" >
            <Input  v-model="addData.chargePerson" :value="addData.chargePerson" placeholder="负责人"  style="width:300px"></Input>
          </FormItem>
          <FormItem label="所在地址" prop="cooperativeAddress" :rules="{ required: true, message: '请填写所在地址', trigger: 'blur' }" >
            <Input v-model="addData.cooperativeAddress" :value="addData.cooperativeAddress" placeholder="所在地址"  style="width:300px"></Input>
          </FormItem>
        </Form>
        <div slot="footer">
            <Button type="primary"  :loading="modal_loading" @click="addCooperate()">确定</Button>
            <Button type="default"  :loading="modal_loading" @click="cancelCooperation()">取消</Button>
        </div>
    </Modal>
    <!-- 新增合作商 model end-->

  </div>
</template>
<script>
export default {
  data(){
    return {
      //列表分页属性
      pageProps:{
          page: 1,
          perPage: 10,
          count: 0,
          pageCount: 1,
      },
      select:{
        cooperativeName:'',
        chargePerson:''
      },
      //模态框增加合作商
      cooperationModal: false,
      modal_loading:false,
      delCooperate:false,
      //合作商数据
      listData:{
          partnerColumns: [
          {title: '合作商名称', key: 'cooperativeName',align: 'center'},
          {title: '所在地址',key: 'cooperativeAddress',align: 'center'},
          {title: '负责人',key: 'chargePerson',align: 'center'},
          {
            title: '收货数据',
            key: 'address',
            align: 'center',
            render: (h, params) => {
            return h('a', {
                on: {
                    click: () => {
                        this.$router.push({path: 'cooperation-date'});
                    }
                }
            }, '查看');
            }
          },
          {title: '操作',key: '',align: 'center',slot: 'action'}
        ],
        data1: []
      },
      addData:{
        id:''
      }
    }
  },
  methods:{
    //新增合作商
    addBusiness () {
      this.cooperationModal = true;
    },
    //编辑合作商
    partnerEidt (id) {
      this.cooperationModal = true;
      this.$API.CooperationListaDetails({id:id})
        .then( res =>{
          this.addData = res.data
        })
        this.addData.id = id
    },
    //获取合作商列表数据
    getList (name) {
      let params = this.select;
      params.page = this.pageProps.page;
      params.perPage = this.pageProps.perPage;
      params.cooperativeName = this.select.cooperativeName;
      params.chargePerson = this.select.chargePerson;
      this.$API.cooperationList(params)
        .then((res) => {
          this.pageProps.count = res.data.count;
          this.listData.data1 = res.data.data;
        })
    },
    //确认
    addCooperate () {
      let data = this.addData;
      data.cooperativeName = this.addData.cooperativeName;
      data.cooperativeAddress = this.addData.cooperativeAddress;
      data.chargePerson = this.addData.chargePerson;
      if (data.chargePerson == '' || data.cooperativeAddress == '' || data.chargePerson == '') {
        this.$Message.error('必填项不能为空!');
        return;
      }
      if(this.addData.id){
        data.id = this.addData.id;
        this.$API.addCooperationListEdit(data)
          .then( res =>{
            this.$Message.success('修改成功');
            this.cooperationModal = false;
            this.getList();
          })
      }else {
        this.$API.addCooperationList(data)
        .then( res => {
          if(res.code == -1){
            this.$Message.success(res.msg);
          }else {
            if (res.data){
              this.cooperationModal = false;
              this.$Message.success('添加成功');
              this.getList();
            }
          }
        })
      }
    },
    //取消新增
    cancelCooperation () {
      this.cooperationModal = false;
    },
     //删除合作商列表
    deleFordataList (id) {
      this.$API.deleteCooperationList({id:id})
        .then( res =>{
          this.$Message.success('删除成功');
          this.getList();
      })
    },
    changePage (e) {
      this.pageProps.page = e;
      this.getList();
    },
    changePageSize(e){
      this.pageProps.perPage = e;
      this.getList();
    }
  },
  mounted(){
    this.getList();
  }
}
</script>
<style lang="less">
    .cooper-title {
        color: rgb(150, 126, 126);
        font-size: 18px;
    }
    .search-form {
        background-color: #eee;
        margin-top: 10px;
        padding: 10px 10px;
        border-radius: 10px;
    }
</style>