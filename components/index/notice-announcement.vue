<template>
  <Card :bordered="false">
    <div>
      <p class="title">
        最新咨询
      </p>
      <Carousel v-model="loopIndex" autoplay loop>
        <CarouselItem>
          <div class="demo-carousel">
            <div @click="openDetail">
              <img src="../../assets/images/1.jpg" alt="" />
              <p>优秀员工</p>
            </div>
            <div class="acount">
              <span>10条评论</span>
              <span>100 阅读数</span>
            </div>
          </div>
        </CarouselItem>
        <CarouselItem>
          <div class="demo-carousel">
            <div @click="openDetail">
              <img src="../../assets/images/2.jpg" alt="" />
              <p>优秀员工</p>
            </div>
            <div class="acount">
              <span>10条评论</span>
              <span>100 阅读数</span>
            </div>
          </div>
        </CarouselItem>
        <CarouselItem>
          <div class="demo-carousel">
            <div @click="openDetail">
              <img src="../../assets/images/3.jpg" alt="" />
              <p>优秀员工</p>
            </div>
            <div class="acount">
              <span>10条评论</span>
              <span>100 阅读数</span>
            </div>
          </div>
        </CarouselItem>
        <CarouselItem>
          <div class="demo-carousel">
            <div @click="openDetail">
              <img src="../../assets/images/4.jpg" alt="" />
              <p>优秀员工</p>
            </div>
            <div class="acount">
              <span>10条评论</span>
              <span>100 阅读数</span>
            </div>
          </div>
        </CarouselItem>
      </Carousel>
    </div>
    <p class="title">
      更多文章 》
    </p>
    <div class="discussion">
      <div class="list">
        <span>1</span>
        <a href="">WIS获天猫金妆奖两项荣誉，专注只为更好</a>
      </div>
    </div>
    <p class="title">
      创新方案
    </p>
    <div class="discussion-msg">
      <span>公司的高速发展需要岛民提出创新性的解决方案，并会对优秀方案予以专利公证和表彰奖励.</span>
      <a href="">详情</a>
    </div>
    <a href="">
      <img src="../../assets/images/discussion_button.png" alt="" />
    </a>
  </Card>
</template>

<script>
// import util from '@/libs/util.js'
export default {
  name: 'NoticeAnnouncement',
  data() {
    return {
      loopIndex: 0
    }
  },
  methods: {
    openDetail() {
      alert('跳转到咨询详情页')
    }
  }
}

</script>

<style lang="less" scoped>
.ivu-card {
  background: #ebebed;
}
.title {
  color: #333;
  font-size: 13px;
  font-weight: normal;
  padding-bottom: 15px;
}
.ivu-carousel {
  width: 190px;
  height: 240px;
  background-color: #fff;
  position: relative;
  margin-bottom: 45px;
  .ivu-carousel-list {
    height: 240px;
  }
  .ivu-carousel-track {
    height: 240px;
  }
  .ivu-carousel-item {
    width: 190px !important;
    height: 240px !important;
    padding-bottom: 50px;
    .demo-carousel {
      cursor: pointer;
      height: 100%;
    }
    img {
      width: 100%;
      height: 100%;
    }
    p {
      position: absolute;
      bottom: 0px;
      width: 100%;
      line-height: 18px;
      font-size: 12px;
      word-wrap: break-word;
      max-height: 36px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      padding: 5px;
      position: absolute;
      bottom: 50px;
      background: rgba(0, 0, 0, .3);
      color: #fff;
      font-weight: normal;
    }
    .acount {
      position: absolute;
      bottom: 20px;
      color: #9a9a9a;
      padding-left: 5px;
    }
  }
}
.discussion {
  margin-bottom: 40px;
  .list {
    span {
      width: 20px;
      display: inline-block;
      text-align: center;
      background-color: #1ab394;
      color: #fff;
      vertical-align: middle;
    }
    a {
      text-decoration: none;
      color: #636466;
      margin-left: 2%;
      content: "...";
      font-size: 13px;
      vertical-align: middle;
      width: 80% !important;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: inline-block !important;
      overflow: hidden;
    }
  }
}
.discussion-msg {
  color: #b2b2b2;
  margin-bottom: 15px;
  line-height: 18px;
  letter-spacing: 0.5px;
}
</style>
