<template>
  <div>
    <Card>
     <Row slot="title">
      <Row type="flex" justify="space-between">
        <Col>
          <Select clearable filterable placeholder="请选择渠道" class="width-120" v-model="searchForm.channelId">
            <Option v-for="channel in channelList" :value="channel.id" :key="channel.id">{{channel.channel}}
            </Option>
          </Select>
          <Input clearable placeholder="请输入店铺名称" class="width-120" v-model="searchForm.shop"/>
          <Select clearable placeholder="是否显示" class="width-120" v-model="searchForm.isShow">
            <Option value="yes">是</Option>
            <Option value="no">否</Option>
          </Select>
        </Col>
        <Col>
          <Button type="primary" @click="getList('search')">搜索</Button>
        </Col>
      </Row>
      <Row class="margin-top-10">
        <Col>
          <Button type="primary" @click="linkTo('channel')">添加渠道</Button>
          <Button type="primary" @click="linkTo('store')">添加店铺</Button>
        </Col>
      </Row>
     </Row>
      <!--      Tabs-->
      <Tabs v-model="currentTab">
        <TabPane label="渠道/店铺" name="channelAndStore">
          <!--          Table-->
          <Table border
                 ref="table"
                 :columns="channelAndStore.columns"
                 :data="channelAndStore.data"
                 :loading="tableLoading"
                 :span-method="handleSpan">
            <template slot-scope="{ row, index }" slot="action">
              <a href="javascript:void(0)" @click="linkTo('channel', row)">修改渠道</a>
              <a href="javascript:void(0)" @click="linkTo('store', row)" v-if="row.shopId != undefined">修改店铺</a>
            </template>
          </Table>
          <!--          Page-->
          <div class="foot-page">
            共{{channelAndStore.pageProps.total}}条
            <Page transfer
                  :current="channelAndStore.pageProps.page"
                  :total="channelAndStore.pageProps.total"
                  :page-size="channelAndStore.pageProps.perPage"
                  size="small"
                  show-elevator
                  show-sizer
                  @on-change="(page) => { changePage(page, 'channelAndStore') }"
                  @on-page-size-change="(size) => { changePageSize(size, 'channelAndStore') }"/>
          </div>
        </TabPane>
      </Tabs>
    </Card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        currentTab: 'channelAndStore',
        tableLoading: false,
        searchForm: {
          channelId: '',
          shop: '',
          isShow: '',
        },
        channelList: [],
        channelAndStore: {
          columns: [
            {title: '渠道', key: 'channel', width: 100, align: 'center'},
            {title: '渠道排序', key: 'channelSort', width: 100, align: 'center'},
            {title: '店铺名称', key: 'shop', align: 'center'},
            {title: '关键词', key: 'keywords', align: 'center'},
            {title: '店铺排序', key: 'shopSort', align: 'center'},
            {
              title: '是否显示', key: 'isShow', align: 'center',
              render: (h, {row}) => h('span', {}, row.isShow === 'yes' ? '是' : '否')
            },
            {
              title: '创建时间', key: 'createdAt', align: 'center', width: 170,
              render: (h, {row}) => h('span', {}, this.$format(row.createdAt, 'yyyy-MM-dd hh:mm:ss'))
            },
            {title: '操作', key: 'action', align: 'center', slot: 'action', width: 160},
          ],
          data: [],
          pageProps: {
            page: 1,
            total: 0,
            perPage: 10
          },
        }
      }
    },
    mounted() {
      this.getList()
      this.getChannelLists()
    },
    methods: {
      // Form 操作
      linkTo(type, row) {

        let query = {}
        if (row) { // table
          let {channelId, shopId} = row
          type === 'channel' && (query.id = channelId)
          type === 'store' && (query = {channelId, shopId})
        }

        this.$router.push({
          path: `/inquire-anomaly-tracking/${type}-setting-operations`,
          query
        })
      },

      handleSpan({row, columnIndex}) {
        // console.log(row, 'row')
        if (columnIndex === 0) {
          return {
            rowspan: row.mergeCol === 0 ? 0 : row.mergeCol,
            colspan: row.mergeCol === 0 ? 0 : 1
          };
        }
        if (columnIndex === 1) {
          return {
            rowspan: row.mergeCol === 0 ? 0 : row.mergeCol,
            colspan: row.mergeCol === 0 ? 0 : 1
          };
        }
      },

      // 改变当前分页
      changePage(page, key) {
        this[key].pageProps.page = page;
        this.getList();
      },
      // 改变分页size
      changePageSize(pageSize, key) {
        this[key].pageProps.perPage = pageSize;
        this.getList();
      },

      getList(type) {
        if (type === 'search') {
          this.pageProps.page = 1;
          this.pageProps.perPage = 10;
        }
        let currentTab = this.currentTab
        let params = {}
        for (let key in this.searchForm) {
          !!this.searchForm[key] && (params[key] = this.searchForm[key])
        }
        params.page = this[currentTab].pageProps.page
        params.perPage = this[currentTab].pageProps.perPage
        this.tableLoading = true

        this.$API.getChannelStorelist(params).then(res => {
          if (res.code === 0) {
            let {count, list, page} = res.data
            let newList = []

            list.forEach(items => {
              items.shopList = items.shopList ? items.shopList : [{
                mergeCol: 0,
                channel: items.channel,
                channelSort: items.channelSort,
                channelId: items.channelId
              }]
              items.shopList.forEach((shop, index) => {
                shop.mergeCol = index === 0 ? items.shopList.length : 0
                shop.channel = items.channel
                shop.channelSort = items.channelSort
                shop.channelId = items.channelId

                newList.push(shop)

              })
            })
            // console.log(this[currentTab].data)
            this[currentTab].data = newList

            this[currentTab].pageProps.page = page
            this[currentTab].pageProps.total = count
          }
        }).finally(() => {
          this.tableLoading = false
        })
      },

      getChannelLists() {
        this.$API.getChannelLists({}).then(res => {
          if (res.code === 0) {
            this.channelList = res.data
          }
        })
      }
    }
  }
</script>

<style scoped>
  .width-120 {
    width: 120px;
  }

  .foot-page {
    padding: 10px;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

</style>