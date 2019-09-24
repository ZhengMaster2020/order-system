<template>
  <Card :bordered="false">
    <p slot="title">
      考勤
    </p>
    <calendar></calendar>
    <div class="footer">
      <Icon type="ios-time-outline" />
      今日打卡
      <span v-text="time"></span>
      次
      <i class="fa fa-work">上</i>
      <b v-text="toWorkTime"></b>
      正常打卡
      <i class="fa fa-work">下</i>
      <b v-text="offWorkTime"></b>
      正常打卡
    </div>
  </Card>
</template>

<script>
import calendar from '../index/calendar.vue'
export default {
  name: 'CheckWorkAttendance',
  components: {
    calendar
  },
  props: {},
  data() {
    return {
      time: 1,
      toWorkTime: '08:25',
      offWorkTime: '17:31'
    }
  },
  methods: {}
}
</script>

<style lang="less">
.wh_container {
  .wh_content_all {
    background-color: #fff;
    .wh_top_changge {
      li {
        color: #000;
      }
      .wh_jiantou1 {
        border-top: 2px solid #000;
        border-left: 2px solid #000;
      }
      .wh_jiantou2 {
        border-top: 2px solid #000;
        border-right: 2px solid #000;
      }
    }
    .wh_content {
      .wh_content_item {
        color: #000;
        height: 30px;
        font-size: 12px;
        .wh_item_date {
          height: 20px;
        }
        .wh_item_date:hover {
          background: #eaeaea;
        }
        .wh_chose_day {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          color: #fff;
          background: #0f9aeb;
        }
        .wh_isToday {
          background: #fff;
        }
        .wh_chose_day:hover, .wh_isToday:hover {
          background: #0f9aeb;
        }
        .wh_other_dayhide {
          color: #bfbfbf;
        }
      }
    }
  }
}
.footer {
  padding: 20px 15px 0;
  font-size: 12px;
  i {
    font-size: 14px;
    color: #51ace7;
  }
  .fa-work {
    background: #b2b2b2;
    border-radius: 50%;
    font-size: 12px;
    color: #d2d2d2;
    padding: 2px;
    font-style: normal;
  }
}
</style>
