export default {
  icon: 'icon-log',
  path: '/bus/relog',
  name: 'bus-relog',
  meta: {
    permission: [1, 2, 3],
    title: 'relog',
    component: () => import(/* webpackChunkName: "bus-relog" */ '@/views/pages/demo')
  }
}
