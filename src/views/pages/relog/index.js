export default {
  icon: 'icon-log',
  path: '/bus/relog',
  name: 'bus-relog',
  meta: {
    permission: [255],
    title: 'relog'
  },
  children: [
    {
      path: '/bus/relog/battLog',
      name: 'bus-relog-battLog',
      meta: {
        permission: [255],
        title: 'battLog',
        component: () => import(/* webpackChunkName: "bus-relog-battLog" */ '@/views/pages/relog/battLog')
      }
    }
  ]
}
