export default {
  icon: 'icon-data-report',
  path: '/bus/dataReport',
  name: 'bus-dataReport',
  meta: {
    permission: [3],
    title: 'data',
    component: () => import(/* webpackChunkName: "bus-dataReport" */ '@/views/pages/dataReport/reportList')
  }
}
