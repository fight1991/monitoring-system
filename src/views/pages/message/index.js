export default {
  icon: 'icon-xiaoxi',
  path: '/bus/message',
  name: 'bus-message',
  meta: {
    permission: [1, 2, 3],
    title: 'infoSys',
    component: () => import(/* webpackChunkName: "bus-message" */ '@/views/pages/demo')
  }
}
