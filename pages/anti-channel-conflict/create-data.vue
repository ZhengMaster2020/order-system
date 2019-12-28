
<style scoped>
h2 {
  text-align: center;
  padding: 30px;
  font-size: 18px;
}
#chart_example {
  width: 100%;
  height: 500px;
  border: 1px solid #fff;
  margin: 0 auto;
}
</style>
<template>
  <div>
    <h2> 该页面暂时没有接口</h2>
    <div id="chart_example"></div>
  </div>
</template>
 
<script>
import echarts from "echarts";
export default {
  data() {
    return {};
  },
  mounted() {
    let this_ = this;
    var colors = ['#5793f3', '#d14a61', '#675bba'];
    let myChart = echarts.init(document.getElementById("chart_example"));
    let option = {
      color: colors,

      tooltip: {
        trigger: "none",
        axisPointer: {
          type: "cross"
        }
      },
      legend: {
        data: ["2015 降水量", "2016 降水量"]
      },
      grid: {
        top: 70,
        bottom: 50
      },
      xAxis: [
        {
          type: "category",
          axisTick: {
            alignWithLabel: true
          },
          axisLine: {
            onZero: false,
            lineStyle: {
              color: colors[1]
            }
          },
          axisPointer: {
            label: {
              formatter: function(params) {
                return (
                  "降水量  " +
                  params.value +
                  (params.seriesData.length
                    ? "：" + params.seriesData[0].data
                    : "")
                );
              }
            }
          },
          data: [
            "2016-1",
            "2016-2",
            "2016-3",
            "2016-4",
            "2016-5",
            "2016-6",
            "2016-7",
            "2016-8",
            "2016-9",
            "2016-10",
            "2016-11",
            "2016-12"
          ]
        },
        {
          type: "category",
          axisTick: {
            alignWithLabel: true
          },
          axisLine: {
            onZero: false,
            lineStyle: {
              color: colors[0]
            }
          },
          axisPointer: {
            label: {
              formatter: function(params) {
                return (
                  "降水量  " +
                  params.value +
                  (params.seriesData.length
                    ? "：" + params.seriesData[0].data
                    : "")
                );
              }
            }
          },
          data: [
            "2015-1",
            "2015-2",
            "2015-3",
            "2015-4",
            "2015-5",
            "2015-6",
            "2015-7",
            "2015-8",
            "2015-9",
            "2015-10",
            "2015-11",
            "2015-12"
          ]
        }
      ],
      yAxis: [
        {
          type: "value"
        }
      ],
      series: [
        {
          name: "2015 降水量",
          type: "line",
          xAxisIndex: 1,
          smooth: true,
          data: [
            2.6,
            5.9,
            9.0,
            26.4,
            28.7,
            70.7,
            175.6,
            182.2,
            48.7,
            18.8,
            6.0,
            2.3
          ]
        },
        {
          name: "2016 降水量",
          type: "line",
          smooth: true,
          data: [
            3.9,
            5.9,
            11.1,
            18.7,
            48.3,
            69.2,
            231.6,
            46.6,
            55.4,
            18.4,
            10.3,
            0.7
          ]
        }
      ]
    };

    myChart.setOption(option);

    //建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
    window.addEventListener("resize", function() {
      myChart.resize();
    });
  },
  methods: {},
  watch: {},
  created() {}
};
</script>
