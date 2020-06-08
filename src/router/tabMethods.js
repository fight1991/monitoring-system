import router from './index'
/**
 * 统一用path做跳转, path和params是传参会失效
 * tabMethods.open    打开新页签, 需要定义一个tabId
 * tabMethods.push    同this.$router.push 在已有的页签中查找,有则激活,无则新增
 * tabMethods.replace 替换已有页签,无则打开新页签
 * tabMethods.open    关闭当前tab,打开指定tab(如果存在就刷新)
 */
const tabMethods = {
  open ({ name, tabId = '', tabTitle = '', query = {}, params = {} }) {
    params.tabTitle = tabTitle
    if (!name) return
    if (!tabId) return
    router.push({
      name,
      query,
      params: {
        tabId,
        ...params
      }
    })
  },
  push ({ name, tabTitle = '', query = {}, params = {} }) {
    params.tabTitle = tabTitle
    router.push({
      name,
      query,
      params
    })
  },
  replace ({ name, tabTitle, query = {}, params = {} }) {
    params.tabTitle = tabTitle
    router.push({
      name,
      query,
      params: {
        refresh: true,
        ...params
      }
    })
  },
  back ({ name, query = {}, params = {} }) {
    router.app.$options.store.dispatch('removeTab')
    this.replace({ name, query, params })
  }
}
export default {
  install (Vue) {
    Vue.prototype.$tab = tabMethods
  }
}
