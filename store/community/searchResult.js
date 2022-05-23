const getDefaultState = () => {
  return {
    searchResultData: {},
    connectionSearchText: '',
  }
}

export const state = getDefaultState

export const mutations = {
  resetDefaultState(state) {
    Object.assign(state, getDefaultState())
  },
  setSearchResultData(state, data) {
    state.searchResultData = data
  },
  setConnectionSearchText(state, data) {
    state.connectionSearchText = data
  },
}
