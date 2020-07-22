// import Echart from './global/echart'
import Pagination from './global/pagination'
import SearchBar from './global/searchBar'
import FuncBar from './global/funcBar'
// import CommonTable from './global/commonTable'

const Echart = () => import(/* webpackChunkName: "echarts" */ './global/echart')
const CommonTable = () => import(/* webpackChunkName: "common-table" */ './global/commonTable')

const GMap = () => import(/* webpackChunkName: "google-map" */ './global/gMap')
const AMap = () => import(/* webpackChunkName: "gaode-map" */ './global/aMap')

export default {
  install (Vue) {
    Vue.component('el-echart', Echart)
    Vue.component('page-box', Pagination)
    Vue.component('search-bar', SearchBar)
    Vue.component('func-bar', FuncBar)
    Vue.component('common-table', CommonTable)
    Vue.component('gMap', GMap)
    Vue.component('aMap', AMap)
  }
}
