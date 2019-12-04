<template>
  <div class="code-management">
    <Row class="search-form" type="flex" justify="space-between">
        <Col :md="12">
          <Select v-model="month" style="width:120px">
            <Option v-for="item in monthList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
        <Col :md="12">
          <div style="font-size:15px">广州分局设</div>
        </Col>
    </Row>
    <Row class="margin-top-20">
      <Col span="24">
        <div id="myChart"></div>
      </Col>
    </Row>
  </div>  
</template>
<script>
// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts')
// 引入柱状图
require('echarts/lib/chart/line')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
// require('echarts/lib/component/title')
export default {
  data () {
    return {
      month: '2月',
      monthList: [],
      option: {
        tooltip : {
            trigger: 'axis',
            axisPointer: {
                label: {
                    backgroundColor: '#6a7985',
                    formatter: (params) => {
                        return this.month + params.value + '日'
                    }
                }
            }
        },
        legend: {
            data: ['收货量', '箱码'],
            align: 'left',
            left: 10
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                name: '(日)',
                data : []
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'收货量',
                type:'line',
                smooth: true, // 曲线
                areaStyle: {}, // 曲线下的阴影
                data:[200, 132, 101, 134, 90, 230, 210,120, 132, 101, 134, 90, 230, 210,120, 132, 101, 134, 90, 230, 210,120, 132, 101, 134, 90, 230, 210,213,123,324]
            },
            {
                name:'箱码',
                type:'line',
                data:[200, 132, 30, 134, 90, 230, 210,120, 132, 101, 134, 90, 230, 210,120, 132, 101, 134, 90, 230, 210,120, 132, 101, 134, 90, 230, 210,213,123,324]
            }
        ]
      }
    }
  },
  mounted() {
    this.getMonth();
    this.addXDate();
    this.echartsInit();
  },
  methods: {
    getMonth () {
      let i=0
      while (i<12)
      {
        i++
        this.monthList.push({
          value: `${i}月`,
          label: `${i}月`
        })
      }
    },
    addXDate() {
      let i=0
      while(i<32){
        this.option.xAxis[0].data.push(i)
        i++
        }
      },
    echartsInit () {
      // 找到容器
      let myChart = echarts.init(document.getElementById('myChart'))
      // 开始渲染
      myChart.setOption(this.option)
      // 图表自适应
      window.onresize = myChart.resize
    }
  }
}
</script>
<style lang="less">
.code-management {
  .count {
    padding: 20px 0px 20px 30px;
    border: 2px solid #eee;
    border-radius: 10px;
  }
  .ivu-form-item {
    display: inline-block;
    margin-bottom: 0px;
  }
  .search-form {
    background-color: #eee;
    margin-top: 10px;
    padding: 10px 10px;
  }
}
#myChart{
    width: 100%;
    height: 480px;
    margin-left: auto;
    margin-right: auto;
  }
</style>