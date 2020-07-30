export default {
  data () {
    return {
      versionList: [ // 版本类型
        'master',
        'slave',
        'manager'
      ],
      modelTypeList: [ // 设备类型
        {
          label: '全部',
          value: 0
        }, {
          label: '逆变器',
          value: 1
        }, {
          label: '模块',
          value: 2
        }, {
          label: '电池',
          value: 3
        }
      ],
      statusList: [ // 固件状态
        {
          label: '全部',
          value: 0
        }, {
          label: '测试',
          value: 1
        }, {
          label: '发布',
          value: 2
        }
      ],
      tableHead: [
        {
          label: 'firmware.devicetype',
          prop: 'modelType',
          checked: true,
          slotName: 'modelType'
        },
        {
          label: 'firmware.version',
          prop: 'firmwareVersion',
          checked: true
        },
        {
          label: 'firmware.type',
          prop: 'productType',
          checked: true
        },
        {
          label: 'firmware.status',
          prop: 'firmwareStatus',
          checked: true,
          slotName: 'firmwareStatus'
        },
        {
          label: 'firmware.uptime',
          prop: 'uploadTime',
          checked: true
        }
      ]
    }
  }
}
