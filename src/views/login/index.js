export default {
  path: '/login',
  name: 'login',
  meta: {
    title: 'Login',
    requiresAuth: false
  },
  component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue')
}
