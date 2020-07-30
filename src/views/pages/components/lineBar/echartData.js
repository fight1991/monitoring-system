import { formatDate } from '@/util'
export default {
  data () {
    return {
      echartData: {
        power: { // 折线图表
          legend: {
            type: 'plain',
            data: ['generationPower', 'feedinPower', 'loadsPower'],
            bottom: 10,
            formatter: name => {
              return this.$t('chart.' + name)
            }
          },
          tooltip: {
            trigger: 'axis',
            formatter: params => {
              let headLabel = ''
              let res = ''
              params.forEach(v => {
                !headLabel && (headLabel = formatDate(v.axisValue, 'HH:mm:ss MM-dd'))
                res += '</br>' + v.marker + this.$t('chart.' + v.seriesName) + ' : ' + v.data[1] + 'kW'
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
                return formatDate(value, 'HH:mm:ss') + '\n' + formatDate(value, 'MM-dd')
              }
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
          yAxis: {
            name: 'kW',
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
            //   name: 'generationPower',
            //   data: [[1585190129697, 820], [1585190139697, 932], [1585190149697, 901], [1585190159697, 934], [1585190169697, 1290], [1585190179697, 1330], [1585190189697, 1320]],
            //   type: 'line',
            //   smooth: true
            // }
          ]
        },
        elec: { // 柱状图
          legend: {
            bottom: 10,
            data: [],
            formatter: name => {
              return this.$t('chart.' + name)
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: params => {
              let { seriesName, name, value, marker } = params
              return this.$t('chart.' + seriesName) + '<br/>' + marker + name + ' : ' + this.toFixed(value)
            }
          },
          // dataset: {
          //   dimensions: ['axis', 'generation', 'feed-in', 'loads', 'grid consumption'],
          //   source: [
          //     { axis: '01', 'generation': 43.3, 'feed-in': 85.8, 'loads': 93.7, 'grid consumption': 93.7 },
          //     { axis: '02', 'generation': 83.1, 'feed-in': 73.4, 'loads': 55.1, 'grid consumption': 93.7 },
          //     { axis: '03', 'generation': 86.4, 'feed-in': 65.2, 'loads': 82.5, 'grid consumption': 93.7 },
          //     { axis: '04', 'generation': 72.4, 'feed-in': 53.9, 'loads': 39.1, 'grid consumption': 93.7 },
          //     { axis: '05', 'generation': 73.4, 'feed-in': 53.9, 'loads': 39.1, 'grid consumption': 93.7 },
          //     { axis: '06', 'generation': 72.4, 'feed-in': 53.9, 'loads': 39.1, 'grid consumption': 93.7 },
          //     { axis: '07', 'generation': 76.4, 'feed-in': 53.9, 'loads': 39.1, 'grid consumption': 93.7 },
          //     { axis: '08', 'generation': 72.4, 'feed-in': 53.9, 'loads': 39.1, 'grid consumption': 93.7 }
          //   ]
          // },
          xAxis: {
            type: 'category',
            data: []
          },
          grid: [{
            height: '55%'
          }],
          dataZoom: [{
            type: 'slider',
            show: true,
            xAxisIndex: [0],
            top: '80%',
            start: 0,
            end: 100
          }],
          yAxis: {
            name: 'kW·h'
          },
          // Declare several bar series, each will be mapped
          // to a column of dataset.source by default.
          series: [
            // {
            //   type: 'bar',
            //   name: 'feed-in',
            //   data: []
            // }
          ]
        }
      }
    }
  }
}
