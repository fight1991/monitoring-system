export default [{
  path: '/login',
  name: 'login',
  meta: {
    title: 'sign in',
    requiresAuth: false
  },
  component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue')
}, {
  path: '/signUp',
  name: 'signUp',
  meta: {
    title: 'sign up',
    requiresAuth: false
  },
  component: () => import(/* webpackChunkName: "signUp" */ '@/views/login/signUp')
}]
