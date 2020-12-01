
export default {
  data () {
    return {
      deviceTableHead: [
        {
          label: 'common.invertSn',
          prop: 'deviceSN',
          checked: true,
          width: 160
        },
        {
          label: 'common.datacolSN',
          prop: 'moduleSN',
          checked: true,
          width: 160
        },
        {
          label: 'firmware.devicetype',
          prop: 'deviceType',
          width: 100,
          checked: true
        },
        {
          label: 'common.gPower',
          prop: 'power',
          checked: true,
          slotName: 'power',
          width: 115
        },
        {
          label: 'plant.genTod',
          prop: 'generationToday',
          checked: true,
          width: 120,
          slotName: 'generationToday'
        },
        {
          label: 'plant.genTot',
          prop: 'generationTotal',
          slotName: 'generationTotal',
          checked: true,
          width: 115
        },
        {
          label: 'plant.gridtime',
          prop: 'feedinDate',
          checked: true,
          width: 220
        },
        {
          label: 'plant.equipSta',
          prop: 'status',
          width: 120,
          checked: true,
          slotName: 'status',
          fixed: 'right'
        }
      ]
    }
  }
}
