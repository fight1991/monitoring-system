export default {
  icon: 'icon-factory',
  path: '/bus/factory',
  name: 'bus-factory',
  meta: {
    permission: [1, 2, 3],
    title: 'factM',
    component: () => import(/* webpackChunkName: "bus-factory" */ '@/views/pages/demo')
  }
}
