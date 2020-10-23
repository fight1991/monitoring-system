const state = {
  primaryColor: '', // 系统主题色
  tabIsOpen: true // 是否开启tab模式
}
const mutations = {
  setPrimaryColor (state, payload) {
    state.primaryColor = payload
  },
  switchTabStatus (state, payload) {
    state.tabIsOpen = payload
  }
}
const getters = {
  theme (state) {
    return state.primaryColor
  },
  baseHeight (state) {
    return state.tabIsOpen ? 116 : 86
  }
}
export default {
  // namespaced: true,
  state,
  mutations,
  getters
}
