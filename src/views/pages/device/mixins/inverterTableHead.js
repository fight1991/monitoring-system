
export default {
  data () {
    return {
      inverterTableHead: [
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
          label: 'common.plant',
          prop: 'plantName',
          checked: true,
          width: 140
        },
        {
          label: 'invupgrade.invmodel',
          prop: 'deviceType',
          checked: true,
          width: 120
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
          slotName: 'generationToday',
          width: 115
        },
        {
          label: 'plant.genTot',
          prop: 'generationTotal',
          checked: true,
          slotName: 'generationTotal',
          width: 115
        },
        {
          label: 'plant.gridtime',
          prop: 'feedinDate',
          checked: true,
          renderHeader: true,
          width: 220
        },
        {
          label: 'plant.country',
          prop: 'country',
          checked: true
        },
        {
          label: 'common.status',
          prop: 'status',
          checked: true,
          slotName: 'status',
          fixed: 'right'
        },
        {
          label: 'common.operation',
          prop: '',
          checked: true,
          width: '120',
          slotName: 'op',
          fixed: 'right'
        }
      ]
    }
  }
}
