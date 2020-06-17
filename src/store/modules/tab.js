import router from '@/router'
let Home = () => import(/* webpackChunkName: "home" */ '@/views/pages/home')
export default {
  state: {
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
  },
  getters: {
    currentTabInfo (state) {
      return state.tabList.find(v => v.tabId === state.currentTab)
    }
  },
  mutations: {
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
        router.push({
          name,
          query,
          params
        })
      }
    }
  },
  actions: {
    // 设置当前组件的loading
    setCurrentTabLoading ({ state }, { tabId, flag }) {
      let comp = state.tabList.find(v => v.tabId === tabId)
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
    }
  }
}
