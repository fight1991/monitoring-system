import axios from 'axios'
import interceptors from './interceptors'
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
      timeout: 5000
    })
    this.instance.interceptors.request.use(onRequestResolve, onRequestReject)
    this.instance.interceptors.response.use(onResponseResolve, onResponseReject)
  }
}
export class MethodAll {
  constructor (params) {
    this.params = params
  }
  async $all (store) {
    let res = null
    try {
      store.commit('changeLoading', true)
      res = await Promise.all(this.params)
      store.commit('changeLoading', false)
      return res
    } catch (err) {
      store.commit('changeLoading', false)
      return false
    }
  }
}
