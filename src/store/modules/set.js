const state = {
  primaryColor: '', // 系统主题色
  tabIsOpen: '' // 是否开启tab模式
}
const mutations = {
  setPrimaryColor (state, payload) {
    state.primaryColor = payload
  },
  switchTabStatus (state, payload) {
    state.tabIsOpen = payload
  }
}
export default {
  // namespaced: true,
  state,
  mutations
}
