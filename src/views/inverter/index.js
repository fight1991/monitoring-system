export default [
  {
    permisson: '',
    path: '/inverter/display',
    name: 'inverter-display',
    meta: {
      title: '逆变器展示'
    },
    component: () => import(/* webpackChunkName: "inverter-display" */ './index.vue')
  }
]
