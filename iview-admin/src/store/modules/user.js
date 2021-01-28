import { resetRouter } from '@/router'
import api from '@/api'

const getDefaultState = () => {
  return {
    name: '',
    out: '',
    roles: [],
    logo: ''
  }
}
const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_OUT: (state, out) => {
    state.out = out
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_LOGO: (state, logo) => {
    state.logo = logo
  }
}
const actions = {
  getLogo({ commit }) {
    commit('SET_LOGO', require('@/assets/img/logo.png'))
  },
  // user login
  async login({ commit }, userInfo) {
    try {
      // const { username, password } = userInfo
      // const res = await api.user.login({ username: username.trim(), password: password })
      // return res
      return userInfo
    } catch (e) {
      return Promise.reject(e)
    }
  },

  // get user info
  async getSysInfo({ dispatch, commit, state }) {
    try {
      const res = await api.sys.getSysInfo({})
      if (res.result) {
        const { roles, username, logout_url } = res.data
        commit('SET_ROLES', roles)
        commit('SET_NAME', username)
        commit('SET_OUT', logout_url)
        dispatch('getLogo')
        return res.data
      } else {
        return Promise.reject('系统初始化失败')
      }
    } catch (e) {
      return Promise.reject(e)
    }
  },
  // user logout
  async logout({ commit, state }) {
    try {
      // await api.sys.logout()
      resetRouter()
      commit('RESET_STATE')
      return Promise.resolve()
    } catch (e) {
      return Promise.reject(e)
    }
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
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
