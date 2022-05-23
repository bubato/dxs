const getDefaultState = () => {
  return {
    sideNavIsOpen: true,
  }
}

export const state = getDefaultState

export const getters = {}

export const mutations = {
  resetDefaultState(state) {
    Object.assign(state, getDefaultState())
  },
  setSideNavIsOpen(state, flag) {
    state.sideNavIsOpen = flag
  },
}

export const actions = {}
