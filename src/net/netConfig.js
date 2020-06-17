import axios from 'axios'
import interceptors from './interceptors'
import { startLoading, closeLoading } from '@/util'
let {
  onRequestResolve,
  onRequestReject,
  onResponseResolve,
  onResponseReject
} = interceptors

export class MethodBase {
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
export class MethodAll {
  constructor (params) {
    this.params = params
  }
  async $all (store, isLoad) {
    let res = null
    let tabId = store.state.tab.currentTab
    try {
      isLoad && startLoading(store, tabId)
      res = await Promise.all(this.params)
      isLoad && closeLoading(store, tabId)
      return res
    } catch (err) {
      isLoad && closeLoading(store, tabId)
      return false
    }
  }
}
