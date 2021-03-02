import { asyncRoutes, constantRoutes } from '@/router'
import { get } from '@/utils/request'
import { filter } from 'minimatch';


/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(idList, route) {
  if (route.meta && route.meta.id) {
    return idList.indexOf(route.meta.id) !== -1
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, list) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(list, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, list)
      }
      res.push(tmp)
    }
  })

  return res
}

function addComponent(routes) {
  var newRoutes = routes.map(route => {
    console.log(route["component"])
    if (route.component) {
      route.component = components[route.component]
    }
    if (route.children) {
      route.children = addComponent(route.children)
    }
    return route
  })
  return newRoutes
}

const getDefaultState = () => {
  return {
    routes: [...constantRoutes],
    addRoutes: [],
    idList: ''
  }
}

/* const state = {
  routes: [...constantRoutes],
  addRoutes: [],
  idList: ''
} */
const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_IDLIST: (state, params) => {
    state.idList = [...params]
  }
}

const actions = {
  getPermission({ commit }, role) {
    return new Promise((resolve, reject) => {
      get('/api/user/permission', {role}).then(response => {
        console.log(response)
        const data = response
        console.log(data.permission)
        commit('SET_IDLIST', data.permission)
        resolve(data.permission)
      }).catch(error => {
        reject(error)
      })
    })
  },
  generateRoutes({ commit }, getRoutes) {
    return new Promise(resolve => {
      let accessedRoutes
      // accessedRoutes = addComponent(getRoutes)
      accessedRoutes = filterAsyncRoutes(asyncRoutes, getRoutes)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
  resetPermission({commit}) {
    commit('RESET_STATE')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
