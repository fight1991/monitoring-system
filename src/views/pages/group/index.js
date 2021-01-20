export default {
  icon: 'icon-group',
  path: '/bus/group',
  name: 'bus-group',
  meta: {
    permission: [3, 255],
    title: 'clusterM'
  },
  children: [
    {
      path: '/bus/group/remote',
      name: 'bus-group-remote',
      meta: {
        permission: [3, 255],
        title: 'remoteSch',
        component: () => import(/* webpackChunkName: "bus-group-remote" */ '@/views/pages/group/remote')
      }
    }
  ]
}
