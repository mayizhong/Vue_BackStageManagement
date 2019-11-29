// 导入 Eachars 组件
import echarts from 'echarts'
import _ from 'lodash'

export default {
  data() {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  async mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))

    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) return this.$message.error('获取报表数据失败！')
    // 获取想要渲染的数据
    const dt = res.data
    // 把 服务器返回的数据，和 data 中的this.options 做一下合并，得到完整的 数据对象
    const dtOK = _.merge(dt, this.options)
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(dtOK)
  },
  methods: {}
}
