import Vuex from 'vuex'
import tab from './modules/tab' // 页签管理模块
import socket from './modules/socketState' // websocket连接状态
export default new Vuex.Store({
  state: {
    rightsTxt: 'Copyright © 2010-2020 FoxESS . ',
    tableH: 320, // 表格高度
    successCode: 0, // 业务成功状态码
    isFirst: true, // 是否第一次进入系统
    lang: 'zh', // 语言
    collapse: false, // 是否折叠
    loading: false,
    tabView: true, // 是否开启页签模式
    pagination: {
      pageSize: 10,
      currentPage: 1,
      total: 0
    },
    access: 0, // 0 游客， 1 终端用户 ，2 安装商 3 代理商 ，255 厂商
    username: '',
    userInfo: {
      user: '', // 当前登录的用户名
      name: '',
      phone: '',
      email: '',
      country: '',
      address: '',
      postcode: '',
      introduction: '',
      note: ''
    }
  },
  mutations: {
    changeLoading (state, res) {
      state.loading = res
    },
    changeCollapse (state) {
      state.collapse = !state.collapse
    },
    toggleLang (state, payLoad) {
      state.lang = payLoad
    },
    setAccess (state, payLoad) { // 用户权限
      state.access = payLoad
    },
    setUserInfo (state, payLoad) {
      state.userInfo.user = payLoad.user
      state.userInfo.name = payLoad.name || ''
      state.userInfo.phone = payLoad.phone || ''
      state.userInfo.email = payLoad.email || ''
      state.userInfo.country = payLoad.country || ''
      state.userInfo.address = payLoad.address || ''
      state.userInfo.postcode = payLoad.postcode || ''
      state.userInfo.introduction = payLoad.introduction || ''
      state.userInfo.note = payLoad.note || ''
    },
    setUsername (state, payLoad) {
      state.username = payLoad
    },
    changeFirst (state, payLoad) {
      state.isFirst = payLoad
    }
  },
  actions: {
  },
  modules: {
    tab,
    socket
  }
})
