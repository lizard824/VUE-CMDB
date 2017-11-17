import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading

/* layout */
import Layout from '../views/layout/Layout'

/* login */
const Login = _import('login/index')

/* dashboard */
const dashboard = _import('dashboard/index')

/* error page */
const Err404 = _import('404')


/* demo page */
const Form = _import('page/form')
const User = _import('users/user')
const DeviceAssets = _import('devices/assets')
// const DeviceApp = _import('devices/app')
const VmAssets = _import('vm/assets')
const VmApp = _import('vm/app')
const Ips = _import('ips/ips')
const Ip = _import('ips/ip')
const Idc = _import('idc/idc')


Vue.use(Router)

/**
 * icon : the icon show in the sidebar
 * hidden : if `hidden:true` will not show in the sidebar
 * redirect : if `redirect:noredirect` will not redirct in the levelbar
 * noDropdown : if `noDropdown:true` will not has submenu in the sidebar
 * meta : `{ role: ['admin'] }`  will control the page role
 **/
export const constantRouterMap = [
  { path: '/login', component: Login, hidden: true },
  { path: '/404', component: Err404, hidden: true },


  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Home',
    hidden: true,
    children: [{ path: 'dashboard', component: dashboard }]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/introduction',
    component: Layout,
    redirect: 'noredirect',
    icon: 'zonghe',
    noDropdown:true,
    children: [
      { path: 'intro', component: Form, name: '介绍' }
    ]
  },
  {
    path: '/devices',
    component: Layout,
    redirect:'noredirect',
    name:'资产信息',
    icon: 'zujian',
    children:[
      {path:'assetDevice', component: DeviceAssets, name: '物理资产'},
      {path:'assetVm', component: VmAssets, name:'虚拟资产'}
    ]
  },
  {
    path: '/apps',
    component: Layout,
    redirect:'/apps/app',
    noDropdown:true,
    icon: 'zujian',
    children:[
      {path:'app', component: VmApp, name:'应用信息'}
    ]
  },
  {
    path: '/ips',
    component: Layout,
    redirect:'noredirect',
    name:'IP地址',
    icon: 'zujian',
    children:[
      {path:'ips', component: Ips, name: 'IP地址段管理'},
      {path:'ip', component: Ip, name:'IP地址管理'}
    ]
  },
  {
    path:'/idcs',
    component:Layout,
    redirect: '/idcs/idc',
    icon:'zujian',
    noDropdown: true,
    children: [{ path: 'idc', component:Idc, name: '机房管理'}]
  },


  {
    path:'/users',
    component:Layout,
    redirect: '/users/user',
    icon:'yonghuming',
    noDropdown: true,
    children: [{ path: 'user', component:User, name: '用户管理', meta:{role:['admin']}}]
  },

  { path: '*', redirect: '/404', hidden: true }
]
