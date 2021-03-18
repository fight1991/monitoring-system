export default {
  icon: 'icon-power',
  path: '/bus/plant',
  name: 'bus-plant',
  // hidden: true,
  meta: {
    permission: [1, 2, 3, 255],
    title: 'plantM'
  },
  children: [
    {
      path: '/bus/plant/add',
      name: 'bus-plant-add',
      meta: {
        permission: [2, 3, 255],
        title: 'plantN',
        opType: 'add',
        component: () => import(/* webpackChunkName: "bus-plant-add" */ '@/views/pages/plant/stationOption')
      }
    },
    {
      path: '/bus/plant/edit',
      name: 'bus-plant-edit',
      hidden: true,
      meta: {
        permission: [1, 2, 3, 255],
        title: 'plantE',
        opType: 'edit',
        component: () => import(/* webpackChunkName: "bus-plant-add" */ '@/views/pages/plant/stationOption')
      }
    },
    {
      path: '/bus/plant/linkSn',
      name: 'bus-plant-linkSn',
      hidden: true,
      meta: {
        permission: [1, 255],
        title: 'plantL',
        opType: 'add',
        component: () => import(/* webpackChunkName: "bus-plant-add" */ '@/views/pages/plant/stationOption')
      }
    },
    {
      path: '/bus/plant/view',
      name: 'bus-plant-view',
      meta: {
        permission: [1, 2, 3, 255],
        title: 'plantS',
        component: () => import(/* webpackChunkName: "bus-plant-view" */ '@/views/pages/plant/showPlant')
      }
    },
    {
      path: '/bus/plant/detail',
      name: 'bus-plant-detail',
      hidden: true,
      meta: {
        permission: [1, 2, 3, 255],
        title: 'plantD',
        page: 'detail',
        component: () => import(/* webpackChunkName: "bus-plant-detail" */ '@/views/pages/plant/plantDetail')
      }
    }
  ]
}
