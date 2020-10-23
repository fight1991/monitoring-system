import router from './index'
import store from '../store'
import { Message } from 'element-ui'
/**
 * 统一用路由name做跳转, path和params是传参会失效
 * tabMethods.open    打开新页签, 需要定义一个tabId
 * tabMethods.append  在已有的页签中查找,有则激活,无则添加
 * tabMethods.replace 替换已有页签,无则打开新页签
 * tabMethods.back    关闭当前tab,打开指定tab(如果存在就刷新)
 */
const tabMethods = {
  open ({ name, tabId = '', tabTitle = '', query = {}, params = {} }) {
    if (!name) return
    if (!tabId) {
      Message.warning('指定一个tabId')
      return
    }
    resolveParams('addNewTab', {
      name,
      tabId,
      tabTitle,
      query,
      params
    })
  },
  append ({ name, tabId = '', tabTitle = '', query = {}, params = {} }) {
    if (!name) return
    resolveParams('appendTab', {
      name,
      tabId,
      tabTitle,
      query,
      params
    })
  },
  replace ({ name, tabId = '', tabTitle = '', query, params }) {
    if (!name) return
    resolveParams('replaceTab', {
      name,
      tabId,
      tabTitle,
      query,
      params
    })
  },
  closeActiveTab (name) {
    store.dispatch('closeActiveTab')
    router.push(store.getters.currentTabInfo)
  },
  closeAllTab () {
    store.dispatch('closeAllTab')
    router.push(store.getters.currentTabInfo)
  },
  closeInactiveTab (name) {
    store.dispatch('closeInactiveTab', { name })
  },
  closeOtherTab () {
    store.dispatch('closeOtherTab')
  },
  back ({ name, tabId = '', tabTitle = '', query, params }) {
    if (!name) return
    resolveParams('backTab', {
      name,
      tabId,
      tabTitle,
      query,
      params
    })
  },
  setTitle (title) {
    if (!title) return
    store.dispatch('setTabTitle', title)
  }
}
/**
 * @param {* 参数解析 }
 * @param {*}
 * methodName: 方法名,
 * name: 路由name
 * tabId: 定义tabId
 * tabTitile: 定义tab名
 * query/params 路由参数
 */
function resolveParams (methodName, { name, tabId, tabTitle, query, params }) {
  let { route: { meta } } = router.resolve({ name })
  let { title, component } = meta
  if (tabTitle) {
    title = tabTitle
  }
  store.dispatch(methodName, { name, tabId, components: [component], isShow: true, title, loadingNum: 0, query, params })
  router.push({
    name,
    query,
    params
  })
}

export default {
  install (Vue) {
    Vue.prototype.$tab = tabMethods
  }
}
