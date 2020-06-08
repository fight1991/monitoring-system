
import store from '@/store'
import storage from '@/util/storage'
import { MethodBase, MethodAll } from './netConfig'
let { instance: commonInstance } = new MethodBase(process.env.VUE_APP_API)
let { instance: upLoadInstance } = new MethodBase(process.env.VUE_APP_FILE)

const requests = {
  // 返回 promise
  async $axios ({ url, data = {}, method = 'get', isLoad = true, checkParams }) {
    let params = method === 'get' ? { params: data } : data
    // 无论resolve还是reject都返回一个结果
    try {
      if (checkParams) { // 检查本地是否有缓存
        if (storage.getStorage(checkParams)) {
          return { result: storage.getStorage(checkParams) }
        }
      }
      isLoad && store.commit('changeLoading', true)
      let res = await commonInstance[method](url, params)
      isLoad && store.commit('changeLoading', false)
      if (res.errno === store.state.successCode) {
        checkParams && storage.setStorage(checkParams, res.result)
        return { result: res.result }
      }
      return { other: res.result }
    } catch (err) {
      // console.log(err)
      if (isLoad) store.commit('changeLoading', false)
      return { error: err }
    }
  },
  // 多个并发请求
  $all: {
    promise (promiseArr) { // 入参为promise对象,处理并发请求 async修饰的函数返回promise
      return new MethodAll(promiseArr).$all(store)
    },
    url (urlArr) {
      return new MethodAll(urlArr).$all(store)
    }
  },
  // 自定义请求
  $get ({ url, data = {}, success, other, error, isLoad = true }) {
    if (isLoad) store.commit('changeLoading', true)
    commonInstance.get(url, {
      params: data
    }).then(res => {
      bussinessBundle(res, other, success)
    }).catch(err => {
      if (process.env.NODE_ENV === 'development') console.log('api is ' + url, err)
      error && error(err)
    }).finally(() => {
      store.commit('changeLoading', false)
    })
  },
  $post ({ url, data = {}, success, other, error, isLoad = true }) {
    if (isLoad) store.commit('changeLoading', true)
    commonInstance.post(url, data)
      .then(res => {
        bussinessBundle(res, other, success)
      })
      .catch(err => {
        if (process.env.NODE_ENV === 'development') console.log('api is ' + url, err)
        error && error(err)
      })
      .finally(() => {
        store.commit('changeLoading', false)
      })
  },
  $upload ({ url, data = {}, success, error, isLoad = true }) {
    if (isLoad) store.commit('changeLoading', true)
    upLoadInstance.post(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(res => {
      success && success(res)
    }).catch(err => {
      error && error(err)
    }).finally(() => {
      store.commit('changeLoading', false)
    })
  }
}
// 响应200时 业务状态码处理
function bussinessBundle (res, other, success) {
  if (res.errno === store.state.successCode) {
    success && success(res)
    return
  }
  if (other) {
    other(res)
  }
}

export default {
  install (Vue) {
    Object.keys(requests).forEach(key => {
      Vue.prototype[key] = requests[key]
    })
  }
}
