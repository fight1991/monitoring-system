
export default {
  data () {
    return {
      reportTableHead: [
        {
          label: 'Today Yield',
          prop: 'eToday',
          checked: true,
          width: 100,
          slotName: 'eToday'
        }, {
          label: 'Total Yield',
          prop: 'eTotal',
          checked: true,
          width: 100,
          slotName: 'eTotal'
        }, {
          label: 'Pv1 Voltage',
          prop: 'pv1Voltage',
          checked: true,
          width: 110,
          slotName: 'pv1Voltage'
        }, {
          label: 'Pv2 Voltage',
          prop: 'pv2Voltage',
          checked: true,
          width: 110,
          slotName: 'pv2Voltage'
        }, {
          label: 'Pv1 Current',
          prop: 'pv1Current',
          checked: true,
          width: 100,
          slotName: 'pv1Current'
        }, {
          label: 'Pv2 Current',
          prop: 'pv2Current',
          checked: true,
          width: 100,
          slotName: 'pv2Current'
        }, {
          label: 'Feed in Power',
          prop: 'feedinPower',
          checked: true,
          width: 120,
          slotName: 'feedinPower'
        }, {
          label: 'OutputPower',
          prop: 'outputPower',
          checked: true,
          width: 110,
          slotName: 'outputPower'
        }, {
          label: 'Gird Voltage R',
          prop: 'gridVoltageR',
          checked: true,
          width: 130,
          slotName: 'gridVoltageR'
        }, {
          label: 'Grid Current R',
          prop: 'gridCurrentR',
          checked: true,
          width: 130,
          slotName: 'gridCurrentR'
        }, {
          label: 'Grid Frequency R',
          prop: 'gridFrequencyR',
          checked: true,
          width: 140,
          slotName: 'gridFrequencyR'
        }, {
          label: 'Updatetime',
          prop: 'time',
          checked: true,
          width: 220
        }, {
          label: 'Invstatus',
          prop: 'masterState',
          checked: true,
          fixed: 'right',
          width: 100
        }
      ]
    }
  }
}
