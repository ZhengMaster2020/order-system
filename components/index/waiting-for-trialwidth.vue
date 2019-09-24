<template>
  <Card :bordered="false">
    <p slot="title">
      待审待签
    </p>
    <ul class="waiting-for">
      <li>
        <a href="javascript:;">
          <div class="waiting-wrap">
            <Badge :count="3">
              <img src="https://oa.fandow.com/public/themes/default/images/rank/listDemand.png" alt="" />
            </Badge>
          </div>
          <p>需求申请初审需求申请初审</p>
        </a>
      </li>
      <li>
        <a href="javascript:;">
          <div class="waiting-wrap">
            <Badge :count="3">
              <img src="https://oa.fandow.com/public/themes/default/images/rank/listDemand.png" alt="" />
            </Badge>
          </div>
          <p>需求申请初审需求申请初审</p>
        </a>
      </li>
      <li>
        <a href="javascript:;">
          <div class="waiting-wrap">
            <Badge :count="3">
              <img src="https://oa.fandow.com/public/themes/default/images/rank/listDemand.png" alt="" />
            </Badge>
          </div>
          <p>需求申请初审需求申请初审</p>
        </a>
      </li>
      <li>
        <a href="javascript:;">
          <div class="waiting-wrap">
            <Badge :count="3">
              <img src="https://oa.fandow.com/public/themes/default/images/rank/listDemand.png" alt="" />
            </Badge>
          </div>
          <p>需求申请初审需求申请初审</p>
        </a>
      </li>
      <li>
        <a href="javascript:;">
          <div class="waiting-wrap">
            <Badge :count="3">
              <img src="https://oa.fandow.com/public/themes/default/images/rank/listDemand.png" alt="" />
            </Badge>
          </div>
          <p>需求申请初审需求申请初审</p>
        </a>
      </li>
      <li>
        <a href="javascript:;">
          <div class="waiting-wrap">
            <Badge :count="3">
              <img src="https://oa.fandow.com/public/themes/default/images/rank/listDemand.png" alt="" />
            </Badge>
          </div>
          <p>需求申请初审需求申请初审</p>
        </a>
      </li>
      <li>
        <a href="javascript:;">
          <div class="waiting-wrap">
            <Badge :count="3">
              <img src="https://oa.fandow.com/public/themes/default/images/rank/listDemand.png" alt="" />
            </Badge>
          </div>
          <p>需求申请初审需求申请初审</p>
        </a>
      </li>
      <li>
        <a href="javascript:;">
          <div class="waiting-wrap">
            <Badge :count="3">
              <img src="https://oa.fandow.com/public/themes/default/images/rank/listDemand.png" alt="" />
            </Badge>
          </div>
          <p>需求申请初审需求申请初审</p>
        </a>
      </li>
    </ul>
  </Card>
</template>

<script>
// import util from '@/libs/util.js'
export default {
  name: 'WaitingForTrialwidth',
  props: {},
  methods: {}
}
</script>

<style lang="less" scoped>
.waiting-for{
  padding-top: 10px;
  overflow: auto;
}
  .waiting-for li {
    padding: 0 4px;
    margin-top: 10px;
    margin-right: 12px;
    float: left;
    width: 94px;
    text-align: center;
  }
  .waiting-wrap{
    margin: 0 auto;
    width: 70px;
  }
  .waiting-wrap img{
    width: 100%
  }
  .waiting-for p {
      padding: 8px 0 10px;
      text-align: center;
      font-size: 12px;
      color: #686b6d;
    }
  .waiting-for .ivu-badge-count{
    top:-5px;
    right: 6px;
  }
</style>
<style>
  ul,li{
    list-style: none;
  }
  .waiting-for li{
    float: left;
  }
</style>
