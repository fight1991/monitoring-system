import SparkMD5 from 'spark-md5'
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
// 得到文件的md5值
export async function getFileMd5 (file) {
  const fileSize = file.size // 文件大小
  const chunkSize = 1024 * 1024 * 10 // 切片的大小
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
      console.log(`第${currentChunk}分片解析完成, 开始第${currentChunk + 1}分片解析`)
    } else {
      const md5 = spark.end()
      return md5
    }
  }
  const loadNext = () => {
    const start = currentChunk * chunkSize
    const end = start + chunkSize > file.size ? file.size : start + chunkSize
    fileReader.readAsArrayBuffer(bolbSlice.call(file, start, end))
  }
  loadNext()
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
// 编码解码
export function encodeData (obj) {
  return encodeURIComponent(JSON.stringify(obj))
}
export function decodeData (obj) {
  return JSON.parse(decodeURIComponent(obj))
}
