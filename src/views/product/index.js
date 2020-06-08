export default [
  {
    path: '/product/index',
    name: 'product-index',
    meta: {
      permission: [0, 1, 2, 3],
      title: 'Introduction'
    },
    component: () => import(/* webpackChunkName: "product-introduction" */ '@/views/product/introduct')
  }
]
