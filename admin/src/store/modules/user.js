import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { post, get } from '@/utils/request'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roles: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      post('/api/user/login', userInfo).then(response => {
        console.log(response)
        const data = response
        commit('SET_TOKEN', data.token)
        commit('SET_ROLES', data.role)
        commit('SET_NAME', data.username)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user register
  register({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      post('/api/user/register', userInfo).then(response => {
        console.log(response)
        const data = response
        commit('SET_TOKEN', data.token)
        commit('SET_ROLES', data.role)
        commit('SET_NAME', data.username)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      get('/api/user/userinfo').then(response => {
        console.log(response)
        const data = response
        commit('SET_TOKEN', data.token)
        commit('SET_ROLES', data.role)
        commit('SET_NAME', data.username)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      get('/api/user/logout').then((res) => {
        console.log(res)
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

