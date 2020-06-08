import store from '@/store'
import VueI18n from 'vue-i18n'
import Vue from 'vue'
import ELEMENT from 'element-ui'

// import enLocale from 'element-ui/lib/locale/lang/en'
// import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

import en from './lang/en'
import zh from './lang/zh'

const messages = {
  en: {
    ...en,
    ...ELEMENT.lang.en
  },
  zh: {
    ...zh,
    ...ELEMENT.lang.zhCN
  }
}
const i18n = new VueI18n({
  // missing: function () {},
  silentTranslationWarn: true,
  locale: store.state.lang, // set locale
  messages // set locale messages
})

Vue.use(ELEMENT, {
  i18n: (key, value) => i18n.t(key, value)
})

export default i18n
// export default {
//   install (Vue) {
//     Vue.config.lang = store.state.lang
//     Vue.config.missingHandler = function () {} // 关闭告警
//     Vue.prototype.$switchLang = function (lang) {
//       this.config.lang = lang
//       store.commit('toggleLang', lang)
//     }.bind(Vue)
//     Object.keys(langs).forEach(key => Vue.locale(key, langs[key]))
//   }
// }
