import router from '@/router'
let Home = () => import(/* webpackChunkName: "home" */ '@/views/pages/home')

const state = {
  currentTab: 'tab-index',
  tabList: [
    {
      tabId: 'tab-index',
      title: 'home',
      path: '/bus/index',
      name: 'tab-index',
      isShow: true,
      components: [Home],
      query: {},
      params: {},
      loadingNum: 0
    }
  ]
}
const getters = {
  currentTabInfo (state) {
    return state.tabList.find(v => v.tabId === state.currentTab)
  }
}
const mutations = {
  // 添加新的页签, 需要另外指定tabId
  ADD_NEW_TAB ({ name, tabId = '', isShow = true, query = {}, params = {}, loadingNum = 0 }) {},
  // 刷新已经存在的页签
  REFRESH_EXIST_TAB ({ name, tabId = '', isShow = true, query = {}, params = {}, loadingNum = 0 }) {},
  // 替换已经存在的页签
  REPLACE_EXIST_TAB () {},
  // 激活页签, 没有就追加
  RESHOW_EXIST_TAB () {},
  // 关闭当前激活的页签
  CLOSE_ACTIVE_TAB () {},
  // 关闭非激活的页签
  CLOSE_INACTIVE_TAB () {},
  // 关闭所有页签
  CLOSE_ALL_TAB () {},
  // 关闭除当前激活页签的所有页签
  CLOSE_OTHER_TAB () {},
  // 添加新页签
  addTab (state, payLoad) {
    if (!payLoad) return
    // 有无相同的组件
    let sameTab = state.tabList.find(tab => tab.path === payLoad.path)
    // 是否已经存在相同的组件id
    let sameId = state.tabList.some(tab => tab.tabId === payLoad.tabId)
    if (payLoad.params.refresh) { // 有相同组件则替换
      if (sameTab) {
        sameTab.isShow = false
        sameTab.timer = setTimeout(() => {
          sameTab.isShow = true
          delete payLoad.params.refresh
          clearTimeout(sameTab.timer)
        }, 0)
      } else {
        state.tabList.push(payLoad)
      }
    } else {
      if (!sameId) {
        state.tabList.push(payLoad)
      }
    }
    // 激活当前页签
    this.commit('setCurrentTab', payLoad.tabId)
  },
  // 选中当前页签
  setCurrentTab (state, payLoad) {
    state.currentTab = payLoad
  },
  // 关闭当前页签不能改变tabList长度, 否则会引发所有页签下组件刷新?
  closeTab (state, tabId) {
    let index = state.tabList.findIndex(v => v.tabId === (tabId || state.currentTab))
    let activeTabInfo = state.tabList[index + 1] || state.tabList[index - 1]
    state.tabList.splice(index, 1)
    if (tabId === state.currentTab) { // 如果关闭的是当前活动的页签,激活相邻页签(路由跳转)
      let { name, query, params } = activeTabInfo
      delete params.refresh
      router.push({
        name,
        query,
        params
      })
    }
  }
}
const actions = {
  // 设置当前组件的loading
  setCurrentTabLoading ({ state }, { tabId, flag }) {
    let comp = state.tabList.find(v => v.tabId === tabId)
    if (!comp) return // 防止正在请求时,关闭页签,组件查找不到
    let tempNum = comp.loadingNum
    flag ? tempNum++ : tempNum--
    if (tempNum < 0) {
      tempNum = 0
    }
    comp.loadingNum = tempNum
  },
  // 关闭所有页签
  closeAllTab ({ state, commit }) {
    state.tabList.splice(1)
    router.push({
      name: 'tab-index'
    })
  },
  // 关闭非当前页签的所有页签
  closeOtherTab ({ state, getters }) {
    let temp = { ...getters.currentTabInfo }
    state.tabList.splice(1)
    if (temp.tabId === 'tab-index') return
    state.tabList.push(temp)
  },
  // 移除页签
  removeTab ({ state }) {
    let index = state.tabList.findIndex(v => v.tabId === state.currentTab)
    state.tabList.splice(index, 1)
  },
  addNewTab ({ commit }, tabObj) {
    commit('ADD_NEW_TAB', tabObj)
  },
  refreshTab ({ commit }, tabObj) {
    commit('REFRESH_CURRENT_TAB', tabObj)
  },
  replaceTab ({ commit }, tabObj) {
    commit('REPLACE_EXIST_TAB', tabObj)
  },
  reshowTab ({ commit }, tabObj) {
    commit ('RESHOW_EXIST_TAB', tabObj)
  },
  backTab ({ commit }, tabObj) {
    commit('BACK_EXIST_TAB', tabObj)
  },
  closeActiveTab ({ commit }, tabObj) {
    commit('CLOSE_ACTIVE_TAB', tabObj)
  },
  closeInactiveTab ({ commit }, tabObj) {
    commit('CLOSE_INACTIVE_TAB', tabObj)
  },
  closeAllTab ({ commit }, tabObj) {
    commit('CLOSE_ALL_TAB', tabObj)
  },
  closeOtherTab ({ commit }, tabObj) {
    commit('CLOSE_OTHER_TAB', tabObj)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
