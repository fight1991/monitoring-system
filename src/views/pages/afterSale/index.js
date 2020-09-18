export default {
  icon: 'icon-sale',
  path: '/bus/afterSale',
  name: 'bus-afterSale',
  meta: {
    permission: [1, 2, 3, 255],
    title: 'afterSale',
    component: () => import(/* webpackChunkName: "bus-afterSale" */ '@/views/pages/demo')
  }
}
