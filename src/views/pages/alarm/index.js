export default {
  icon: 'icon-alarm',
  path: '/bus/alarm',
  name: 'bus-alarm',
  meta: {
    permission: [1, 2, 3, 255],
    title: 'alarmM',
    component: () => import(/* webpackChunkName: "bus-alarm" */ '@/views/pages/demo')
  }
}
