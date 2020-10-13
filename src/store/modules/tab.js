import Vue from 'vue'
const Home = () => import(/* webpackChunkName: "home" */ '@/views/pages/home/index.vue')
const state = {
  currentTab: 'tab-index',
  isInitTab: true, // 刷新页面时正常添加页签
  tabList: [
    {
      title: 'home',
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
    return state.tabList.find(v => v.name === state.currentTab)
  }
}
const mutations = {
  SET_INIT_TAB_STATUS (state, status) {
    state.isInitTab = status
  },
  // 打开新的页签, 忽略name 需要另外指定tabId
  ADD_NEW_TAB (state, tabInfo) {
    state.tabList.push(tabInfo)
  },
  // 激活页签
  SET_ACTIVE_TAB (state, name) {
    state.currentTab = name
  },
  // 刷新已经存在的页签
  REFRESH_EXIST_TAB (state, tabInfo) {
    if (!tabInfo.isShow) return
    if (tabInfo.loadingNum > 0) return
    tabInfo.isShow = false
    Vue.nextTick().then(() => {
      tabInfo.isShow = true
    })
  },
  // 替换已经存在的页签
  REPLACE_EXIST_TAB (state, tabObj) {
    let { name } = tabObj
    let tabIndex = state.tabList.findIndex(v => v.name === name)
    if (tabIndex > 0) {
      state.tabList.splice(tabIndex, 1, tabObj)
      this.commit('REFRESH_EXIST_TAB', tabObj)
    } else {
      state.tabList.push(tabObj)
    }
  },
  // 显示已经存在的页签,没有就追加
  RESHOW_EXIST_TAB (state, tabInfo) {
    let { name } = tabInfo
    let tempObj = state.tabList.find(v => v.name === name)
    if (!tempObj) {
      state.tabList.push(tabInfo)
    }
  },
  // 关闭非激活的页签
  CLOSE_INACTIVE_TAB (state, tabInfo) {
    let index = state.tabList.findIndex(v => v.name === tabInfo.name)
    state.tabList.splice(index, 1)
  },
  // 关闭所有页签
  CLOSE_ALL_TAB (state) {
    state.tabList.splice(1)
  },
  // 关闭除当前激活页签的所有页签
  CLOSE_OTHER_TAB (state) {
    let temp = { ...this.getters.currentTabInfo }
    state.tabList.splice(1)
    if (temp.name === 'tab-index') return
    state.tabList.push(temp)
  },
  // 替换当前页签的title
  SET_TAB_TITLE (state, title) {
    let tabInfo = state.tabList.find(v => v.name === state.currentTab)
    tabInfo.title = title
  }
}
const actions = {
  // 设置当前组件的loading
  setCurrentTabLoading ({ state }, { tabId, flag }) {
    let comp = state.tabList.find(v => v.name === tabId)
    if (!comp) return // 防止正在请求时,关闭页签,组件查找不到
    let tempNum = comp.loadingNum
    flag ? tempNum++ : tempNum--
    if (tempNum < 0) {
      tempNum = 0
    }
    comp.loadingNum = tempNum
  },
  addNewTab ({ commit }, tabObj) {
    commit('ADD_NEW_TAB', tabObj)
    commit('SET_ACTIVE_TAB', tabObj.name)
  },
  refreshTab ({ commit }, tabObj) {
    commit('REFRESH_EXIST_TAB', tabObj)
  },
  replaceTab ({ state, commit }, tabObj) {
    commit('REPLACE_EXIST_TAB', tabObj)
    commit('SET_ACTIVE_TAB', tabObj.name)
  },
  appendTab ({ commit }, tabObj) {
    commit('RESHOW_EXIST_TAB', tabObj)
    commit('SET_ACTIVE_TAB', tabObj.name)
  },
  backTab ({ state, dispatch }, tabObj) {
    let index = state.tabList.findIndex(v => v.name === state.currentTab)
    state.tabList.splice(index, 1)
    dispatch('replaceTab', tabObj)
  },
  // 关闭激活的页签, 并激活相邻页签
  closeActiveTab ({ state, commit }) {
    let index = state.tabList.findIndex(v => v.name === state.currentTab)
    let activeTabInfo = state.tabList[index + 1] || state.tabList[index - 1]
    state.tabList.splice(index, 1)
    commit('SET_ACTIVE_TAB', activeTabInfo.name)
  },
  closeInactiveTab ({ commit }, tabObj) {
    commit('CLOSE_INACTIVE_TAB', tabObj)
  },
  closeAllTab ({ commit }, tabObj) {
    commit('CLOSE_ALL_TAB', tabObj)
    commit('SET_ACTIVE_TAB', 'tab-index')
  },
  closeOtherTab ({ commit }, tabObj) {
    commit('CLOSE_OTHER_TAB', tabObj)
  },
  setInitTabStatus ({ commit }, status) {
    commit('SET_INIT_TAB_STATUS', status)
  },
  setTabTitle ({ commit }, title) {
    commit('SET_TAB_TITLE', title)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
