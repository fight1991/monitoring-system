import VueRouter from 'vue-router'
import store from '@/store'
import storage from '@/util/storage'

// 路由地址
import Error from '@/views/error'
import Login from '@/views/login'
import Product from '@/views/product'
import Inverter from '@/views/inverter'
import BusinessRouter from '@/views/pages'
import Qrcode from '@/views/qrcode'
import User from '@/views/user'

const Main = () => import(/* webpackChunkName: "bus-main" */ '../views/main.vue')

const routes = [
  {
    path: '/',
    redirect: '/bus/index'
  }, {
    path: '*',
    redirect: {
      name: 'error-404'
    }
  }, {
    path: '/bus/index',
    name: 'bus-index',
    component: Main,
    children: [...BusinessRouter]
  }
]

routes.push(...Error)
routes.push(...Inverter)
routes.push(...Product)
routes.push(...Qrcode)
routes.push(...Login)
routes.push(...User)

const router = new VueRouter({
  mode: 'history',
  routes
})
// 登录校验、放行 注意: 有些cdn路由版本 地址栏输入路由地址时会加载2次
router.beforeEach(async (to, from, next) => {
  let _this = router.app
  // 登录页直接放行
  if (to.path === '/login') {
    storage.removeStorage('token')
    storage.removeLoginInfo()
    storage.clearSession()
    _this.$options.store.state.isFirst = true
    next()
    return
  }
  // 不需权限,直接放行,/error-xx等
  if (to.meta.requiresAuth === false) {
    next()
    return
  }
  // token不存在,跳转到login
  if (!storage.getStorage('token')) {
    next('/login')
    return
  }
  // 第一次进入系统需要获取权限状态和用户信息(刷新地址栏)
  if (_this.$options.store.state.isFirst) {
    // 用户信息查询
    let { result: userInfo } = await _this.$axios({ url: '/v0/user/info' })
    // 权限查询
    let { result: accessStatus } = await _this.$axios({ url: '/v0/user/access' })
    if (userInfo) {
      _this.$options.store.commit('setUserInfo', userInfo)
      storage.setUserInfo(userInfo)
    }
    if (accessStatus && typeof accessStatus.access === 'number') {
      _this.$options.store.commit('setAccess', accessStatus.access)
    }
    if (userInfo || accessStatus) {
      _this.$options.store.commit('changeFirst', false)
    }
  }
  // 路由跳转鉴别权限
  if (!(to.meta.permission && to.meta.permission.includes(store.state.access))) {
    if (store.state.access === 0) { // 游客
      next('/product/index')
      return
    }
    if (store.state.access >= 0) {
      _this.$message.error('No permissions!')
    }
    return
  }
  next()
})
// 路由跳转之后
router.afterEach((to, from) => {
  document.title = to.meta.title || 'PV-HUB'
  let tabId = to.query.tabId || to.params.tabId || to.name
  let title = to.query.tabTitle || to.params.tabTitle || to.meta.title
  if (store.state.tabView && to.meta.component) {
    document.title = router.app.$t('navBar.' + to.meta.title)
    let tempParams = JSON.parse(JSON.stringify(to.params))
    // token异常拦截到登录页 有可能dom没更新完成就跳转到登录页,造成echart渲染异常
    // 从login页面跳到指定redirect中的地址,刷新组件
    if (from.query.redirect) {
      tempParams.refresh = true
    }
    store.commit('addTab', {
      tabId,
      title,
      isShow: true,
      components: [to.meta.component],
      path: to.path,
      name: to.name,
      query: JSON.parse(JSON.stringify(to.query)),
      params: tempParams,
      loadingNum: 0
    })
  }
})
export default router
