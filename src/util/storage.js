import { isJSON } from './index'
export default {
  getLoginUserMenus () {
    return localStorage.getItem('menuCode') || []
  },
  removeStorage (name) {
    localStorage.removeItem(name)
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
  },
  clearSession () {
    sessionStorage.clear()
  }
}
