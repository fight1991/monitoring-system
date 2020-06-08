export default {
  icon: 'icon-banbenxinxi',
  path: '/bus/version',
  name: 'bus-version',
  meta: {
    permission: [1, 2, 3],
    title: 'versionM'
  },
  children: [
    {
      path: '/bus/version/firmware',
      name: 'bus-version-firmware',
      meta: {
        permission: [1, 2, 3],
        title: 'firmware',
        component: () => import(/* webpackChunkName: "bus-version-firmware" */ '@/views/pages/version/firmware')
      }
    },
    {
      path: '/bus/version/inverRemote',
      name: '/bus-version-inverRemote',
      meta: {
        permission: [1, 2, 3],
        title: 'inverUp',
        component: () => import(/* webpackChunkName: "bus-version-inverRemote" */ '@/views/pages/version/inverRemote')
      }
    },
    {
      path: '/bus/version/moduRemote',
      name: '/bus-version-moduRemote',
      meta: {
        permission: [1, 2, 3],
        title: 'moduleUp',
        component: () => import(/* webpackChunkName: "bus-device-module" */ '@/views/pages/version/moduRemote')
      }
    }
  ]
}
