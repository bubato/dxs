const getDefaultState = () => {
  return {
    selectSortType: {
      sort: '',
      order: '',
    },
    // テーブルにて選択した顧問先
    selectLinkageId: {},
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
  setSelectLinkageId(state, val) {
    state.selectLinkageId = val
  },
}

export const actions = {}
