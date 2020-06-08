export default {
  icon: 'icon-dashboard',
  path: '/bus/dataView',
  name: 'bus-data-view',
  meta: {
    permission: [1, 2, 3],
    title: 'board',
    page: 'board',
    component: () => import(/* webpackChunkName: "bus-plant-detail" */ '@/views/pages/plant/plantDetail')
  }
}
