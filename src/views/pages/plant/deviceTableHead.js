
export default {
  data () {
    return {
      deviceTableHead: [
        {
          label: 'common.invertSn',
          prop: 'deviceSN',
          checked: true,
          renderHeader: true,
          width: 140
        },
        {
          label: 'common.datacolSN',
          prop: 'moduleSN',
          checked: true,
          renderHeader: true,
          width: 140
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
          renderHeader: true
        },
        {
          label: 'plant.genTod',
          prop: 'generationToday',
          checked: true,
          slotName: 'generationToday',
          renderHeader: true
        },
        {
          label: 'plant.genTot',
          prop: 'generationTotal',
          slotName: 'generationTotal',
          checked: true,
          renderHeader: true
        },
        {
          label: 'plant.gridtime',
          prop: 'feedinDate',
          checked: true,
          renderHeader: true,
          width: 220
        },
        {
          label: 'plant.equipSta',
          prop: 'status',
          width: 120,
          renderHeader: true,
          checked: true,
          slotName: 'status',
          fixed: 'right'
        }
      ]
    }
  }
}
