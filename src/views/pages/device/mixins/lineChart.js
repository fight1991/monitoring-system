import { formatDate } from '@/util'
export default {
  data () {
    return {
      lineChart: { // 折线图表
        legend: {
          type: 'plain',
          data: [],
          bottom: 10,
          formatter: name => {
            return this.$t('chart.' + name)
          }
        },
        grid: [{
          height: '50%'
        }],
        dataZoom: [{
          type: 'slider',
          show: true,
          xAxisIndex: [0],
          top: '80%',
          start: 0,
          end: 100
        }],
        tooltip: {
          trigger: 'axis',
          showContent: true,
          formatter: params => {
            let headLabel = ''
            let res = ''
            params.forEach(v => {
              !headLabel && (headLabel = formatDate(v.axisValue, 'HH:mm:ss MM-dd'))
              res += '</br>' + v.marker + this.$t('chart.' + v.seriesName) + ' : ' + v.data[1] + v.data[2]
            })
            return headLabel + res
          }
        },
        xAxis: {
          type: 'time',
          splitLine: {
            show: false
          },
          axisLabel: {
            formatter: function (value) {
              return formatDate(value, 'HH:mm:ss')
            }
          },
          maxInterval: 3600 * 1000 * 2
        },
        yAxis: {
          name: '',
          type: 'value',
          splitLine: {
            lineStyle: {
              color: ['#287FCA'],
              type: 'dotted',
              opacity: 0.4
            }
          }
        },
        series: [
          // {
          //   name: 'generating power',
          //   data: [[1585190129697, 820], [1585190139697, 932], [1585190149697, 901], [1585190159697, 934], [1585190169697, 1290], [1585190179697, 1330], [1585190189697, 1320]],
          //   type: 'line',
          //   smooth: true
          // }
        ]
      }
    }
  }
}
