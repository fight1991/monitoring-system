
export default {
  data () {
    return {
      inverterTableHead: [
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
          label: 'common.plant',
          prop: 'plantName',
          checked: true
        },
        {
          label: 'invupgrade.invmodel',
          prop: 'deviceType',
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
          width: '100',
          slotName: 'op',
          fixed: 'right'
        }
      ]
    }
  }
}
