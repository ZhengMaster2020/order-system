<template>
  <div class="code-cooperation">
    <Row :gutter="8" class="search-form">
      <Col>
        <Input type="text" placeholder="合作商管理" style="width: 150px"></Input>
          <Input type="text" placeholder="负责人" style="width: 150px"></Input>
            <Button type="primary">查询</Button>
            <Button type="primary" style="float:right">新增合作商</Button>
      </Col>
    </Row>
    <Row style="margin-top:5px">
      <Table border :columns="columns1" :data="data1" size="small">
        <!-- 操作 -->
        <template slot-scope="{ row }" slot="action">
          <Tooltip placement="top" content="编辑" transfer>
              <Button type="primary" size="small">
                  <Icon type="md-create" />
              </Button>
          </Tooltip>
          <Poptip confirm title="您确认删除这条内容吗？" transfer>
              <Button size="small">
                  <Icon type="md-trash" />
              </Button>
          </Poptip>
        </template>
      </Table>
    </Row>
  </div>
</template>
<script>
export default {
  data(){
    return {
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
   
  }
}
</script>
<style lang="less">
    .cooper-title {
        color: #000;
        font-size: 18px;
    }
    .search-form {
        background-color: #eee;
        margin-top: 10px;
        padding: 10px 10px;
        border-radius: 10px;
    }
</style>