const getDefaultState = () => {
  return {
    firmKind: '1', // 事業者区分（"0：一般事業者1：MJSに関連する会計事務所2：○○○の会計事務所"）
    isDataLakeActivate: true,
  }
}

export const state = getDefaultState

export const getters = {}

export const mutations = {
  setFirmKind(state, kindNumber) {
    state.firmKind = kindNumber
  },
  setIsDataLakeActivate(state, val) {
    state.isDataLakeActivate = val
  },
}

export const actions = {}
