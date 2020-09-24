
import store from '@/store'
import storage from '@/util/storage'
import { bussinessBundle, startLoading, closeLoading } from '@/util'
import { MethodBase, MethodAll } from './netConfig'
let { instance: commonInstance } = new MethodBase(process.env.VUE_APP_API)
let { instance: upLoadInstance } = new MethodBase(process.env.VUE_APP_FILE)

const requests = {
  // 返回 promise
  async $axios ({ url, data = {}, method = 'get', isLoad = true, checkParams }) {
    let params = method === 'get' ? { params: data } : data
    // 无论resolve还是reject都返回一个结果
    let tabId = store.state.tab.currentTab
    let globalLoading = store.state.isGlobalLoading
    try {
      if (checkParams) { // 检查本地是否有缓存
        if (storage.getStorage(checkParams)) {
          return { result: storage.getStorage(checkParams) }
        }
      }
      isLoad && startLoading(store, tabId, globalLoading)
      let res = await commonInstance[method](url, params)
      isLoad && closeLoading(store, tabId, globalLoading)
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
  },
  // 多个并发请求
  $all: {
    promise (promiseArr, isLoad = true) { // 入参为promise对象,处理并发请求 async修饰的函数返回promise
      let globalLoading = store.state.isGlobalLoading
      return new MethodAll(promiseArr).$all(store, isLoad, globalLoading)
    },
    url (urlArr, isLoad = true) {
      let globalLoading = store.state.isGlobalLoading
      return new MethodAll(urlArr.map(v => commonInstance.get(v))).$all(store, isLoad, globalLoading)
    }
  },
  // 自定义请求
  $get ({ url, data = {}, success, other, error, isLoad = true }) {
    let tabId = store.state.tab.currentTab
    let globalLoading = store.state.isGlobalLoading
    isLoad && startLoading(store, tabId, globalLoading)
    commonInstance.get(url, {
      params: data
    }).then(res => {
      bussinessBundle(res, other, success, store)
    }).catch(err => {
      if (process.env.NODE_ENV === 'development') console.log('api is ' + url, err)
      error && error(err)
    }).finally(() => {
      isLoad && closeLoading(store, tabId, globalLoading)
    })
  },
  $post ({ url, data = {}, success, other, error, isLoad = true }) {
    let tabId = store.state.tab.currentTab
    let globalLoading = store.state.isGlobalLoading
    isLoad && startLoading(store, tabId, globalLoading)
    commonInstance.post(url, data)
      .then(res => {
        bussinessBundle(res, other, success, store)
      })
      .catch(err => {
        if (process.env.NODE_ENV === 'development') console.log('api is ' + url, err)
        error && error(err)
      })
      .finally(() => {
        isLoad && closeLoading(store, tabId, globalLoading)
      })
  },
  $upload ({ url, data = {}, success, error, isLoad = true }) {
    let tabId = store.state.tab.currentTab
    let globalLoading = store.state.isGlobalLoading
    isLoad && startLoading(store, tabId, globalLoading)
    upLoadInstance.post(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(res => {
      success && success(res)
    }).catch(err => {
      error && error(err)
    }).finally(() => {
      isLoad && closeLoading(store, tabId, globalLoading)
    })
  }
}

export default {
  install (Vue) {
    Object.keys(requests).forEach(key => {
      Vue.prototype[key] = requests[key]
    })
  }
}
