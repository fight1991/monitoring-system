
export default {
  data () {
    return {
      deviceTableHead: [
        {
          label: 'common.invertSn',
          prop: 'deviceSN',
          checked: true,
          renderHeader: true
        },
        {
          label: 'common.datacolSN',
          prop: 'moduleSN',
          checked: true,
          renderHeader: true
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
          renderHeader: true
        },
        {
          label: 'plant.genTod',
          prop: 'generationToday',
          checked: true,
          renderHeader: true
        },
        {
          label: 'plant.genTot',
          prop: 'generationTotal',
          checked: true,
          renderHeader: true
        },
        {
          label: 'plant.gridtime',
          prop: 'feedinDate',
          checked: true,
          renderHeader: true,
          slotName: 'feedinDate'
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
