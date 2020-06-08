export default {
  data () {
    return {
      normalData: { // 今日异常统计
        title: {
          text: 0,
          textAlign: 'center',
          textStyle: {
            color: '#666'
          },
          left: '35%',
          top: 'center'
        },
        color: ['#F96867', '#FDC70D'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: '0px',
          top: 'center',
          data: ['Alarm', 'Fault'],
          formatter: function (name) {
            return name
          }
        },
        series: [
          {
            name: 'abnormal',
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['35%', '50%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'inside',
                formatter: '{c}'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: 0, name: 'Alarm' },
              { value: 0, name: 'Fault' }
            ]
          }
        ]
      }
    }
  }
}
