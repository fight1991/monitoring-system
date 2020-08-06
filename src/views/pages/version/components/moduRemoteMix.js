export default {
  data () {
    return {
      statusList: [ // 0 全部 1 正常 2 故障  3离线
        { status: 0, label: 'all' },
        { status: 1, label: 'normal' },
        { status: 2, label: 'abnormal' },
        { status: 3, label: 'offline' }
      ],
      tableHead: [
        {
          label: 'common.plant',
          prop: 'plantName',
          checked: true
        },
        {
          label: 'common.datacolSN',
          prop: 'moduleSN',
          checked: true,
          width: 150
        },
        {
          label: 'plant.datacolType',
          prop: 'moduleType',
          checked: true,
          width: 130
        },
        {
          label: 'invupgrade.dataversion',
          prop: 'moduleVersion',
          checked: true,
          width: 130
        },
        {
          label: 'common.invertSn',
          prop: 'deviceSN',
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
          label: 'invupgrade.datastatus',
          prop: 'moduleStatus',
          checked: true,
          width: 100,
          slotName: 'moduleStatus',
          fixed: 'right'
        }
      ]
    }
  }
}
