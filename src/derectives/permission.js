import storage from '@/util/storage'
function checkMenuCode (val) {
  let userMenuCodes = storage.getLoginUserMenus()
  return userMenuCodes.includes(val)
}
export default {
  // install(Vue) {
  //   Vue.directive('permissions', {
  //     inserted: (el, binding) => {
  //       if (!checkMenuCode(binding.value)) {
  //         el.style.display = 'none'
  //       }
  //     }
  //   })
  // },
  inserted: (el, binding) => {
    if (!checkMenuCode(binding.value)) {
      el.style.display = 'none'
    }
  }
}
