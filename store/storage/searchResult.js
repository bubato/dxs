const getDefaultState = () => {
  return {
    searchResultData: {},
    storageSearchText: '',
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
  setStorageSearchText(state, data) {
    state.storageSearchText = data
  },
}
