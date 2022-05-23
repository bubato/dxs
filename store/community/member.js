const getDefaultState = () => {
  return {
    showCancelConfirmConnectionModalFlg: false,
    selectUserId: null,
  }
}

export const state = getDefaultState

export const getters = {}

export const mutations = {
  resetDefaultState(state) {
    Object.assign(state, getDefaultState())
  },
  showCancelConfirmConnectionModal(state) {
    state.showCancelConfirmConnectionModalFlg = true
  },
  hideCancelConfirmConnectionModal(state) {
    state.showCancelConfirmConnectionModalFlg = false
  },
  setSelectUserId(state, val) {
    state.selectUserId = val
  },
}

export const actions = {}
