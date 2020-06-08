export default {
  data () {
    return {
      lineChart: { // 折线图表
        legend: {
          type: 'plain',
          data: [],
          bottom: 0,
          formatter: name => {
            return this.$t('chart.' + name)
          }
        },
        tooltip: {
          trigger: 'axis',
          showContent: true,
          formatter: params => {
            let headLabel = ''
            let res = ''
            params.forEach(v => {
              !headLabel && (headLabel = v.axisValueLabel)
              res += '</br>' + v.marker + this.$t('chart.' + v.seriesName) + ' : ' + v.data[1]
            })
            return headLabel + res
          }
        },
        xAxis: {
          type: 'time',
          splitLine: {
            show: false
          }
        },
        yAxis: {
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
