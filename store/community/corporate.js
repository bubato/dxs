const getDefaultState = () => {
  return {
    corporateData: {},
  }
}

export const state = getDefaultState

export const getters = {}

export const mutations = {
  resetDefaultState(state) {
    Object.assign(state, getDefaultState())
  },
  setCorporateData(state, data) {
    state.corporateData = data
  },
}

export const actions = {}
