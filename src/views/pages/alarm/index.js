export default {
  icon: 'icon-alarm',
  path: '/bus/alarm',
  name: 'bus-alarm',
  meta: {
    permission: [1, 2, 3],
    title: 'alarmM'
  },
  children: [
    {
      path: '/bus/alarm/realTime',
      name: 'bus-alarm-realTime',
      meta: {
        permission: [1, 2, 3],
        title: 'alarmTime',
        component: () => import(/* webpackChunkName: "bus-alarm-realTime" */ '@/views/pages/demo')
      }
    },
    {
      path: '/bus/alarm/history',
      name: 'bus-alarm-history',
      meta: {
        permission: [1, 2, 3],
        title: 'alarmHistory',
        component: () => import(/* webpackChunkName: "bus-alarm-history" */ '@/views/pages/demo')
      }
    }
  ]
}
