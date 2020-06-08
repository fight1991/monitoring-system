
export default {
  data () {
    return {
      plantTableHead: [
        { // 实时数据 状态
          label: 'common.status',
          prop: 'status',
          checked: true,
          slotName: 'status'
        },
        {
          label: 'common.plant',
          prop: 'name',
          checked: true
        },
        {
          label: 'plant.country',
          prop: 'country',
          checked: true
        },
        {
          label: 'plant.city',
          prop: 'city',
          checked: true
        },
        {
          label: 'common.postcode',
          prop: 'postcode',
          checked: true,
          width: 100
        },
        {
          label: 'plant.equipqut',
          prop: 'quantity',
          checked: true,
          width: '100',
          renderHeader: true
        },
        {
          label: 'plant.pvcap',
          prop: 'capacity',
          checked: true,
          width: '80',
          renderHeader: true
        },
        {
          label: 'common.pvcapacity',
          prop: 'systemCapacity',
          checked: true,
          width: '120'
        },
        { // 实时数据 发电功率
          label: 'common.gPower',
          prop: 'power',
          checked: true,
          width: '80',
          renderHeader: true
        },
        { // 实时数据 今日发电量
          label: 'plant.genTod',
          prop: 'generationToday',
          checked: true,
          width: '80',
          renderHeader: true
        },
        {
          label: 'plant.stationTime',
          prop: 'createdDate',
          checked: true,
          width: '130',
          renderHeader: true
        },
        {
          label: 'common.operation',
          prop: '',
          width: '100',
          checked: true,
          slotName: 'op',
          fixed: 'right'
        }
      ]
    }
  }
}
