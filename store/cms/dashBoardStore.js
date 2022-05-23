const getDefaultState = () => {
  return {
    formSelectSortType: {
      sort: '',
      order: '',
    },
    circulationPageSelectSortType: {
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
  setFormSelectSortType(state, data) {
    state.formSelectSortType = data
  },
  setCirculationPageSelectSortType(state, data) {
    state.circulationPageSelectSortType = data
  },
  resetFormSelectSortType(state) {
    state.formSelectSortType = getDefaultState().formSelectSortType
  },
  resetCirculationPageSelectSortType(state) {
    state.circulationPageSelectSortType = getDefaultState().circulationPageSelectSortType
  },
}

export const actions = {}
