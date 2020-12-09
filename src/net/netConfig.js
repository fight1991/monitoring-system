import axios from 'axios'
import interceptors from './interceptors'
import storage from '@/util/storage'
import store from '@/store'
import { startLoading, closeLoading } from '@/util'
let {
  onRequestResolve,
  onRequestReject,
  onResponseResolve,
  onResponseReject
} = interceptors

const BaseURL = location.origin
/* eslint-disable */
// axios构造实例类
class InitAxios {
  constructor (baseURL) {
    this.instance = axios.create({
      // 开发环境中以/api开头的接口需要设置代理
      baseURL: process.env.NODE_ENV === 'development' ? '/api' : baseURL,
      timeout: 15000
    })
    this.instance.interceptors.request.use(onRequestResolve, onRequestReject)
    this.instance.interceptors.response.use(onResponseResolve, onResponseReject)
  }
}
// 配置get/post等请求实例
const Fetch_COMMON = new InitAxios(BaseURL)['instance']
const Fetch_UPLOAD = new InitAxios(BaseURL)['instance']
class SetInstance {
  get (url, data) {
    return Fetch_COMMON['get'](url, { params: data })
  }
  post (url, data) {
    return Fetch_COMMON['post'](url, data)
  }
  upload (url, data) {
    return Fetch_UPLOAD['post'](url, data, { headers: { 'Content-Type': 'multipart/form-data' } })
  }
}
// 封装get/post等请求方法
export class CommonFetch {
  constructor (methodType) {
    this.methodType = methodType
  }
  async requestFunc ({ url, data, isLoad, checkParams, globalLoading }) {
    // 无论resolve还是reject都返回一个结果
    let tabId = store.state.tab.currentTab
    let loadingStatus = globalLoading || store.state.isGlobalLoading
    try {
      if (checkParams) { // 检查本地是否有缓存
        if (storage.getStorage(checkParams)) {
          return { result: storage.getStorage(checkParams) }
        }
      }
      isLoad && startLoading(store, tabId, loadingStatus)
      let ajax = new SetInstance()[this.methodType]
      let res = await ajax(url, data)
      isLoad && closeLoading(store, tabId, loadingStatus)
      if (res.errno === store.state.successCode) {
        checkParams && storage.setStorage(checkParams, res.result)
        return { result: res.result || true }
      }
      return { other: res }
    } catch (err) {
      isLoad && closeLoading(store, tabId, loadingStatus)
      return { error: err }
    }
  }
}
// 处理一次性批量请求
export class AllFetch {
  /**
   * @param {*params} 数组中的每一项需为promise对象
   */
  async requestFunc (isLoad, globalLoading) {
    let res = null
    let tabId = store.state.tab.currentTab
    let loadingStatus = globalLoading || store.state.isGlobalLoading
    try {
      isLoad && startLoading(store, tabId, loadingStatus)
      res = await Promise.all(this.params)
      isLoad && closeLoading(store, tabId, loadingStatus)
      return res
    } catch (err) {
      isLoad && closeLoading(store, tabId, loadingStatus)
      return false
    }
  }
}
