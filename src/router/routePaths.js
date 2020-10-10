import Error from '@/views/error'
import Login from '@/views/login'
import Inverter from '@/views/inverter'
import BusinessRouter from '@/views/pages'
import Qrcode from '@/views/qrcode'
import User from '@/views/user'

const Main = () => import(/* webpackChunkName: "bus-main" */ '../views/main.vue')

const routes = [
  {
    path: '/',
    redirect: '/bus/index'
  }, {
    path: '*',
    redirect: {
      name: 'error-404'
    }
  }, {
    path: '/bus/index',
    name: 'bus-index',
    component: Main,
    children: [...BusinessRouter]
  }
]

routes.push(...Error)
routes.push(...Inverter)
routes.push(...Qrcode)
routes.push(...Login)
routes.push(...User)

export default routes
