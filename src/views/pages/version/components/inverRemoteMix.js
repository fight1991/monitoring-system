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
          label: 'common.invertSn',
          prop: 'deviceSN',
          checked: true,
          width: 100
        },
        {
          label: 'invupgrade.invmodel',
          prop: 'deviceType',
          checked: true,
          width: 120
        },
        {
          label: 'invupgrade.master',
          prop: 'master',
          checked: true,
          width: 100
        },
        {
          label: 'invupgrade.slave',
          prop: 'slave',
          checked: true,
          width: 100
        },
        {
          label: 'invupgrade.arm',
          prop: 'manager',
          checked: true,
          width: 100
        },
        {
          label: 'common.datacolSN',
          prop: 'moduleSN',
          checked: true,
          renderHeader: true
        },
        {
          label: 'plant.datacolType',
          prop: 'moduleType',
          checked: true,
          renderHeader: true
        },
        {
          label: 'invupgrade.dataversion',
          prop: 'moduleVersion',
          width: 120,
          checked: true
        },
        {
          label: 'invupgrade.invstatus',
          prop: 'deviceStatus',
          checked: true,
          width: 100,
          slotName: 'status',
          fixed: 'right'
        }
      ]
    }
  }
}
