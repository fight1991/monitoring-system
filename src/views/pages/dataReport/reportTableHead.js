
export default {
  data () {
    return {
      reportTableHead: [
        {
          label: 'Today Yield',
          prop: 'etoday',
          checked: true,
          width: 100,
          slotName: 'etoday'
        }, {
          label: 'Total Yield',
          prop: 'generation',
          checked: true,
          width: 100,
          slotName: 'generation'
        }, {
          label: 'Pv1 Voltage',
          prop: 'pv1Volt',
          checked: true,
          width: 110,
          slotName: 'pv1Volt'
        }, {
          label: 'Pv2 Voltage',
          prop: 'pv2Volt',
          checked: true,
          width: 110,
          slotName: 'pv2Volt'
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
          prop: 'generationPower',
          checked: true,
          width: 110,
          slotName: 'generationPower'
        }, {
          label: 'Gird Voltage R',
          prop: 'RVolt',
          checked: true,
          width: 130,
          slotName: 'RVolt'
        }, {
          label: 'Grid Current R',
          prop: 'RCurrent',
          checked: true,
          width: 130,
          slotName: 'RCurrent'
        }, {
          label: 'Grid Frequency R',
          prop: 'RFreq',
          checked: true,
          width: 140,
          slotName: 'RFreq'
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
