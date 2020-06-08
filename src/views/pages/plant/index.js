export default {
  icon: 'icon-power',
  path: '/bus/plant',
  name: 'bus-plant',
  // hidden: true,
  meta: {
    permission: [1, 2, 3],
    title: 'plantM'
  },
  children: [
    {
      path: '/bus/plant/add',
      name: 'bus-plant-add',
      meta: {
        permission: [2, 3],
        title: 'plantN',
        opType: 'add',
        component: () => import(/* webpackChunkName: "bus-plant-add" */ '@/views/pages/plant/createPlant')
      }
    },
    {
      path: '/bus/plant/edit',
      name: 'bus-plant-edit',
      hidden: true,
      meta: {
        permission: [2, 3],
        title: 'plantE',
        opType: 'edit',
        component: () => import(/* webpackChunkName: "bus-plant-add" */ '@/views/pages/plant/createPlant')
      }
    },
    {
      path: '/bus/plant/view',
      name: 'bus-plant-view',
      meta: {
        permission: [1, 2, 3],
        title: 'plantS',
        component: () => import(/* webpackChunkName: "bus-plant-view" */ '@/views/pages/plant/showPlant')
      }
    },
    {
      path: '/bus/plant/detail',
      name: 'bus-plant-detail',
      hidden: true,
      meta: {
        permission: [1, 2, 3],
        title: 'plantD',
        page: 'detail',
        component: () => import(/* webpackChunkName: "bus-plant-detail" */ '@/views/pages/plant/plantDetail')
      }
    }
  ]
}
