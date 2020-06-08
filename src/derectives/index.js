import permission from './permission'
import lessTime from './lessTime'
import setH from './setH'
export default {
  install (Vue) {
    Vue.directive('time', lessTime)
    Vue.directive('permission', permission)
    Vue.directive('setH', setH)
  }
}
