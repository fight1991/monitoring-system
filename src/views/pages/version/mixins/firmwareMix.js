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
          label: 'common.all',
          value: 0
        }, {
          label: 'common.invert',
          value: 1
        }, {
          label: 'common.module',
          value: 2
        }, {
          label: 'common.battery',
          value: 3
        }
      ],
      statusList: [ // 固件状态
        {
          label: 'common.all',
          value: 0
        }, {
          label: 'common.test',
          value: 1
        }, {
          label: 'common.rel',
          value: 2
        }
      ],
      tableHead: [
        {
          label: 'firmware.firmwareName',
          prop: 'firmwareName',
          checked: true
        },
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
          label: 'firmware.dseries',
          prop: 'productType',
          checked: true
        },
        {
          label: 'firmware.sType',
          prop: 'softType',
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
