
export default {
  data () {
    return {
      reportTableHead: [
        {
          label: 'Today Yield',
          prop: 'eToday',
          checked: true,
          width: 100
        }, {
          label: 'Total Yield',
          prop: 'eTotal',
          checked: true,
          width: 100
        }, {
          label: 'Pv1 Voltage',
          prop: 'gridVoltagT',
          checked: true,
          width: 110
        }, {
          label: 'Pv2 Voltage',
          prop: 'pv2Voltage',
          checked: true,
          width: 110
        }, {
          label: 'Pv1 Current',
          prop: 'pv1Current',
          checked: true,
          width: 100
        }, {
          label: 'Pv2 Current',
          prop: 'pv2Current',
          checked: true,
          width: 100
        }, {
          label: 'Feed in Power',
          prop: 'feedinPower',
          checked: true,
          width: 120
        }, {
          label: 'OutputPower',
          prop: 'outputPower',
          checked: true,
          width: 110
        }, {
          label: 'Gird Voltage R',
          prop: 'gridVoltageR',
          checked: true,
          width: 130
        }, {
          label: 'Grid Current R',
          prop: 'gridCurrentR',
          checked: true,
          width: 130
        }, {
          label: 'Grid Frequency R',
          prop: 'gridFrequencyR',
          checked: true,
          width: 140
        }, {
          label: 'Updatetime',
          prop: 'time',
          checked: true,
          width: 220
        }, {
          label: 'Invstatus',
          prop: 'masterState',
          checked: true,
          fixed: 'right'
        }
      ]
    }
  }
}
