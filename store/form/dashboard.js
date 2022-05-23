const getDefaultState = () => {
  return {
    selectSortType: {
      sort: '',
      order: '',
    },
  }
}

export const state = getDefaultState

export const getters = {}

export const mutations = {
  resetDefaultState(state) {
    Object.assign(state, getDefaultState())
  },
  setSelectSortType(state, val) {
    state.selectSortType = val
  },
  resetSelectSortType(state) {
    state.selectSortType = getDefaultState().selectSortType
  },
}

export const actions = {}
