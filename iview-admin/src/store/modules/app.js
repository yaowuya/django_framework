const state = {
  collapsed: false
}

const mutations = {
  TOGGLE_COLLAPSED: (state, collapsed) => {
    state.collapsed = collapsed
  }
}

const actions = {
  toggleCollapse({ commit }, collapsed) {
    commit('TOGGLE_COLLAPSED', collapsed)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
