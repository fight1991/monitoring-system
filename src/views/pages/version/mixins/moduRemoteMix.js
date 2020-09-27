export default {
  data () {
    return {
      statusList: [ // 0 全部 1 正常 2 故障  3离线
        { value: 0, label: 'all' },
        { value: 1, label: 'normal' },
        { value: 2, label: 'abnormal' },
        { value: 3, label: 'offline' }
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
          width: 130
        },
        {
          label: 'common.datacolSN',
          prop: 'moduleSN',
          checked: true,
          width: 140
        },
        {
          label: 'plant.datacolType',
          prop: 'moduleType',
          checked: true
        },
        {
          label: 'invupgrade.dataversion',
          prop: 'moduleVersion',
          checked: true
        },
        {
          label: 'invupgrade.invmodel',
          prop: 'deviceType',
          checked: true
        },
        {
          label: 'invupgrade.datastatus',
          prop: 'moduleStatus',
          checked: true,
          slotName: 'moduleStatus',
          fixed: 'right'
        }
      ]
    }
  }
}
