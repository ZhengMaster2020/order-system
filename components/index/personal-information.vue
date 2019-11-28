<template>
  <div>
    <Card :bordered="false">
      <p slot="title">
        个人信息
      </p>
      <Row class="personal">
        <Col class="margin-space1 user-info">
        <div class="user-messages">
          <div class="user-portrait">
            <a href="javascript:;">
              <div class="img-replace">理员</div>
            </a>
          </div>
          <div class="user-detail">
            <div class="user-account">
              <span class="user-jobNum">FD-0001</span>
              <span class="user-jobNum">超级管理员</span>
              您好！
            </div>
            <div class="user-position">
              渠道运营部-开发中心_web前端开发
            </div>
            <div class="user-time">
              <span>在职时长1年1月26天</span>
            </div>
          </div>
        </div>
        </Col>
        <Col class="margin-space2">
        <div class="personal-ratings">
          <span>2019年个人评级</span>
          <div class="rating-criteria" @click="openStandard">
            <Icon type="ios-help-circle-outline" size="20" />
            评级标准
          </div>
        </div>
        <div class="ratings-show">
          <table class="level-table">
            <tbody>
              <tr>
                <td>Q1</td>
                <td>Q2</td>
                <td>Q3</td>
                <td>双11</td>
                <td>Q4</td>
              </tr>
              <tr>
                <td>
                  <img src="https://oa.fandow.com/public/themes/default/images/evaluation_C.png" />
                </td>
                <td>
                  <img src="https://oa.fandow.com/public/themes/default/images/evaluation_C.png" />
                </td>
                <td>无</td>
                <td>无</td>
                <td>无</td>
              </tr>
            </tbody>
          </table>
        </div>
        </Col>
        <Col class="margin-space3">
        <div class="userful-show">
          <ul class="userful-table">
            <li>
              <img src="https://oa.fandow.com/public/themes/default/images/rank/f_bi.png" width="24" />
              <span>可用F币:</span>
              <span class="usable-number">100</span>
              <a id="fbNum" style="display: none;" href="/FbDetail/ListFbDetail.html" target="navTab" rel="FbDetail_List">F币明细</a>
            </li>
            <li>
              <img src="https://oa.fandow.com/public/themes/default/images/rank/f_can.png" width="24" />
              <span>可用F餐票:</span>
              <span class="usable-number">5</span>
              <a id="meal" href="/DingMealTicket/ListDingMealTicket.html" target="navTab" style="display: none;" rel="DingMealTicket_List">个人餐票</a>
            </li>
            <li>
              <img src="https://oa.fandow.com/public/themes/default/images/rank/f_pin.png" width="24" />
              <span>产品申请:</span>
              <span class="usable-number">15</span>
              <a href="/ProductApply/ListProduct.html" target="navTab" style="display: none;" rel="ProductApply_List">申请列表</a>
            </li>
          </ul>
        </div>
        </Col>
      </Row>
    </Card>

    <Modal v-model="modal1" title="员工工作评定标准" width="1000" ok-text="确定" cancel-text="">
      <h1 style="text-align: center;">
        员工工作评定标准
      </h1>
      <h4>一、目的</h4>
      <p>评级制度是公司衡量员工价值观与贡献的重要举措，我们通过制定有效、客观的考核标准，对员工进行全面的评定，以此进行人才筛选与表彰优秀员工，也为员工的成长提供依据，促进公司的人才梯队建设。</p>
      <br />
      <h4>二、季度评定</h4>
      <p>1.评定周期分为：Q1（1-3月）、Q2（4-6月）、Q3（7-9月）、Q4（10-12月）</p>
      <p>2.评定对象为以下两种：</p>
      <p>①非管培生岗位：整个评定周期内已转正的正式员工：</p>
      <p>②管培生岗位：评定周期开始时入职满3个月；</p>
      <p>以下情况不参与工作评定：提成工作制和计件制员工、已提出离职申请员工。</p>
      <br />
      <h4>三、双十一评定</h4>
      <p>1.评定周期：一般在8月-11月双11的备战期与活动期间；</p>
      <p>2.评定对象：</p>
      <p>①评定周期内在职员工；</p>
      <p>②以下情况不参与工作评定：提成工作制和计件制的员工，以及已提出离职申请员工。</p>
      <br />
      <h4>四、评定等级<span style="font-weight: 100;">（评级从高到低依次为S、A、B、C、D五级）</span></h4>
      <p>1.评级为S级的员工可参与优秀岛民评选和获得S级岛民证书；</p>
      <p>2.评级为D级的员工将会采取：继续留用、安排转岗或辞退方式处理。</p>
      <br />
      <h4>五、评定细则</h4>
      <p>1.要求：进行评定前，各部门经理需对每一位参与评定的员工进行面谈；</p>
      <p>2.基准：同一个等级进行对比评定，区分经理级、主管级、普通员工级；</p>
      <p>部分岗位评定规则如下：</p>
      <p>①见习主管按照员工级别评级；</p>
      <p>②新晋主管在评级周期晋升，满3个月按主管级别评定，不足3个月按员工级别评定；</p>
      <p>③转岗员工由调入部门评定；</p>
      <br />
      <h4>六、考核维度<span style="font-weight: 100;">（可靠程度评价、投入程度评价、工作能力及出勤情况）</span></h4>
      <p>1.可靠程度，认可并践行公司价值观，稳定性强，且主动承担责任，有敬业心，事事有结果，事事有汇报。</p>
      <p>2.投入程度：积极主动解决问题，愿意花时间全身心投入工作，有危机感，进步较快。</p>
      <p>3.工作能力：优秀完成任务目标，专业技能扎实，熟悉工作的核心内容；管理者考核团队目标完成情况，人才培养情况。</p>
      <br />
      <p>备注：以上标准仅供参考，未尽事宜，以公司人事部实际制度落实为准。</p>
    </Modal>
  </div>
</template>

<script>
// import util from '@/libs/util.js'
export default {
  name: 'PersonalInformation',
  props: {},
  data() {
    return {
      modal1: false
    }
  },
  methods: {
    openStandard() {
      this.modal1 = true
    }
  }
}
</script>

<style lang="less" scoped>
  .personal {
    padding: 30px 0 20px 0;
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;
  }

  .margin-space1{
     flex: 0 0 30%;
     min-width: 372px;
     margin: 10px auto;
     box-sizing: border-box;

    .user-messages{
      width: 80%;
      margin: 0 auto;
      .user-portrait {
        width: 90px;
        height: 90px;
        border-radius: 50%;
        overflow: hidden;
        border: 1px solid #f3f3f4;
        float: left;
        margin-right: 10px;

        a {
          width: 78px;
          height: 78px;
          line-height: 78px;
          color: #fff;
          border: 6px solid #fff;
          display: block;
          overflow: hidden;
          text-align: center;
          font-size: 20px;
          border-radius: 50%;
          letter-spacing: 2px;
          box-sizing: content-box;
          background: #0f9aeb;
        }
      }

      .user-detail {
        display: flex;
        flex-direction: column;
        justify-content: center;
        // float: right;
        float: left;
        margin-top: 6px;
        font-size: 12px;

        .user-account {
          color: #282727;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 6px;
        }

        .user-position {
          font-size: 12px;
          color: #797979;
          margin-bottom: 15px;
        }

        .user-time {
          display: flex;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          padding-right: 0.25rem;
          float: left;

          span {
            background-color: #6fc2f3;
            color: #fff;
            padding: 1px 11px;
            border-radius: 4px;
          }
        }
      }

    }
  }

  .margin-space2{
    flex: 0 0 24%;
    margin: 10px auto;
    box-sizing: border-box;

    .personal-ratings {
      width: 80%;
      margin: 0 auto;
      min-width: 188px;

      .rating-criteria {
        display: inline-block;
        color: #b5b5b5;
        float: right;
      }
    }
    .ratings-show {
      .level-table {
        width: 80%;
        margin: 0 auto;
        min-width: 188px;

        th,
        td {
          width: 60px;
          color: #686b6d;
          height: 30px;
          text-align: center;
          background: #f7f7f7;
          // border: 1px solid #fff;
        }
      }
    }
  }

  .margin-space3{
     flex: 0 0 20%;
     margin: 10px auto;
     box-sizing: border-box;

    .userful-show {
      width: 200px;
      padding-top: 7px;
      margin: 0 auto;

      .userful-table {
        border-top: 1px solid #f8f8f8;
        box-sizing: border-box;
        width: 100%;
        list-style:none;

        li{
          border-bottom: 1px solid #f8f8f8;
          padding: 0 0 4px 20px;
          line-height: 26px;
          height: 24px;
          span{
            margin-left: 20px;
            color: #b2b2b2;
            vertical-align: top;
          }
          .usable-number{
            color: #5eb1ef;
          }
        }
      }
    }
  }

  .ivu-modal-body{
    line-height: 2;
  }

  @media only screen and (min-width: 1200px){

    body{
      background: red;
    }

    .margin-space1{
      flex: 0 0 35%;
    }
    .margin-space1{
      flex: 0 0 30%;
    }
    .margin-space1{
      flex: 0 0 30%;
    }

  }
</style>
