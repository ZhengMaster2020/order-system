<template>
  <div class="cooperation-date">
    <Row>
        <Col span="12">
          <Select style="width:100px">
            <Option v-for="i in 12" >{{i}}月</Option>
          </Select>
        </Col>
        <Col span="12">
          {{company}}
        </Col>
    </Row>
    <br>
    <Row>
        <Col span="24">
          <div id="businessChart">

          </div>
        </Col>
    </Row>
  </div>
</template>
<script>
// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts');
// 引入柱状图
require('echarts/lib/chart/bar');
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
export default {
  data (){
    return {
      company:'广州分局厂家',
      option:{
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            legend: {
                data:['销量']
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        }
    }
  },
  mounted() {
   this.echartsinit ()
  },
  methods: {
    echartsinit (){
      var myChart = echarts.init(document.getElementById('businessChart'));
      myChart.setOption(option);
    }
  }
}
</script>
<style lang="less">
  .cooperation-date {
    width: 100%;
    border:1px solid red;
    #businessChart {
      width: 80%;
      height:500px;
      border:1px solid red;
    }
  }
</style>