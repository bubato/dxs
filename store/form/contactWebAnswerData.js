const getDefaultState = () => {
  return {
    answerDataInfo: [],
    searchOptions: {
      status: [],
    },
    showDeleteWebAnswerDataModalFlg: false,
  }
}

export const state = getDefaultState

export const getters = {}

export const mutations = {
  resetDefaultState(state) {
    Object.assign(state, getDefaultState())
  },
  setAnswerDataInfo(state, val) {
    state.answerDataInfo = val
  },
  setSearchOptions(state, val) {
    state.searchOptions = val
  },
  showDeleteWebAnswerDataModal(state) {
    state.showDeleteWebAnswerDataModalFlg = true
  },
  hideDeleteWebAnswerDataModal(state) {
    state.showDeleteWebAnswerDataModalFlg = false
  },
}

export const actions = {}
