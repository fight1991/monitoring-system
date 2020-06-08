export default {
  icon: 'icon-dianchi',
  path: '/bus/battery',
  name: 'bus-battery',
  meta: {
    permission: [1, 2, 3],
    title: 'batteryM',
    component: () => import(/* webpackChunkName: "bus-battery" */ '@/views/pages/demo')
  }
}
