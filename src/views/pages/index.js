import DataView from './dataView'
import Plant from './plant'
import Device from './device'
import Version from './version'
import DataReport from './dataReport'
import Alarm from './alarm'
import Factory from './factory'
import AfterSale from './afterSale'
import Upgrade from './upgrade'
import Message from './message'
import Relog from './relog'
const Home = {
  path: '/bus/index',
  hidden: true,
  name: 'tab-index',
  meta: {
    permission: [1, 2, 3],
    title: 'home',
    component: () => import(/* webpackChunkName: "home" */ '@/views/pages/home')
  }
}
export default [
  Home,
  DataView,
  Plant,
  Device,
  Version,
  DataReport,
  Alarm,
  Factory,
  AfterSale,
  Upgrade,
  Message,
  Relog
]
