export const state = () => ({
  componentsData: [],
  testPageData: [],
})

export const getters = {
  getComponentsData(state) {
    return state.componentsData
  },
  getTestPageData(state) {
    return state.testPageData
  },
}

export const mutations = {
  setComponentsData(state, data) {
    state.componentsData = data
  },
  setTestPageData(state, data) {
    state.testPageData = data
  },
}

export const actions = {
  async fetchComponentsData({ commit }) {
    const url = '/apis/components.json'
    const response = await this.$axios.$get(url)
    commit('setComponentsData', response)
  },
  async fetchTestPageData({ commit }) {
    const url = '/apis/test_dxs_frontend.json'
    const response = await this.$axios.$get(url)
    commit('setTestPageData', response)
  },
}
