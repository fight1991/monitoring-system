import Vuex from 'vuex'
const language = process.env.VUE_APP_VERSION === 'abroad' ? 'en' : 'zh_CN'
const domainName = process.env.NODE_ENV === 'development' ? process.env.VUE_APP_API : location.origin
// 一次性导入所有modules
const modulesFiles = require.context('./modules', true, /\.js$/)
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // './set.js' => set
  let moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  let value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

const state = {
  rightsTxt: `Copyright ©${new Date().getFullYear()} `,
  version: process.env.VUE_APP_VERSION, // app版本 国外版, 国内版
  tableH: 330, // 表格高度
  successCode: 0, // 业务成功状态码
  isFirst: true, // 是否第一次进入系统
  hasErrorInfo: false, // 是否已存储错误列表
  lang: language, // 语言
  collapse: false, // 是否折叠
  loadingNum: 0, // 全局loading数量计数, 防止一个请求没有回来被另一个请求关掉了
  tabView: true, // 是否开启页签模式
  isGlobalLoading: false, // 是否进入后台管理(business)页面, 是的话设置适当的loading范围
  domainName, // 根据访问地址动态得到域名
  pagination: {
    pageSize: 10,
    currentPage: 1,
    total: 0
  },
  access: -1, // 0 游客， 1 终端用户 ，2 安装商 3 代理商 ，255 厂商
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
  },
  errorInfo: {}
}
const getters = {
  isLoading (state) {
    return state.loadingNum > 0
  }
}
const mutations = {
  changeLoading (state, res) {
    res ? state.loadingNum++ : state.loadingNum--
    if (state.loadingNum < 0) {
      state.loadingNum = 0
    }
  },
  changeLoadingStatus (state, type) {
    state.isGlobalLoading = type
  },
  changeCollapse (state, status) {
    if (status) {
      state.collapse = (status === 1)
    } else {
      state.collapse = !state.collapse
    }
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
  },
  getErrorInfo (state, errorInfo) {
    state.errorInfo = errorInfo
  },
  changeErrorStatus (state, status) {
    state.hasErrorInfo = status
  }
}
const actions = {}
export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions,
  modules
})
