export default {
  icon: 'icon-shebeiguanli',
  path: '/bus/device',
  name: 'bus-device',
  meta: {
    permission: [1, 2, 3, 255],
    title: 'deviceM'
  },
  children: [
    {
      path: '/bus/device/inverter',
      name: 'bus-device-inverter',
      meta: {
        permission: [1, 2, 3, 255],
        title: 'invertM',
        component: () => import(/* webpackChunkName: "bus-device-inverter" */ '@/views/pages/device/inverterList')
      }
    },
    {
      path: '/bus/device/module',
      name: '/bus-device-module',
      meta: {
        permission: [1, 2, 3, 255],
        title: 'moduleM',
        component: () => import(/* webpackChunkName: "bus-device-module" */ '@/views/pages/device/moduleList')
      }
    },
    {
      path: '/bus/device/battery',
      name: '/bus-device-battery',
      hidden: true,
      meta: {
        permission: [1, 2, 3, 255],
        title: 'batteryM',
        component: () => import(/* webpackChunkName: "bus-device-battery" */ '@/views/pages/demo')
      }
    },
    {
      path: '/bus/device/inverterDetail',
      name: 'bus-device-inverterDetail',
      hidden: true,
      meta: {
        permission: [1, 2, 3, 255],
        title: 'invertD',
        component: () => import(/* webpackChunkName: "bus-device-inverterDetail" */ '@/views/pages/device/inverterDetail')
      }
    },
    {
      path: '/bus/device/inverter/remoteSetting',
      name: 'bus-device-remoteSetting',
      hidden: true,
      meta: {
        permission: [1, 2, 3, 255],
        title: 'remoteS',
        component: () => import(/* webpackChunkName: "bus-device-remoteSetting" */ '@/views/pages/device/remoteSetting')
      }
    }
  ]
}
