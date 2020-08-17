
export default {
  data () {
    return {
      inverterTableHead: [
        {
          label: 'common.invertSn',
          prop: 'deviceSN',
          checked: true,
          renderHeader: true,
          width: 150
        },
        {
          label: 'common.datacolSN',
          prop: 'moduleSN',
          checked: true,
          renderHeader: true,
          width: 160
        },
        {
          label: 'common.plant',
          prop: 'plantName',
          checked: true
        },
        {
          label: 'invupgrade.invmodel',
          prop: 'deviceType',
          checked: true,
          width: 110
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
          checked: true,
          slotName: 'generationTotal',
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
          label: 'plant.country',
          prop: 'country',
          checked: true
        },
        {
          label: 'common.status',
          prop: 'status',
          checked: true,
          slotName: 'status'
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
