import VueRouter from 'vue-router'
// 所有路由地址
import routes from './routePaths'

import { beforeEach, afterEach } from './routeValid'

const router = new VueRouter({
  mode: 'history',
  routes
})

// 路由跳转之前
router.beforeEach(beforeEach)
// 路由跳转之后
router.afterEach(afterEach)

export default router
