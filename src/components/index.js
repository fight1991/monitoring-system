// import Echart from './global/echart'
import Pagination from './global/pagination'
import SearchBar from './global/searchBar'
import FuncBar from './global/funcBar'

/**
 * 以懒加载的方式加载如下组件
 * 注意: 许多嵌套的懒加载组件，那么网页中的元素会分先后渲染，层次不齐
 */
const Echart = () => import(/* webpackChunkName: "echarts" */ './global/echart')
const CommonTable = () => import(/* webpackChunkName: "common-table" */ './global/commonTable')

export default {
  install (Vue) {
    Vue.component('el-echart', Echart)
    Vue.component('page-box', Pagination)
    Vue.component('search-bar', SearchBar)
    Vue.component('func-bar', FuncBar)
    Vue.component('common-table', CommonTable)
  }
}
