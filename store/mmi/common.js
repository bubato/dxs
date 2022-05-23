const getDefaultState = () => {
  return {
    displayCategory: '1000',
  }
}

export const state = getDefaultState

export const getters = {}

export const mutations = {
  resetDefaultState(state) {
    Object.assign(state, getDefaultState())
  },
  setDisplayCategory(state, val) {
    state.displayCategory = val
  },
}

export const actions = {}
