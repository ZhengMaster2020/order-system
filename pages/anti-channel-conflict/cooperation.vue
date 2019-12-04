<template>
  <div class="code-cooperation">
    <Row :gutter="8" class="search-form">
      <Col>
        <Input type="text" placeholder="合作商管理" style="width: 150px"></Input>
        <Input type="text" placeholder="负责人" style="width: 150px"></Input>
        <Button type="primary">查询</Button>
        <Button type="primary" style="float:right" @click="addBusiness">新增合作商</Button>
      </Col>
    </Row>
    <Row style="margin-top:5px">
      <Table border :columns="columns1" :data="data1" size="small">
        <!-- 操作 -->
        <template slot-scope="{ row }" slot="action">
          <Tooltip placement="top" content="编辑" transfer>
              <Button type="primary" size="small" @click="partnerEidt">
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
    <!-- 新增合作商 model-->
    <Modal
        v-model="addmodal"
        title="新增">
         <Form ref="addruleBusiness" :label-width="80">
          <FormItem label="合作商"  :rules="{ required: true, message: '请填写合作商名称', trigger: 'blur' }">
            <Input  placeholder="合作商名称" style="width:300px"></Input>
          </FormItem>
          <FormItem label="负责人"  :rules="{ required: true, message: '请填写负责人', trigger: 'blur' }" >
            <Input  placeholder="负责人"  style="width:300px"></Input>
          </FormItem>
          <FormItem label="所在地址"  :rules="{ required: true, message: '请填写所在地址', trigger: 'blur' }" >
            <Input  placeholder="所在地址"  style="width:300px"></Input>
          </FormItem>
        </Form>
    </Modal>
  </div>
</template>
<script>
export default {
  data(){
    return {
      //模态框增加合作商
      addmodal: false,
      //合作商数据
      columns1: [
        {title: '合作商名称', key: 'name',align: 'center'},
        {title: '所在地址',key: 'age',align: 'center'},
        {title: '负责人',key: 'name',align: 'center'},
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
          }, params.row.address);
          }
        },
        {title: '操作',key: '',align: 'center',slot: 'action'}
      ],
      data1: [
        {name: 'John Brown',age: 18,address: '查看',date: '2016-10-03', align: 'center'},
        {name: 'Jim Green',age: 24,address: '查看',date: '2016-10-01', align: 'center'},
        {name: 'Joe Black',age: 30,address: '查看',date: '2016-10-02', align: 'center'},
        {name: 'Jon Snow',age: 26,address: '查看',date: '2016-10-04', align: 'center'}
      ]
    }
  },
  methods:{
    //新增合作商
    addBusiness () {
      this.addmodal = true;
    },
    //编辑合作商
    partnerEidt () {
      this.addmodal = true;
    },
    //删除合作商列表
    deleFordataList (id) {
      console.log(id);
    }
  },
  mounted(){

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