export default [
  {
    path: '/error/403',
    name: 'error-403',
    component: () => import(/* webpackChunkName: "error-403" */ './403.vue'),
    meta: {
      title: 'Download',
      requiresAuth: false
    }
  },
  {
    path: '/error/5xx',
    name: 'error-5xx',
    component: () => import(/* webpackChunkName: "error-5xx" */ './5xx.vue'),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/error/404',
    name: 'error-404',
    component: () => import(/* webpackChunkName: "error-404" */ './404.vue'),
    meta: {
      requiresAuth: false
    }
  }
]
