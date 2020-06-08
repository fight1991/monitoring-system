import { isJSON } from './index'
export default {
  getLoginUserMenus () {
    return localStorage.getItem('menuCode') || []
  },
  removeToken () {
    localStorage.removeItem('token')
  },
  setToken (token) {
    localStorage.setItem('token', token)
  },
  getToken () {
    return localStorage.getItem('token') || ''
  },
  removeLoginInfo () {
    localStorage.removeItem('username')
    localStorage.removeItem('email')
    localStorage.removeItem('phone')
  },
  setUserInfo (userInfo) {
    userInfo.name && localStorage.setItem('username', userInfo.name)
    userInfo.email && localStorage.setItem('email', userInfo.email)
    userInfo.phone && localStorage.setItem('phone', userInfo.phone)
  },
  getUserInfo (item) {
    return localStorage.getItem(item) || ''
  },
  setStorage (key, value) {
    if (typeof value === 'object') {
      localStorage.setItem(key, JSON.stringify(value))
    } else {
      localStorage.setItem(key, value)
    }
  },
  getStorage (key) {
    let res = localStorage.getItem(key)
    if (isJSON(res)) {
      return JSON.parse(res)
    }
    return res
  }
}
