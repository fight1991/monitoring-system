
import { CommonFetch, AllFetch } from './netConfig'

let fetchGet = new CommonFetch('get')
let fetchPost = new CommonFetch('post')
let fetchUpload = new CommonFetch('upload')

const requests = {
  $get ({ url, data = {}, isLoad = true, checkParams, globalLoading }) {
    return fetchGet.requestFunc({ url, data, isLoad, checkParams, globalLoading })
  },
  $post ({ url, data = {}, isLoad = true, checkParams, globalLoading }) {
    return fetchPost.requestFunc({ url, data, isLoad, checkParams, globalLoading })
  },
  $upload ({ url, data = {}, isLoad = true, checkParams, globalLoading }) {
    return fetchUpload.requestFunc({ url, data, isLoad, checkParams, globalLoading })
  },
  // 多个并发请求
  $all (promiseArr, isLoad = true, globalLoading) { // 入参为promise对象,处理并发请求 async修饰的函数返回promise
    return new AllFetch(promiseArr).requestFunc(isLoad, globalLoading)
  }
}

export default {
  install (Vue) {
    Object.keys(requests).forEach(key => {
      Vue.prototype[key] = requests[key]
    })
  }
}
