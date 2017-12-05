import { asyncRouterMap, constantRouterMap } from '@/router'

/**
 * 通过meta.perm判断是否与当前用户权限匹配
 * @param perms
 * @param route
 */
function hasPermission(perms, route) {
  console.log(route.meta)

  if (route.meta && route.meta.perm) {
    return perms.split(',').some(perm => route.meta.perm.indexOf(perm) >= 0)
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * filter返回true的元素创建一个新数组
 * @param asyncRouterMap
 * @param perms
 */
function filterAsyncRouter(asyncRouterMap, perms) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(perms, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, perms)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { perms } = data
        console.log(perms)
        let accessedRouters
        if (perms.indexOf('5') >= 0) {
          accessedRouters = asyncRouterMap
        } else {
          accessedRouters = filterAsyncRouter(asyncRouterMap, perms)
        }
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
