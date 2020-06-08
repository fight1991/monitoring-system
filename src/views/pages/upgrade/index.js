export default {
  icon: 'icon-ssh',
  path: '/bus/upgrade',
  name: 'bus-upgrade',
  meta: {
    permission: [1, 2, 3],
    title: 'remoteUp',
    component: () => import(/* webpackChunkName: "bus-upgrade" */ '@/views/pages/demo')
  }
}
