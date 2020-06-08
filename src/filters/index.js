import {
  formatDate as formatDateTime,
  formatCurrency as formatCurrencyM
} from '@/util'
/**
 * formatDate
 * 日期格式化 yyyy-MM-dd
 * @param date
 * @returns {*}
 */
/**
 * formatCurrency
 * 金额格式化
 * @param value 要格式化的数字
 * @param currency 货币前缀 默认""
 * @param  decimals 保留几位小数 默认2
 * @param  unit 单位 默认""
 * @returns {string}
 */
const filters = {
  formatDate (date, pattern = 'yyyy-MM-dd HH:mm:ss') {
    return formatDateTime(date, pattern)
  },
  formatCurrency (value, decimals = 2, currency = '', unit = '') {
    return formatCurrencyM(value, decimals, currency, unit)
  }
}

export default {
  install (Vue) {
    Object.keys(filters).forEach(key => Vue.filter(key, filters[key]))
  }
}
