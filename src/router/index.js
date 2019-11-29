import Vue from 'vue'
import Router from 'vue-router'

// 导入登录组件
// import Login from '@/components/Login'
const Login = () => import(/* webpackChunkName: "group-home" */ '@/components/Login')
// 导入 后台首页组件
// import Home from '@/components/Home'
const Home = () => import(/* webpackChunkName: "group-home" */ '@/components/Home')
// 导入 欢迎组件
// import Welcome from '@/components/Welcome'
const Welcome = () => import(/* webpackChunkName: "group-home" */ '@/components/Welcome')

// 导入 用户管理组件
// import Users from '@/components/user/Users'
const Users = () => import(/* webpackChunkName: "group-user" */ '@/components/user/Users')
// 导入 权限列表组件
// import Rights from '@/components/power/Rights'
const Rights = () => import(/* webpackChunkName: "group-user" */ '@/components/power/Rights')
// 导入 角色列表组件
// import Roles from '@/components/power/Roles'
const Roles = () => import(/* webpackChunkName: "group-user" */ '@/components/power/Roles')

// 导入 商品分类组件
// import Category from '@/components/goods/Category'
const Category = () => import(/* webpackChunkName: "group-cate_params" */ '@/components/goods/Category')
// 导入 商品参数组件
// import Params from '@/components/goods/Params'
const Params = () => import(/* webpackChunkName: "group-cate_params" */ '@/components/goods/Params')

// 导入 商品容器组件
// import GoodsContainer from '@/components/goods/GoodsContainer'
const GoodsContainer = () => import(/* webpackChunkName: "group-goods" */ '@/components/goods/GoodsContainer')
// 导入 商品列表组件
// import GoodsList from '@/components/goods/List'
const GoodsList = () => import(/* webpackChunkName: "group-goods" */ '@/components/goods/List')
// 导入 商品添加组件
// import GoodsAdd from '@/components/goods/Add'
const GoodsAdd = () => import(/* webpackChunkName: "group-goods" */ '@/components/goods/Add')

// 导入 订单组件
// import Order from '@/components/order/Order'
const Order = () => import(/* webpackChunkName: "group-order_report" */ '@/components/order/Order')
// 导入 报表组件
// import Report from '@/components/report/Report'
const Report = () => import(/* webpackChunkName: "group-order_report" */ '@/components/report/Report')

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login' // 如果用户访问的 / 根路径，则 重定向到 /login 页面
    },
    {
      path: '/login',
      component: Login
    }, // 登录页面的路由规则
    {
      path: '/home',
      component: Home,
      redirect: '/welcome', // 只要进入了 home 页面，就立即重定向到 welcome 欢迎页
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Category },
        { path: '/params', component: Params },
        {
          path: '/goods',
          component: GoodsContainer,
          redirect: '/goods/list',
          children: [
            { path: '/goods/list', component: GoodsList },
            { path: '/goods/add', component: GoodsAdd }
          ]
        },
        { path: '/orders', component: Order },
        { path: '/reports', component: Report }
      ]
    } // 后台主页的路由规则
  ]
})

// 路由导航守卫的语法   router对象.beforeEach((to, from, next) => {})
router.beforeEach((to, from, next) => {
  // 如果用户访问的是 登录页面，则直接放行
  if (to.path === '/login') return next()
  // 获取 token
  const tokenStr = sessionStorage.getItem('token')
  // 如果 token 存在， 直接放行
  if (tokenStr) return next()
  // 否则，强制跳转到登录页
  next('/login')
})

export default router
