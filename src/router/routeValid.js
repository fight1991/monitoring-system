import store from '@/store'
import storage from '@/util/storage'
import i18n from '@/i18n'
import Vue from 'vue'
import NProgress from 'nprogress'
NProgress.configure({ showSpinner: false })

const _this = Vue.prototype

// 登录校验、放行 注意: 有些cdn路由版本 地址栏输入路由地址时会加载2次
const beforeEach = async (to, from, next) => {
  NProgress.start()
  // 访问store router.app.$options.store
  // 是否是开启全局loading
  store.commit('changeLoadingStatus', !to.path.includes('bus'))
  // 登录页直接放行
  if (to.path === '/login') {
    storage.removeStorage('token')
    storage.removeLoginInfo()
    storage.clearSession()
    store.state.isFirst = true
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
  if (store.state.isFirst) {
    let langInfo = storage.getStorage('lang')
    if (langInfo) {
      store.commit('toggleLang', langInfo)
      i18n.locale = langInfo
    }
    // 用户信息查询
    let { result: userInfo } = await _this.$get({ url: '/v0/user/info' })
    // 权限查询
    let { result: accessStatus } = await _this.$get({ url: '/v0/user/access' })
    if (userInfo) {
      store.commit('setUserInfo', userInfo)
      storage.setUserInfo(userInfo)
    }
    if (accessStatus && typeof accessStatus.access === 'number') {
      store.commit('setAccess', accessStatus.access)
    }
    if (userInfo || accessStatus) {
      store.commit('changeFirst', false)
    }
  }
  // 路由跳转鉴别权限
  if (!(to.meta.permission && to.meta.permission.includes(store.state.access))) {
    if (store.state.access >= 0) {
      _this.$message.error('No permissions!')
    }
    return
  }
  // 存储messageError列表
  let errorInfo = localStorage.getItem('errorInfo')
  if (!errorInfo) {
    let { result } = await _this.$get({
      url: '/v0/errors/message'
    })
    if (result && result.messages) {
      localStorage.setItem('errorInfo', 'v1.0.0')
      store.commit('getErrorInfo', result.messages)
    }
  }
  next()
}

const afterEach = (to, from) => {
  NProgress.done()
  document.title = to.meta.title || 'FoxESS'
  if (store.state.tabView && to.meta.component) {
    document.title = i18n.t('navBar.' + to.meta.title)
    if (store.state.tab.isInitTab) {
      _this.$tab.append({
        name: to.name,
        query: to.query,
        params: to.params
      })
    }
    store.dispatch('setInitTabStatus', false)
    // token异常拦截到登录页 有可能dom没更新完成就跳转到登录页,造成echart渲染异常
    // 从login页面跳到指定redirect中的地址,刷新组件
    // if (from.query.redirect) {
    //   store.dispatch('refreshTab', { name: to.name })
    // }
  }
}
export { beforeEach, afterEach }
