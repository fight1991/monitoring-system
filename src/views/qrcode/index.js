const appVersion = process.env.VUE_APP_VERSION
const getComponents = (type) => () => import(/* webpackChunkName: "downloadApp" */ '@/views/qrcode/' + type)
export default [
  {
    path: '/app/download',
    name: 'app-download',
    meta: {
      requiresAuth: false,
      title: 'Download'
    },
    component: getComponents(appVersion)
  },
  {
    path: '/manual/download',
    name: 'manual-download',
    meta: {
      requiresAuth: false,
      title: 'Download'
    },
    component: () => import(/* webpackChunkName: "downloadManual" */ '@/views/qrcode/manual')
  }
]
