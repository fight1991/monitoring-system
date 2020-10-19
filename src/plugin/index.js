import { MessageBox } from 'element-ui'
import i18n from '@/i18n'
export function openConfirm (tip1, text = '') {
  return MessageBox.confirm(i18n.t(tip1) + text, i18n.t('common.tip'), {
    confirmButtonText: this.$t('common.confirm'),
    cancelButtonText: this.$t('common.cancel'),
    type: 'warning'
  }).then(() => true).catch(() => false)
}

export default {
  install (Vue) {
    Vue.prototype.$openConfirm = openConfirm
  }
}
