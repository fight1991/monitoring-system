import { MessageBox } from 'element-ui'
import i18n from '@/i18n'
export function openConfirm ({ header = i18n.t('common.tip'), content = 'nothing', type = 'warning', showHeader = true }) {
  let headerTip = showHeader ? header : ''
  return MessageBox.confirm(content, headerTip, {
    confirmButtonText: this.$t('common.confirm'),
    cancelButtonText: this.$t('common.cancel'),
    type
  }).then(() => true).catch(() => false)
}

export default {
  install (Vue) {
    Vue.prototype.$openConfirm = openConfirm
  }
}
