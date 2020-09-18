export default [
  {
    path: '/user/center',
    name: 'user-center',
    meta: {
      permission: [1, 2, 3, 255],
      title: 'userCenter'
    },
    component: () => import(/* webpackChunkName: "userCenter" */ '@/views/user/user')
  }
]
