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
// 处理所有请求类
export class AllFetch {
  constructor (params) {
    this.params = params
  }
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
// 得到get/post等请求实例
export class CommonFetch {
  constructor (methodType) {
    console.log(methodType)
    this.methodType = methodType
  }
  async requestFunc ({ url, data, isLoad, checkParams, globalLoading }) {
    // 设置入参
    console.log(this)
    let params = this.methodType === 'get' ? { params: data } : data
    // 设置请求类型
    let method = this.methodType === 'get' ? 'get' : 'post'
    // 如果是上传文件 重新配置header选项和服务器地址
    let config = {
      headerOptions: this.methodType === 'upload' ? { headers: { 'Content-Type': 'multipart/form-data' } } : {},
      serverUrl: this.methodType === 'upload' ? process.env.VUE_APP_FILE : process.env.VUE_APP_API
    }
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
      let { instance } = new InitAxios(config.serverUrl)
      let res = await instance[method](url, params, config.headerOptions)
      isLoad && closeLoading(store, tabId, loadingStatus)
      if (res.errno === store.state.successCode) {
        checkParams && storage.setStorage(checkParams, res.result)
        return { result: res.result || true }
      }
      return { other: res }
    } catch (err) {
      // console.log(err)
      isLoad && isLoad && closeLoading(store, tabId)
      return { error: err }
    }
  }
}
