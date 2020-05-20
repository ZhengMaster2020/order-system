<template>
  <div>
    <Card>
      <!--      Form-->
      <Form ref="searchForm" :model="searchForm" inline>
        <Row type="flex" justify="space-between">
          <Col>
            <FormItem prop="channelId">
              <Select clearable placeholder="请选择渠道" class="width-120" v-model="searchForm.channelId">
                <Option :value="1">是</Option>
                <Option :value="0">否</Option>
              </Select>
            </FormItem>
            <FormItem prop="shop">
              <Input placeholder="请输入店铺名称" class="width-120"  v-model="searchForm.shop"/>
            </FormItem>
            <FormItem prop="isShow">
              <Select clearable placeholder="是否显示" class="width-120" v-model="searchForm.isShow">
                <Option :value="1">是</Option>
                <Option :value="0">否</Option>
              </Select>
            </FormItem>
          </Col>
          <Col>
            <FormItem>
              <Button type="primary">搜索</Button>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem>
              <Button type="primary" @click="add('channel')">添加渠道</Button>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="add('store')">添加店铺</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>

      <!--      Tabs-->
      <Tabs v-model="currentTab">
        <TabPane label="渠道/店铺" name="channelAndStore">
          <!--          Table-->
          <Table border
                 :columns="channelAndStore.columns"
                 :data="channelAndStore.data"
                 :span-method="handleSpan"
                 @on-selection-change="selection => { selectionChange(selection) }">
            <template slot-scope="{ row, index }" slot="action">
              <a href="javascript:void(0)">修改渠道</a>
              <a href="javascript:void(0)">修改店铺</a>
<!--              <Tooltip placement="top" content="编辑" transfer>-->
<!--                <Button type="primary" size="small" >-->
<!--                  <Icon type="md-create" />-->
<!--                </Button>-->
<!--              </Tooltip>-->
<!--              <Poptip confirm title="您确认删除这条内容吗？" transfer>-->
<!--                <Button size="small">-->
<!--                  <Icon type="md-trash" />-->
<!--                </Button>-->
<!--              </Poptip>-->
            </template>
          </Table>
          <!--          Page-->
          <div class="foot-page">
            共{{channelAndStore.pageProps.total}}条
            <Page transfer
                  :total="channelAndStore.pageProps.total"
                  :page-size="channelAndStore.pageProps.perPage"
                  size="small"
                  show-elevator
                  show-sizer
                  @on-change="(page) => { changePage(page, 'channelAndStore') }"
                  @on-page-size-change="(size) => { changePageSize(size, 'channelAndStore') }" />
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
        searchForm: {
          channelId: '',
          shop: '',
          isShow: '',
        },
        channelAndStore: {
          columns: [
            { type: 'selection', width: 60, align: 'center' },
            { title: '渠道', key: 'channel', width: 90, align: 'center' },
            { title: '渠道排序', key: 'channelSort', align: 'center' },
            { title: '店铺名称', key: 'shop', align: 'center' },
            { title: '关键词', key: 'keywords', align: 'center' },
            { title: '店铺排序', key: 'shopSort', align: 'center' },
            { title: '是否显示', key: 'isShow', align: 'center' },
            { title: '创建时间', key: 'createdAt', align: 'center' },
            { title: '操作', key: 'action', align: 'center', slot: 'action', width: 140 },
          ],
          data: [],
          selection: [],
          pageProps: {
            page: 1,
            total: 0,
            perPage:  10
          },
        }
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      // Form 操作
      add(type) {
        // type === 'channel' && this.$router.push('/inquire-anomaly-tracking/channel-setting-operations')
        // type === 'store' && this.$router.push('/inquire-anomaly-tracking/store-setting-operations')
        this.$router.push(`/inquire-anomaly-tracking/${type}-setting-operations`)
        // if(this.channelAndStore.selection.length > 1) return this.$Message.error('一次只能操作一条数据')
      },
      // table 选项操作
      selectionChange(selection) {
        this.channelAndStore.selection = selection
      },

      handleSpan ({ row, columnIndex }) {
        // console.log(row, 'row')
        if (columnIndex === 1) {
          return {
            rowspan: row.mergeCol === 0 ? 0:row.mergeCol,
            colspan: row.mergeCol === 0 ? 0:1
          };
        }
      },

      // 改变当前分页
      changePage (page, key) {
        this[key].page = page;
        // this.getList();
      },
      // 改变分页size
      changePageSize (pageSize, key) {
        this[key].perPage = pageSize;
        // this.getList();
      },

      getList() {
        let currentTab = this.currentTab
        let params = {}
        for (let key in this.searchForm) {
          !!this.searchForm[key] && (params[key] = this.searchForm[key])
        }
        params.page = this[currentTab].pageProps.page
        params.perPage = this[currentTab].pageProps.perPage

        this.$API.getChannelStorelist(params).then(res => {
          // console.log(res)
          if (res.code === 0) {
            let {count, list, page} = res.data

            list.forEach(items => {
              items.shopList.forEach((shop, index) => {
                shop.mergeCol =  index === 0 ? items.shopList.length : 0
                shop.channel = items.channel
                shop.channelSort = items.channelSort

                this[currentTab].data.push(shop)
              })
            })
            console.log(this[currentTab].data)

            this[currentTab].pageProps.page = page
            this[currentTab].pageProps.total = count
          }
        }).finally(() => {
          this.tableLoading = false
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