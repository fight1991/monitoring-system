import SparkMD5 from 'spark-md5'
import Base64 from 'js-base64'
import XLSX from 'xlsx'
/**
 * 日期格式化 yyyy-MM-dd HH:mm:ss
 * @param date
 * @returns {*}
 */
export function formatDate (date, pattern = 'yyyy-MM-dd HH:mm:ss') {
  if (!date) return
  switch (typeof date) {
    case 'string':
      date = new Date(date.replace(/-/, '/'))
      break
    case 'number':
      date = new Date(date)
      break
  }
  if (!(date instanceof Date)) return
  let dict = {
    'yyyy': date.getFullYear(),
    'M': date.getMonth() + 1,
    'd': date.getDate(),
    'H': date.getHours(),
    'm': date.getMinutes(),
    's': date.getSeconds(),
    'MM': ('' + (date.getMonth() + 101)).substr(1),
    'dd': ('' + (date.getDate() + 100)).substr(1),
    'HH': ('' + (date.getHours() + 100)).substr(1),
    'mm': ('' + (date.getMinutes() + 100)).substr(1),
    'ss': ('' + (date.getSeconds() + 100)).substr(1)
  }
  return pattern.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function () {
    return dict[arguments[0]]
  })
}
// 获取N天后的日期
export function getNdayDate (startDay, days) {
  var d = startDay
  var year = d.getFullYear()
  var mon = d.getMonth() + 1
  var day = d.getDate()
  if (day <= days) {
    if (mon > 1) {
      mon = mon - 1
    } else {
      year = year - 1
      mon = 12
    }
  }
  d.setDate(d.getDate() + days)
  year = d.getFullYear()
  mon = d.getMonth() + 1
  day = d.getDate()
  return year + '/' + (mon < 10 ? ('0' + mon) : mon) + '/' + (day < 10 ? ('0' + day) : day)
}
/**
 * 金额格式化
 * @param value 要格式化的数字
 * @param currency 货币前缀 默认''
 * @param  decimals 保留几位小数 默认2
 * @param  unit 单位 默认''
 * @returns {string}
 */
const digitsRE = /(\d{3})(?=\d)/g
export function formatCurrency (value, decimals = 2, currency = '', unit = '') {
  value = parseFloat(value)
  if (!isFinite(value) || (!value && value !== 0)) return ''
  var stringified = Math.abs(value).toFixed(decimals)
  var _int = decimals ? stringified.slice(0, -1 - decimals) : stringified
  var i = _int.length % 3
  var head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? ',' : '') : ''
  var _float = decimals ? stringified.slice(-1 - decimals) : ''
  var sign = value < 0 ? '-' : ''
  return (
    sign +
    currency +
    head +
    _int.slice(i).replace(digitsRE, '$1,') +
    _float +
    unit
  )
}
// 判断是否是json格式的字符串
export function isJSON (str) {
  if (typeof str === 'string') {
    try {
      var obj = JSON.parse(str)
      if (typeof obj === 'object' && obj) {
        return true
      } else {
        return false
      }
    } catch (e) {
      return false
    }
  } else {
    return false
  }
}
// 响应200时 业务状态码处理
export function bussinessBundle (res, other, success, store) {
  if (res.errno === store.state.successCode) {
    success && success(res)
    return
  }
  if (other) {
    other(res)
  }
}

// 开启loading
export function startLoading (store, tabId, globalLoading) {
  // 页签组件的loading
  if (store.state.tab.currentTab !== 'tab-index' && !globalLoading) {
    store.dispatch('setCurrentTabLoading', { tabId, flag: true })
  } else {
  // 全局loading
    store.commit('changeLoading', true)
  }
}
// 关闭loading
export function closeLoading (store, tabId, globalLoading) {
  // 页签组件的loading
  if (store.state.tab.currentTab !== 'tab-index' && !globalLoading) {
    store.dispatch('setCurrentTabLoading', { tabId, flag: false })
  } else {
  // 全局loading
    store.commit('changeLoading', false)
  }
}

// 得到文件的md5值
export function getFileMd5 (file) {
  return new Promise((resolve, reject) => {
    const fileSize = file.size // 文件大小
    const chunkSize = 1024 * 1024 * 2 // 切片的大小2MB
    const chunks = Math.ceil(fileSize / chunkSize) // 获取切片个数
    const fileReader = new FileReader()
    const spark = new SparkMD5.ArrayBuffer()
    const bolbSlice =
        File.prototype.slice ||
        File.prototype.mozSlice ||
        File.prototype.webkitSlice
    let currentChunk = 0

    fileReader.onload = e => {
      const res = e.target.result
      spark.append(res)
      currentChunk++
      if (currentChunk < chunks) {
        loadNext()
      } else {
        const md5 = spark.end()
        resolve(md5)
      }
    }
    const loadNext = () => {
      const start = currentChunk * chunkSize
      const end = start + chunkSize > file.size ? file.size : start + chunkSize
      fileReader.readAsArrayBuffer(bolbSlice.call(file, start, end))
    }
    loadNext()
  })
}
// 获取文件base64编码
export async function getFileBase64 (file) {
  let reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = e => {
    let res = e.target.result
    return res
  }
}
// url编码解码
export function encodeData (obj) {
  return encodeURIComponent(JSON.stringify(obj))
}
export function decodeData (obj) {
  return JSON.parse(decodeURIComponent(obj))
}
// base64编码/解码
export const base64 = {
  encode: function (params) {
    return Base64.Base64.encode(params)
  },
  decode: function (params) {
    return Base64.Base64.decode(params)
  }
}
// 判断终端
export function judgeClient () {
  let u = navigator.userAgent
  let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // 判断是否是 android终端
  let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // 判断是否是 iOS终端
  if (isAndroid) {
    return 'android'
  } else if (isIOS) {
    return 'ios'
  } else {
    return 'pc'
  }
}
// 判断是否是微信打开的
export function isWeiXin () {
  let ua = window.navigator.userAgent.toLowerCase()
  if (ua.indexOf('micromessenger') > -1) {
    return true // 是微信端
  } else {
    return false
  }
}
/**
 * @description: 导入excel文件并返回数据
 * @param {*}: file为文件对象
 * @return: 返回json数据
 */
export function readExcel (file, callback) {
  try {
    const reader = new FileReader()
    reader.readAsBinaryString(file)
    reader.onload = function () {
      let res = this.result
      // 以二进制流方式读取得到整份excel表格对象
      let workbook = XLSX.read(res, {
        type: 'binary'
      })
      // 存储获取到的数据
      let buildings = []
      // 遍历每张表读取
      for (var sheet in workbook.Sheets) {
        if (workbook.Sheets.hasOwnProperty(sheet)) {
          buildings = buildings.concat(XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet], { header: 1 }))
          break // 只取第一张sheet表
        }
      }
      callback && callback(buildings)
    }
  } catch (err) {
    callback && callback(null)
  }
}
/**
 * @description: 将带时区的字符串转换成时间戳(以后可用时间工具库)
 */
export function getTimespan (time) {
  // 解决Date.parse在火狐浏览器中解析yyyy-MM-dd日期格式时返回NaN
  // edge浏览器中解析不了带时区的
  let tempArr = time.split(' ')
  let timeStr = tempArr.slice(0, 2).join()
  let res = Date.parse(timeStr.replace('-', '/').replace('-', '/'))
  return res
}
// 深拷贝
export function deepCopy (obj) {
  return JSON.parse(JSON.stringify(obj))
}
// 语言环境配置
export function getLang () {
  return {
    display: {
      en: 'English',
      zh_CN: '中文',
      pl: 'Polskie'
    },
    transform: {
      en: 'en',
      zh_CN: 'zh',
      pl: 'pl'
    }
  }
}
// 角色key
export function translateRole (access) {
  switch (access) {
    case 1:
      return 'join.endUser'
    case 2:
      return 'join.installer'
    case 3:
      return 'join.agent'
    default:
      return 'join.admin'
  }
}
